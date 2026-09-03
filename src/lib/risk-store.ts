import { useSyncExternalStore } from "react";
import { notifyAlertCreated } from "./notification-service";
import {
  clearSession,
  ensureSeeded,
  getSession,
  hydrateAuth,
  isAuthenticated,
  loginUser,
  registerUser,
  resetPassword,
  changePassword,
  updateUserEmail,
  normalizeEmail,
  EMAIL_ALREADY_EXISTS_ERROR,
  ORPHANED_PROFILE_ERROR,
  resolveEmailRegistrationConflict,
  SUPER_ADMIN_EMAIL,
  type AuthResult,
} from "./auth";
import {
  legacyFlagsFromAssessment,
  type CyberAssessmentPayload,
} from "./cyber-threats";
import { isRemoteAuthEnabled } from "./remote-auth";
import {
  loadAllRemoteRiskStates,
  loadRemoteRiskState,
  saveRemoteRiskState,
  stateHasMonitoringData,
} from "./remote-risk";

export type Severity = "low" | "medium" | "high";
export type Category = "financial" | "cybersecurity" | "compliance" | "operational";

export type AlertStatus = "active" | "reviewed" | "resolved";

export type Alert = {
  id: string;
  category: Category;
  severity: Severity;
  title: string;
  action: string;
  date: string;
  status: AlertStatus;
};

export type FinancialEntry = {
  id: string;
  date: string;
  income: number;
  expenses: number;
  outstanding: number;
};
export type CyberEntry = {
  id: string;
  date: string;
  /** Legacy flags kept for dashboard compatibility and older records. */
  passwordUpdated: boolean;
  antivirusActive: boolean;
  suspicious: boolean;
  /** Threat-based assessment payload (new cybersecurity flow). */
  assessment?: CyberAssessmentPayload;
};
export type ComplianceEntry = {
  id: string;
  date: string;
  taxDeadline: string;
  taxStatus: string;
  licenseExpiry: string;
  licenseStatus: string;
};
export type OperationalEntry = {
  id: string;
  date: string;
  staffPresent: number;
  staffRequired: number;
  equipment: "working" | "faulty";
  delivery: "on-schedule" | "delayed";
};

export type Profile = {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  businessType: string;
  employees: number;
};

export type State = {
  profile: Profile;
  financial: FinancialEntry[];
  cyber: CyberEntry[];
  compliance: ComplianceEntry[];
  operational: OperationalEntry[];
  alerts: Alert[];
};

export type AppState = State & { authed: boolean };

const today = () => new Date().toISOString().slice(0, 10);
/** Short display IDs for entries/alerts (e.g. Alert ID column). DB sync remaps non-UUIDs. */
const uid = () => Math.random().toString(36).slice(2, 10);

const stateKey = (userId: string) => `srs:state:v1:${userId}`;
/** Dispatched after persisting SME profile/risk data so portal dashboards can refresh. */
const STATE_CHANGED_EVENT = "srs:state-changed";

const guestProfile: Profile = {
  businessName: "",
  ownerName: "",
  email: "",
  phone: "",
  businessType: "Retail",
  employees: 0,
};

function emptyState(profile: Profile = guestProfile): State {
  return { profile, financial: [], cyber: [], compliance: [], operational: [], alerts: [] };
}

function writeLocalState(userId: string, next: State) {
  if (typeof window === "undefined") return;
  localStorage.setItem(stateKey(userId), JSON.stringify(next));
  window.dispatchEvent(new Event(STATE_CHANGED_EVENT));
}

function loadUserState(userId: string, fallback: State): State {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(stateKey(userId));
    if (raw) {
      const parsed = JSON.parse(raw) as State & { authed?: boolean };
      delete parsed.authed;
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return fallback;
}

/** Seed a local profile mirror so admin dashboards can show SMEs created on other devices. */
export function mirrorRemoteAccountProfile(userId: string, profile: Profile) {
  const existing = loadStateForUser(userId);
  if (!existing) {
    writeLocalState(userId, emptyState(profile));
    return;
  }
  if (existing.profile.businessName.trim()) return;
  writeLocalState(userId, {
    ...existing,
    profile: { ...existing.profile, ...profile, email: profile.email || existing.profile.email },
  });
}

export function loadStateForUser(userId: string): State | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(stateKey(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as State & { authed?: boolean };
    delete parsed.authed;
    return parsed;
  } catch {
    return null;
  }
}

/** Mirror remote SME states into localStorage so admin dashboards stay sync-friendly. */
export async function syncAllRemoteRiskStates(): Promise<void> {
  if (typeof window === "undefined") return;
  if (!(await isRemoteAuthEnabled())) return;
  const states = await loadAllRemoteRiskStates();
  for (const [userId, remoteState] of Object.entries(states)) {
    writeLocalState(userId, remoteState);
  }
}

async function resolveUserState(userId: string, fallback: State): Promise<State> {
  if (!(await isRemoteAuthEnabled())) {
    return loadUserState(userId, fallback);
  }

  const remote = await loadRemoteRiskState(userId);
  if (remote && stateHasMonitoringData(remote)) {
    writeLocalState(userId, remote);
    return remote;
  }

  const local = loadUserState(userId, fallback);
  if (stateHasMonitoringData(local) || local.profile.businessName) {
    const saved = await saveRemoteRiskState(userId, local);
    if (saved) {
      writeLocalState(userId, saved);
      return saved;
    }
  }

  if (remote) {
    writeLocalState(userId, remote);
    return remote;
  }

  return local;
}

const adminProfile: Profile = {
  businessName: "SME Risk Sentinel",
  ownerName: "System Administrator",
  email: SUPER_ADMIN_EMAIL,
  phone: "",
  businessType: "Platform",
  employees: 0,
};

let currentUserId: string | null = null;
let state: State = emptyState();
let snapshotCache: AppState | null = null;
/** Set after logout so the login route skips auto-redirect and clears the form. */
let postLogoutLoginVisit = false;
const listeners = new Set<() => void>();
let remotePersistTimer: ReturnType<typeof setTimeout> | null = null;
let remotePersistChain: Promise<void> = Promise.resolve();
let remotePersistSeq = 0;

export function isPostLogoutLoginVisit(): boolean {
  return postLogoutLoginVisit;
}

/** Consumed by the login page after logout to reset email/password fields. */
export function consumePostLogoutLoginVisit(): boolean {
  if (!postLogoutLoginVisit) return false;
  postLogoutLoginVisit = false;
  return true;
}

function buildSnapshot(): AppState {
  return { ...state, authed: isAuthenticated() && currentUserId !== null };
}

function invalidateSnapshot() {
  snapshotCache = null;
}

function getSnapshot(): AppState {
  if (!snapshotCache) snapshotCache = buildSnapshot();
  return snapshotCache;
}

function notify() {
  invalidateSnapshot();
  listeners.forEach((l) => l());
}

export function resetStoreAfterDataWipe(): void {
  currentUserId = null;
  state = emptyState();
  postLogoutLoginVisit = true;
  notify();
}

function initStoreFromSession() {
  if (typeof window === "undefined") return;
  const session = getSession();
  if (!session) {
    currentUserId = null;
    state = emptyState();
    return;
  }
  currentUserId = session.userId;
  state = loadUserState(session.userId, emptyState({ ...guestProfile, email: session.email }));
}

if (typeof window !== "undefined") {
  initStoreFromSession();
}

function persist(opts?: { skipRemote?: boolean }) {
  if (typeof window !== "undefined" && currentUserId) {
    writeLocalState(currentUserId, state);
  }
  notify();
  if (!opts?.skipRemote) scheduleRemotePersist();
}

function scheduleRemotePersist() {
  if (!currentUserId) return;
  const session = getSession();
  if (!session || session.role === "SUPER_ADMIN") return;
  const userId = currentUserId;
  const seq = ++remotePersistSeq;
  if (remotePersistTimer) clearTimeout(remotePersistTimer);
  remotePersistTimer = setTimeout(() => {
    remotePersistChain = remotePersistChain
      .then(async () => {
        if (seq !== remotePersistSeq || currentUserId !== userId) return;
        if (!(await isRemoteAuthEnabled())) return;
        const snapshot = state;
        const saved = await saveRemoteRiskState(userId, snapshot);
        if (!saved || seq !== remotePersistSeq || currentUserId !== userId) return;
        state = saved;
        writeLocalState(userId, saved);
        notify();
      })
      .catch((error) => {
        console.error("[risk] remote persist failed:", error);
      });
  }, 400);
}

async function switchToUser(userId: string, fallback: State) {
  currentUserId = userId;
  state = await resolveUserState(userId, fallback);
  persist({ skipRemote: true });
  // If we only have local/fallback data, push it up once.
  if (await isRemoteAuthEnabled()) {
    scheduleRemotePersist();
  }
}

function setState(updater: (s: State) => State) {
  state = updater(state);
  persist();
}

export const store = {
  getState: getSnapshot,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  hydrateFromSession: async () => {
    await hydrateAuth();
    const session = getSession();
    if (!session) {
      currentUserId = null;
      state = emptyState();
      notify();
      return;
    }
    currentUserId = session.userId;
    state = await resolveUserState(
      session.userId,
      emptyState({ ...guestProfile, email: session.email }),
    );
    persist({ skipRemote: true });
  },
  isAuthed: () => isAuthenticated() && currentUserId !== null,
  authenticate: async (email: string, password: string): Promise<AuthResult> => {
    await ensureSeeded();
    const result = await loginUser(normalizeEmail(email), password);
    if (!result.ok) return result;
    if (result.role === "SUPER_ADMIN") {
      await switchToUser(result.userId, emptyState(adminProfile));
    } else {
      const profile =
        result.profile ??
        ({
          ...guestProfile,
          email: result.email,
        } as Profile);
      const existing = loadStateForUser(result.userId);
      await switchToUser(
        result.userId,
        existing
          ? {
              ...existing,
              profile: {
                ...existing.profile,
                ...profile,
                email: result.email,
              },
            }
          : emptyState({ ...guestProfile, ...profile, email: result.email }),
      );
    }
    return result;
  },
  register: async (profile: Profile, password: string): Promise<AuthResult> => {
    await ensureSeeded();
    const normalizedEmail = normalizeEmail(profile.email);
    const conflict = await resolveEmailRegistrationConflict(normalizedEmail);
    if (conflict === "exists") {
      return { ok: false, error: EMAIL_ALREADY_EXISTS_ERROR };
    }
    if (conflict === "orphaned") {
      return { ok: false, error: ORPHANED_PROFILE_ERROR };
    }
    const result = await registerUser(normalizedEmail, password, {
      businessName: profile.businessName,
      ownerName: profile.ownerName,
      phone: profile.phone,
      businessType: profile.businessType,
      employees: profile.employees,
    });
    if (!result.ok) return result;
    const nextProfile = result.profile
      ? { ...profile, ...result.profile, email: result.email }
      : { ...profile, email: result.email };
    await switchToUser(result.userId, emptyState(nextProfile));
    return result;
  },
  logout: () => {
    if (remotePersistTimer) clearTimeout(remotePersistTimer);
    remotePersistSeq += 1;
    clearSession();
    currentUserId = null;
    state = emptyState();
    postLogoutLoginVisit = true;
    notify();
  },
  resetPassword: (email: string, newPassword: string) => resetPassword(email, newPassword),
  changePassword: (currentPassword: string, newPassword: string) => {
    const session = getSession();
    if (!session) return Promise.resolve({ ok: false as const, error: "Not signed in." });
    return changePassword(session.userId, currentPassword, newPassword);
  },
  updateProfile: async (p: Partial<Profile>) => {
    if (
      p.email &&
      currentUserId &&
      normalizeEmail(p.email) !== normalizeEmail(state.profile.email)
    ) {
      const result = await updateUserEmail(currentUserId, p.email);
      if (!result.ok) return result;
    }
    setState((s) => ({ ...s, profile: { ...s.profile, ...p } }));
    return { ok: true as const, userId: currentUserId!, email: state.profile.email };
  },
  reset: () => {
    if (!currentUserId) return;
    state = emptyState(state.profile);
    persist();
  },
  addFinancial: (e: Omit<FinancialEntry, "id" | "date">) => {
    const entry: FinancialEntry = { ...e, id: uid(), date: today() };
    setState((s) => ({ ...s, financial: [...s.financial, entry] }));
    runFinancialRules(entry);
  },
  addCyber: (e: Omit<CyberEntry, "id" | "date">) => {
    const entry: CyberEntry = { ...e, id: uid(), date: today() };
    setState((s) => ({ ...s, cyber: [...s.cyber, entry] }));
    runCyberRules(entry);
  },
  addCyberAssessment: (assessment: CyberAssessmentPayload) => {
    const flags = legacyFlagsFromAssessment(assessment);
    const entry: CyberEntry = {
      id: uid(),
      date: today(),
      ...flags,
      assessment,
    };
    setState((s) => ({ ...s, cyber: [...s.cyber, entry] }));
    runCyberRules(entry);
  },
  addCompliance: (e: Omit<ComplianceEntry, "id" | "date">) => {
    const entry: ComplianceEntry = { ...e, id: uid(), date: today() };
    setState((s) => ({ ...s, compliance: [...s.compliance, entry] }));
    runComplianceRules(entry);
  },
  addOperational: (e: Omit<OperationalEntry, "id" | "date">) => {
    const entry: OperationalEntry = { ...e, id: uid(), date: today() };
    setState((s) => ({ ...s, operational: [...s.operational, entry] }));
    runOperationalRules(entry);
  },
  markReviewed: (id: string) =>
    setState((s) => ({
      ...s,
      alerts: s.alerts.map((a) =>
        a.id === id && a.status === "active" ? { ...a, status: "reviewed" as const } : a,
      ),
    })),
  markResolved: (id: string) =>
    setState((s) => ({
      ...s,
      alerts: s.alerts.map((a) =>
        a.id === id && a.status !== "resolved" ? { ...a, status: "resolved" as const } : a,
      ),
    })),
  resolveAlert: (id: string) =>
    setState((s) => ({
      ...s,
      alerts: s.alerts.map((a) =>
        a.id === id && a.status !== "resolved" ? { ...a, status: "resolved" as const } : a,
      ),
    })),
  resolveAllActive: () =>
    setState((s) => ({
      ...s,
      alerts: s.alerts.map((a) =>
        a.status === "active" ? { ...a, status: "resolved" as const } : a,
      ),
    })),
  syncAlertsFromLatest,
};

function alertDedupeKey(a: Pick<Alert, "category" | "title">) {
  return `${a.category}:${a.title}`;
}

type PushAlertOptions = { syncOnly?: boolean };

function notifyNewAlert(alert: Alert) {
  if (typeof window === "undefined") return;
  const profile = { ...state.profile };
  void notifyAlertCreated({
    alert,
    profile,
    dashboardUrl: `${window.location.origin}/app/alerts`,
  });
}

function pushAlert(a: Omit<Alert, "id" | "date" | "status">, opts?: PushAlertOptions) {
  const key = alertDedupeKey(a);
  const existing = state.alerts.find((x) => alertDedupeKey(x) === key);
  if (existing) {
    if (existing.status === "active") return;
    if (opts?.syncOnly) return;
    const alert: Alert = {
      ...existing,
      ...a,
      status: "active",
      date: today(),
    };
    setState((s) => ({
      ...s,
      alerts: [alert, ...s.alerts.filter((x) => x.id !== existing.id)],
    }));
    notifyNewAlert(alert);
    return;
  }
  const alert: Alert = { ...a, id: uid(), date: today(), status: "active" };
  setState((s) => ({ ...s, alerts: [alert, ...s.alerts] }));
  notifyNewAlert(alert);
}

function syncAlertsFromLatest() {
  const syncOpts: PushAlertOptions = { syncOnly: true };
  const e = state.financial.at(-1);
  if (e) runFinancialRules(e, syncOpts);
  const c = state.cyber.at(-1);
  if (c) runCyberRules(c, syncOpts);
  const co = state.compliance.at(-1);
  if (co) runComplianceRules(co, syncOpts);
  const o = state.operational.at(-1);
  if (o) runOperationalRules(o, syncOpts);
}

export type AlertCandidate = Omit<Alert, "id" | "date" | "status">;

export function daysUntilDate(dateStr: string, now = Date.now()): number {
  return Math.floor((new Date(dateStr).getTime() - now) / 86400000);
}

export function evaluateFinancialAlerts(e: FinancialEntry): AlertCandidate[] {
  const alerts: AlertCandidate[] = [];
  if (e.expenses > e.income) {
    alerts.push({
      category: "financial",
      severity: "high",
      title: "Expenses exceed income",
      action: "Review variable costs and renegotiate non-essential spending immediately.",
    });
  } else if (e.income - e.expenses < e.income * 0.1) {
    alerts.push({
      category: "financial",
      severity: "medium",
      title: "Low profit margin (<10%)",
      action: "Identify top-margin products and prioritize sales of higher-margin items.",
    });
  }
  if (e.outstanding > e.income * 0.2) {
    alerts.push({
      category: "financial",
      severity: e.outstanding > e.income * 0.4 ? "high" : "medium",
      title: "Outstanding payments above threshold",
      action: "Send collection reminders and offer short-term payment plans.",
    });
  }
  return alerts;
}

export function evaluateCyberAlerts(e: CyberEntry): AlertCandidate[] {
  if (e.assessment) {
    const alerts: AlertCandidate[] = [];
    for (const threat of e.assessment.threats) {
      if (threat.level !== "high" && threat.level !== "medium") continue;
      alerts.push({
        category: "cybersecurity",
        severity: threat.level,
        title:
          threat.level === "high"
            ? `High cybersecurity risk: ${threat.threatName}`
            : `Medium cybersecurity risk: ${threat.threatName}`,
        action: threat.recommendedActions[0] ?? threat.reason,
      });
    }
    if (alerts.length === 0 && e.assessment.overallLevel !== "low") {
      alerts.push({
        category: "cybersecurity",
        severity: e.assessment.overallLevel,
        title: `${e.assessment.overallLabel} detected`,
        action: e.assessment.overallReason,
      });
    }
    return alerts;
  }

  const alerts: AlertCandidate[] = [];
  if (!e.antivirusActive) {
    alerts.push({
      category: "cybersecurity",
      severity: "high",
      title: "Antivirus inactive",
      action: "Re-enable endpoint protection on all devices today.",
    });
  }
  if (e.suspicious) {
    alerts.push({
      category: "cybersecurity",
      severity: "high",
      title: "Suspicious activity reported",
      action: "Isolate affected accounts and force a password reset.",
    });
  }
  if (!e.passwordUpdated) {
    alerts.push({
      category: "cybersecurity",
      severity: "medium",
      title: "Passwords not updated",
      action: "Rotate all admin and shared-account passwords within 7 days.",
    });
  }
  return alerts;
}

export function evaluateComplianceAlerts(
  e: ComplianceEntry,
  now = Date.now(),
): AlertCandidate[] {
  const alerts: AlertCandidate[] = [];
  const td = daysUntilDate(e.taxDeadline, now);
  if (td < 0) {
    alerts.push({
      category: "compliance",
      severity: "high",
      title: "Tax deadline passed",
      action: "File outstanding tax submissions and contact a tax advisor.",
    });
  } else if (td <= 7) {
    alerts.push({
      category: "compliance",
      severity: "medium",
      title: `Tax deadline in ${td} days`,
      action: "Prepare filing documents and confirm payment schedule.",
    });
  }
  const ld = daysUntilDate(e.licenseExpiry, now);
  if (ld < 0) {
    alerts.push({
      category: "compliance",
      severity: "high",
      title: "Business license expired",
      action: "Renew license immediately to avoid operating illegally.",
    });
  } else if (ld <= 7) {
    alerts.push({
      category: "compliance",
      severity: "medium",
      title: `License expires in ${ld} days`,
      action: "Submit renewal paperwork this week.",
    });
  }
  return alerts;
}

export function evaluateOperationalAlerts(e: OperationalEntry): AlertCandidate[] {
  const alerts: AlertCandidate[] = [];
  if (e.staffPresent < e.staffRequired) {
    alerts.push({
      category: "operational",
      severity: "medium",
      title: "Low staff availability",
      action: "Schedule cover or activate part-time staff for the shortfall.",
    });
  }
  if (e.equipment === "faulty") {
    alerts.push({
      category: "operational",
      severity: "medium",
      title: "Faulty equipment reported",
      action: "Log a service request and prepare a backup workflow.",
    });
  }
  if (e.delivery === "delayed") {
    alerts.push({
      category: "operational",
      severity: "medium",
      title: "Delivery delayed",
      action: "Notify affected customers and confirm new ETA with supplier.",
    });
  }
  return alerts;
}

function runFinancialRules(e: FinancialEntry, opts?: PushAlertOptions) {
  for (const alert of evaluateFinancialAlerts(e)) pushAlert(alert, opts);
}
function runCyberRules(e: CyberEntry, opts?: PushAlertOptions) {
  for (const alert of evaluateCyberAlerts(e)) pushAlert(alert, opts);
}
function runComplianceRules(e: ComplianceEntry, opts?: PushAlertOptions) {
  for (const alert of evaluateComplianceAlerts(e)) pushAlert(alert, opts);
}
function runOperationalRules(e: OperationalEntry, opts?: PushAlertOptions) {
  for (const alert of evaluateOperationalAlerts(e)) pushAlert(alert, opts);
}

// --- Risk computation -------------------------------------------------------

export type Risk = { level: Severity; score: number; label: string };

export const RISK_SCORE_HIGH_THRESHOLD = 75;
export const RISK_SCORE_MEDIUM_THRESHOLD = 40;

export function riskLevelFromScore(score: number): Severity {
  if (score >= RISK_SCORE_HIGH_THRESHOLD) return "high";
  if (score >= RISK_SCORE_MEDIUM_THRESHOLD) return "medium";
  return "low";
}

const labelOf = (l: Severity) => ({ low: "Low Risk", medium: "Medium Risk", high: "High Risk" })[l];

export function financialRisk(s: State | AppState): Risk {
  const e = s.financial.at(-1);
  if (!e) return { level: "low", score: 10, label: labelOf("low") };
  let score = 15;
  if (e.expenses > e.income) score = 90;
  else if (e.income - e.expenses < e.income * 0.1) score = Math.max(score, 60);
  if (e.outstanding > e.income * 0.4) score = Math.max(score, 80);
  else if (e.outstanding > e.income * 0.2) score = Math.max(score, 55);
  const lvl = riskLevelFromScore(score);
  return { level: lvl, score, label: labelOf(lvl) };
}
export function cyberRisk(s: State | AppState): Risk {
  const e = s.cyber.at(-1);
  if (!e) return { level: "low", score: 10, label: labelOf("low") };
  if (e.assessment) {
    const score = e.assessment.overallScore;
    const lvl = e.assessment.overallLevel;
    return { level: lvl, score, label: e.assessment.overallLabel };
  }
  let score = 15;
  if (!e.antivirusActive) score = Math.max(score, 90);
  if (e.suspicious) score = Math.max(score, 88);
  if (!e.passwordUpdated) score = Math.max(score, 55);
  const lvl = riskLevelFromScore(score);
  return { level: lvl, score, label: labelOf(lvl) };
}
export function complianceRisk(s: State | AppState, now = Date.now()): Risk {
  const e = s.compliance.at(-1);
  if (!e) return { level: "low", score: 10, label: labelOf("low") };
  let score = 15;
  const td = daysUntilDate(e.taxDeadline, now);
  if (td < 0) score = Math.max(score, 90);
  else if (td <= 7) score = Math.max(score, 60);
  const ld = daysUntilDate(e.licenseExpiry, now);
  if (ld < 0) score = Math.max(score, 90);
  else if (ld <= 7) score = Math.max(score, 60);
  const lvl = riskLevelFromScore(score);
  return { level: lvl, score, label: labelOf(lvl) };
}
export function operationalRisk(s: State | AppState): Risk {
  const e = s.operational.at(-1);
  if (!e) return { level: "low", score: 10, label: labelOf("low") };
  let score = 15;
  if (e.staffPresent < e.staffRequired) score = Math.max(score, 55);
  if (e.equipment === "faulty") score = Math.max(score, 60);
  if (e.delivery === "delayed") score = Math.max(score, 55);
  const lvl = riskLevelFromScore(score);
  return { level: lvl, score, label: labelOf(lvl) };
}
export function overallRisk(s: State | AppState, now = Date.now()): Risk {
  const all = [financialRisk(s), cyberRisk(s), complianceRisk(s, now), operationalRisk(s)];
  const score = Math.round(all.reduce((a, r) => a + r.score, 0) / all.length);
  const lvl = riskLevelFromScore(score);
  return { level: lvl, score, label: labelOf(lvl) };
}

export function hasFinancialData(s: State | AppState): boolean {
  return s.financial.length > 0;
}

export function hasCyberData(s: State | AppState): boolean {
  return s.cyber.length > 0;
}

export function hasComplianceData(s: State | AppState): boolean {
  return s.compliance.length > 0;
}

export function hasOperationalData(s: State | AppState): boolean {
  return s.operational.length > 0;
}

export function hasAnyRiskData(s: State | AppState): boolean {
  return hasFinancialData(s) || hasCyberData(s) || hasComplianceData(s) || hasOperationalData(s);
}

const serverSnapshot = { ...emptyState(), authed: false } as AppState;

export function useStore<T>(selector: (s: AppState) => T): T {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(getSnapshot()),
    () => selector(serverSnapshot),
  );
}

export const categoryLinks: Record<Category, string> = {
  financial: "/app/financial",
  cybersecurity: "/app/cybersecurity",
  compliance: "/app/compliance",
  operational: "/app/operational",
};

export type Recommendation = {
  priority: number;
  title: string;
  action: string;
  category: Category;
  href: string;
};

const severityPriority: Record<Severity, number> = { high: 3, medium: 2, low: 1 };

export function getRecommendations(s: State | AppState, limit = 6): Recommendation[] {
  const items: Recommendation[] = [];

  for (const alert of s.alerts.filter((a) => a.status === "active")) {
    items.push({
      priority: severityPriority[alert.severity],
      title: alert.title,
      action: alert.action,
      category: alert.category,
      href: categoryLinks[alert.category],
    });
  }

  const checks: { category: Category; risk: Risk; hint: string }[] = [
    {
      category: "financial",
      risk: financialRisk(s),
      hint: "Review income, expenses, and outstanding payments.",
    },
    {
      category: "cybersecurity",
      risk: cyberRisk(s),
      hint: "Run a cybersecurity threat assessment and follow recommended actions.",
    },
    {
      category: "compliance",
      risk: complianceRisk(s),
      hint: "Confirm tax and license deadlines are on track.",
    },
    {
      category: "operational",
      risk: operationalRisk(s),
      hint: "Update staffing, equipment, and delivery status.",
    },
  ];

  for (const { category, risk, hint } of checks) {
    if (risk.level === "low") continue;
    const title = `${category.charAt(0).toUpperCase()}${category.slice(1)} risk is ${risk.label.toLowerCase()}`;
    if (items.some((i) => i.title === title)) continue;
    items.push({
      priority: severityPriority[risk.level],
      title,
      action: hint,
      category,
      href: categoryLinks[category],
    });
  }

  return items
    .sort((a, b) => b.priority - a.priority)
    .filter((item, i, arr) => arr.findIndex((x) => x.title === item.title) === i)
    .slice(0, limit);
}

export function riskAtDate(s: State | AppState, date: string, category: Category): Risk {
  const cut = {
    ...s,
    financial: s.financial.filter((e) => e.date <= date),
    cyber: s.cyber.filter((e) => e.date <= date),
    compliance: s.compliance.filter((e) => e.date <= date),
    operational: s.operational.filter((e) => e.date <= date),
  };
  if (category === "financial") return financialRisk(cut);
  if (category === "cybersecurity") return cyberRisk(cut);
  if (category === "compliance") return complianceRisk(cut);
  return operationalRisk(cut);
}

export const severityColor: Record<Severity, string> = {
  low: "bg-success text-success-foreground",
  medium: "bg-warning text-warning-foreground",
  high: "bg-destructive text-destructive-foreground",
};
export const alertStatusColor: Record<AlertStatus, string> = {
  active: "bg-destructive/10 text-destructive",
  reviewed: "bg-warning/10 text-warning",
  resolved: "bg-success/10 text-success",
};
export const severityRing: Record<Severity, string> = {
  low: "ring-success/40 text-success",
  medium: "ring-warning/40 text-warning",
  high: "ring-destructive/40 text-destructive",
};
