import { useSyncExternalStore } from "react";
import {
  getAllUsers,
  getUserById,
  updateUserStatus,
  isSuperAdmin,
  isAuthenticated,
  syncRemoteUserDirectory,
  USERS_CHANGED_EVENT,
  type UserStatus,
} from "./auth";
import {
  loadStateForUser,
  overallRisk,
  financialRisk,
  cyberRisk,
  complianceRisk,
  operationalRisk,
  syncAllRemoteRiskStates,
  type Severity,
  type Profile,
  type State,
} from "./risk-store";

export type SmeRecord = {
  userId: string;
  email: string;
  businessName: string;
  ownerName: string;
  businessType: string;
  riskLevel: Severity;
  riskLabel: string;
  overallScore: number;
  accountStatus: UserStatus;
  createdAt: string;
  alertCount: number;
  activeAlerts: number;
  hasMonitoringData: boolean;
};

export type PlatformMetrics = {
  totalSmes: number;
  activeSmes: number;
  suspendedSmes: number;
  highRiskSmes: number;
  totalAlerts: number;
  totalReports: number;
};

export type RiskAggregation = {
  financial: { low: number; medium: number; high: number; avgScore: number };
  cybersecurity: { low: number; medium: number; high: number; avgScore: number };
  compliance: { low: number; medium: number; high: number; avgScore: number };
  operational: { low: number; medium: number; high: number; avgScore: number };
};

export type AdminDashboardData = {
  metrics: PlatformMetrics;
  riskDistribution: { name: string; value: number }[];
  registrationTrends: { month: string; count: number }[];
  alertTrends: { month: string; count: number }[];
  categoryDistribution: { name: string; value: number }[];
  riskAggregation: RiskAggregation;
  smes: SmeRecord[];
};

const listeners = new Set<() => void>();
let cache: AdminDashboardData | null = null;
let syncStarted = false;

/** SME profile/risk data writes in the current tab. */
const STATE_CHANGED_EVENT = "srs:state-changed";
const USERS_STORAGE_KEY = "srs:users:v1";
const STATE_STORAGE_PREFIX = "srs:state:v1:";

function notify() {
  cache = null;
  listeners.forEach((l) => l());
}

function storageKeyAffectsAdmin(key: string | null) {
  return key === USERS_STORAGE_KEY || key?.startsWith(STATE_STORAGE_PREFIX) === true;
}

/** Keep portal metrics in sync when accounts or SME profiles change (same or other tabs). */
export function initAdminStoreSync() {
  if (typeof window === "undefined" || syncStarted) return;
  syncStarted = true;

  window.addEventListener("storage", (event) => {
    if (storageKeyAffectsAdmin(event.key)) notify();
  });
  window.addEventListener(USERS_CHANGED_EVENT, notify);
  window.addEventListener(STATE_CHANGED_EVENT, notify);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") notify();
  });
}

function countByLevel(counts: { low: number; medium: number; high: number }, level: Severity) {
  counts[level]++;
}

function buildSmeRecord(user: {
  id: string;
  email: string;
  createdAt: string;
  status: UserStatus;
}): SmeRecord {
  const state = loadStateForUser(user.id);
  const profile = state?.profile ?? emptyProfile(user.email);
  const risk = state
    ? overallRisk(state)
    : { level: "low" as Severity, score: 0, label: "Low Risk" };
  const alerts = state?.alerts ?? [];
  const hasMonitoringData =
    !!state &&
    (state.financial.length > 0 ||
      state.cyber.length > 0 ||
      state.compliance.length > 0 ||
      state.operational.length > 0);

  return {
    userId: user.id,
    email: user.email,
    businessName: profile.businessName || "—",
    ownerName: profile.ownerName || "—",
    businessType: profile.businessType || "—",
    riskLevel: risk.level,
    riskLabel: risk.label,
    overallScore: risk.score,
    accountStatus: user.status,
    createdAt: user.createdAt,
    alertCount: alerts.length,
    activeAlerts: alerts.filter((a) => a.status === "active").length,
    hasMonitoringData,
  };
}

function emptyProfile(email: string): Profile {
  return { businessName: "", ownerName: "", email, phone: "", businessType: "Other", employees: 0 };
}

function monthKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string) {
  const [y, m] = key.split("-");
  return new Date(Number(y), Number(m) - 1).toLocaleDateString(undefined, {
    month: "short",
    year: "2-digit",
  });
}

function buildDashboardData(): AdminDashboardData {
  const smeUsers = getAllUsers().filter((u) => u.role === "SME_OWNER");
  const smes = smeUsers.map(buildSmeRecord);

  const metrics: PlatformMetrics = {
    totalSmes: smes.length,
    activeSmes: smes.filter((s) => s.accountStatus === "active").length,
    suspendedSmes: smes.filter((s) => s.accountStatus === "suspended").length,
    highRiskSmes: smes.filter((s) => s.riskLevel === "high").length,
    totalAlerts: smes.reduce((sum, s) => sum + s.alertCount, 0),
    totalReports: smes.filter((s) => s.hasMonitoringData).length,
  };

  const riskDistribution = [
    { name: "Low", value: smes.filter((s) => s.riskLevel === "low").length },
    { name: "Medium", value: smes.filter((s) => s.riskLevel === "medium").length },
    { name: "High", value: smes.filter((s) => s.riskLevel === "high").length },
  ];

  const regByMonth = new Map<string, number>();
  for (const u of smeUsers) {
    const key = monthKey(u.createdAt);
    regByMonth.set(key, (regByMonth.get(key) ?? 0) + 1);
  }
  const registrationTrends = [...regByMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([key, count]) => ({ month: monthLabel(key), count }));

  const alertByMonth = new Map<string, number>();
  for (const u of smeUsers) {
    const state = loadStateForUser(u.id);
    for (const a of state?.alerts ?? []) {
      const key = monthKey(a.date);
      alertByMonth.set(key, (alertByMonth.get(key) ?? 0) + 1);
    }
  }
  const alertTrends = [...alertByMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([key, count]) => ({ month: monthLabel(key), count }));

  const categoryCounts = new Map<string, number>();
  for (const s of smes) {
    categoryCounts.set(s.businessType, (categoryCounts.get(s.businessType) ?? 0) + 1);
  }
  const categoryDistribution = [...categoryCounts.entries()].map(([name, value]) => ({
    name,
    value,
  }));

  const riskAggregation: RiskAggregation = {
    financial: { low: 0, medium: 0, high: 0, avgScore: 0 },
    cybersecurity: { low: 0, medium: 0, high: 0, avgScore: 0 },
    compliance: { low: 0, medium: 0, high: 0, avgScore: 0 },
    operational: { low: 0, medium: 0, high: 0, avgScore: 0 },
  };

  let finTotal = 0;
  let cybTotal = 0;
  let comTotal = 0;
  let opsTotal = 0;
  const n = smeUsers.length || 1;

  for (const u of smeUsers) {
    const state = loadStateForUser(u.id);
    if (!state) continue;
    const fin = financialRisk(state);
    const cyb = cyberRisk(state);
    const com = complianceRisk(state);
    const ops = operationalRisk(state);
    countByLevel(riskAggregation.financial, fin.level);
    countByLevel(riskAggregation.cybersecurity, cyb.level);
    countByLevel(riskAggregation.compliance, com.level);
    countByLevel(riskAggregation.operational, ops.level);
    finTotal += fin.score;
    cybTotal += cyb.score;
    comTotal += com.score;
    opsTotal += ops.score;
  }

  riskAggregation.financial.avgScore = Math.round(finTotal / n);
  riskAggregation.cybersecurity.avgScore = Math.round(cybTotal / n);
  riskAggregation.compliance.avgScore = Math.round(comTotal / n);
  riskAggregation.operational.avgScore = Math.round(opsTotal / n);

  return {
    metrics,
    riskDistribution,
    registrationTrends,
    alertTrends,
    categoryDistribution,
    riskAggregation,
    smes,
  };
}

function getData(): AdminDashboardData {
  if (typeof window === "undefined") return emptyData;
  if (!cache) cache = buildDashboardData();
  return cache;
}

const emptyData: AdminDashboardData = {
  metrics: {
    totalSmes: 0,
    activeSmes: 0,
    suspendedSmes: 0,
    highRiskSmes: 0,
    totalAlerts: 0,
    totalReports: 0,
  },
  riskDistribution: [],
  registrationTrends: [],
  alertTrends: [],
  categoryDistribution: [],
  riskAggregation: {
    financial: { low: 0, medium: 0, high: 0, avgScore: 0 },
    cybersecurity: { low: 0, medium: 0, high: 0, avgScore: 0 },
    compliance: { low: 0, medium: 0, high: 0, avgScore: 0 },
    operational: { low: 0, medium: 0, high: 0, avgScore: 0 },
  },
  smes: [],
};

export const adminStore = {
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  getData,
  refresh: () => {
    notify();
    void (async () => {
      try {
        await syncRemoteUserDirectory();
        await syncAllRemoteRiskStates();
      } catch {
        // Keep existing local mirrors if remote sync fails.
      } finally {
        notify();
      }
    })();
  },
  isAdminAuthed: () => isAuthenticated() && isSuperAdmin(),
  getSmeDetails: (
    userId: string,
  ): { user: ReturnType<typeof getUserById>; state: State | null } => ({
    user: getUserById(userId),
    state: loadStateForUser(userId),
  }),
  suspendSme: async (userId: string) => {
    const result = await updateUserStatus(userId, "suspended");
    if (result.ok) notify();
    return result;
  },
  reactivateSme: async (userId: string) => {
    const result = await updateUserStatus(userId, "active");
    if (result.ok) notify();
    return result;
  },
};

export function useAdminStore<T>(selector: (d: AdminDashboardData) => T): T {
  return useSyncExternalStore(
    adminStore.subscribe,
    () => selector(getData()),
    () => selector(emptyData),
  );
}
