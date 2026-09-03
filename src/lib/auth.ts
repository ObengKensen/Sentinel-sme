import {
  JWT_REFRESH_THRESHOLD_MS,
  JWT_STORAGE_KEY,
  LEGACY_SESSION_KEY,
  sessionFromToken,
  type AuthSession,
  type UserRole,
} from "./auth/jwt.shared";
import { issueAuthTokenFn, verifyAuthTokenFn } from "./api/auth.functions";
import {
  checkRemoteEmailConflict,
  directoryRowFromRemote,
  fetchRemoteAccount,
  fetchRemoteAccounts,
  isRemoteAuthEnabled,
  readTokenSession,
  remoteChangePassword,
  remoteLogin,
  remoteRegister,
  remoteResetPassword,
  remoteUpdateEmail,
  remoteUpdateStatus,
  resetRemoteAuthCache,
  seedRemoteSuperAdmin,
  type RemoteProfile,
} from "./remote-auth";

export type { UserRole, AuthSession } from "./auth/jwt.shared";
export type UserStatus = "active" | "suspended";
export type { RemoteProfile };

const USERS_KEY = "srs:users:v1";
/** Pre-v1 localStorage key — merged into `srs:users:v1` on first load. */
const LEGACY_USERS_KEYS = ["srs:users"] as const;
/** Dispatched after any write to `srs:users:v1` so portal dashboards can refresh. */
export const USERS_CHANGED_EVENT = "srs:users-changed";

export type UserAccount = {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
  role: UserRole;
  status: UserStatus;
};

export type AuthResult =
  | { ok: true; userId: string; email: string; role: UserRole }
  | { ok: false; error: string };

/** Seeded portal operator credentials (local/dev bootstrap only). */
export const SUPER_ADMIN_EMAIL = "admin@smerisksentinel.com";
export const SUPER_ADMIN_PASSWORD = "SuperAdmin2024!";

export const EMAIL_ALREADY_EXISTS_ERROR =
  "An account with this email already exists. Please sign in instead.";

export const ORPHANED_PROFILE_ERROR =
  "An account with this email already exists but needs to be restored. Use Forgot password to regain access.";

const uid = () => Math.random().toString(36).slice(2, 10);

let memorySession: AuthSession | null = null;
let hydratePromise: Promise<boolean> | null = null;
/** Bumped on logout so in-flight hydrateAuth cannot restore a cleared session. */
let sessionGeneration = 0;

function isSessionGenerationStale(boundGeneration: number): boolean {
  return boundGeneration !== sessionGeneration;
}
let userStoreRepaired = false;
/** Serializes account-store writes so seed/register/login cannot clobber each other. */
let userStoreWriteChain: Promise<void> = Promise.resolve();

/**
 * Password hashing (client-side, not bcrypt):
 * SHA-256 via Web Crypto over UTF-8 bytes of `${salt}:${password}` → hex string.
 * Each account stores its own random salt (`crypto.randomUUID()`).
 */
const AUTH_DEBUG_KEY = "srs:debug:auth";

function authDebug(...args: unknown[]) {
  if (typeof window !== "undefined" && localStorage.getItem(AUTH_DEBUG_KEY) === "1") {
    console.debug("[auth]", ...args);
  }
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function emailsMatch(a: string, b: string) {
  return normalizeEmail(a) === normalizeEmail(b);
}

const STATE_KEY_PREFIX = "srs:state:v1:";

function isCompleteAuthRow(user: UserAccount): boolean {
  return Boolean(
    user.id &&
    user.email &&
    typeof user.passwordHash === "string" &&
    user.passwordHash.length > 0 &&
    typeof user.salt === "string" &&
    user.salt.length > 0 &&
    user.createdAt,
  );
}

/** When two rows share an email, prefer a complete credential row, then the newest. */
function pickPreferredDuplicate(existing: UserAccount, candidate: UserAccount): UserAccount {
  const existingComplete = isCompleteAuthRow(existing);
  const candidateComplete = isCompleteAuthRow(candidate);
  if (existingComplete && !candidateComplete) return existing;
  if (!existingComplete && candidateComplete) return candidate;
  return existing.createdAt >= candidate.createdAt ? existing : candidate;
}

/**
 * Collapse duplicate accounts that differ only by email casing (legacy data).
 * Invariants (must hold after every save):
 * - register → logout → reload → login succeeds for the same password
 * - legacy `srs:users` merges into v1 without dropping newer v1 credentials
 * - seedSuperAdmin only appends; never replaces the full store
 */
function dedupeUsersByEmail(users: UserAccount[]): UserAccount[] {
  const byEmail = new Map<string, UserAccount>();
  for (const user of users) {
    const key = normalizeEmail(user.email);
    const normalized = { ...user, email: key };
    const existing = byEmail.get(key);
    if (!existing) {
      byEmail.set(key, normalized);
      continue;
    }
    byEmail.set(key, pickPreferredDuplicate(existing, normalized));
  }
  return [...byEmail.values()];
}

/** Union by account id; trailing groups win field conflicts (v1 must be passed last). */
function mergeAccountsById(...groups: UserAccount[][]): UserAccount[] {
  const byId = new Map<string, UserAccount>();
  for (const group of groups) {
    for (const user of group) {
      if (!user?.id) continue;
      byId.set(user.id, migrateUser(user));
    }
  }
  return [...byId.values()];
}

function readUsersFromStorage(): UserAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return parseStoredUsers(raw).map(migrateUser);
  } catch {
    /* ignore malformed srs:users:v1 */
  }
  return [];
}

/**
 * One-time migration: merge legacy keys, normalize emails, dedupe corrupt rows.
 * Legacy keys are merged first; `srs:users:v1` wins id conflicts so fresh data is kept.
 */
function migrateAndRepairUserStore(): void {
  if (typeof window === "undefined" || userStoreRepaired) return;
  userStoreRepaired = true;

  const legacyCollected: UserAccount[] = [];
  let v1Users: UserAccount[] = [];

  for (const key of [USERS_KEY, ...LEGACY_USERS_KEYS]) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = parseStoredUsers(raw).map(migrateUser);
      if (key === USERS_KEY) v1Users = parsed;
      else legacyCollected.push(...parsed);
      if (key !== USERS_KEY) localStorage.removeItem(key);
    } catch (err) {
      authDebug("migrate parse failed", key, err);
      if (key !== USERS_KEY) localStorage.removeItem(key);
    }
  }

  const merged = mergeAccountsById(legacyCollected, v1Users);
  if (merged.length === 0) return;

  const repaired = dedupeUsersByEmail(merged);
  const serialized = JSON.stringify(repaired);
  if (localStorage.getItem(USERS_KEY) !== serialized) {
    localStorage.setItem(USERS_KEY, serialized);
    authDebug("migrate repaired store", repaired.length);
  }
}

/** Profile exists in localStorage but its auth row is missing (legacy seed wipe). */
function findOrphanedStateUserId(normalizedEmail: string): string | null {
  if (typeof window === "undefined") return null;
  migrateAndRepairUserStore();
  const authIds = new Set(readUsersFromStorage().map((u) => u.id));

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith(STATE_KEY_PREFIX)) continue;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as { profile?: { email?: string } };
      if (!parsed.profile?.email || !emailsMatch(parsed.profile.email, normalizedEmail)) continue;

      const userId = key.slice(STATE_KEY_PREFIX.length);
      if (!authIds.has(userId)) return userId;
    } catch {
      /* ignore malformed state blobs */
    }
  }
  return null;
}

function hasOrphanedProfileForEmail(normalizedEmail: string): boolean {
  return findOrphanedStateUserId(normalizedEmail) !== null;
}

async function recoverAuthFromOrphanedProfile(
  normalizedEmail: string,
  password: string,
): Promise<AuthResult | null> {
  const userId = findOrphanedStateUserId(normalizedEmail);
  if (!userId || getUserById(userId)) return null;

  const salt = randomSalt();
  const user: UserAccount = {
    id: userId,
    email: normalizedEmail,
    passwordHash: await hashPassword(password, salt),
    salt,
    createdAt: new Date().toISOString(),
    role: "SME_OWNER",
    status: "active",
  };
  await readModifyWriteUsers((current) => [...current, user]);
  return { ok: true, userId: user.id, email: user.email, role: user.role };
}

function randomSalt() {
  return crypto.randomUUID();
}

export async function hashPassword(password: string, salt: string) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyPassword(
  password: string,
  salt: string,
  passwordHash: string,
): Promise<boolean> {
  return (await hashPassword(password, salt)) === passwordHash;
}

function migrateUser(
  raw: Partial<UserAccount> &
    Pick<UserAccount, "id" | "email" | "passwordHash" | "salt" | "createdAt">,
): UserAccount {
  return {
    ...raw,
    email: normalizeEmail(raw.email),
    role: raw.role ?? "SME_OWNER",
    status: raw.status ?? "active",
  };
}

type StoredUser = Partial<UserAccount> &
  Pick<UserAccount, "id" | "email" | "passwordHash" | "salt" | "createdAt">;

function parseStoredUsers(raw: string): StoredUser[] {
  return JSON.parse(raw) as StoredUser[];
}

/** Read all auth rows without deduping (needed to verify against legacy duplicates). */
function loadRawUsers(): UserAccount[] {
  if (typeof window === "undefined") return [];
  migrateAndRepairUserStore();
  return readUsersFromStorage();
}

function loadUsers(): UserAccount[] {
  return dedupeUsersByEmail(loadRawUsers());
}

type UserStoreWriteMode = "merge" | "exact";

function notifyUserStoreChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(USERS_CHANGED_EVENT));
  }
}

function saveUsers(users: UserAccount[], mode: UserStoreWriteMode = "merge") {
  if (typeof window === "undefined") return;
  const normalized = dedupeUsersByEmail(users.map(migrateUser));
  if (mode === "exact") {
    localStorage.setItem(USERS_KEY, JSON.stringify(normalized));
    authDebug("saveUsers exact", normalized.length);
    notifyUserStoreChanged();
    return;
  }

  // Re-read immediately before write so concurrent adds are never dropped.
  const existing = readUsersFromStorage();
  const merged = dedupeUsersByEmail(mergeAccountsById(existing, normalized));
  localStorage.setItem(USERS_KEY, JSON.stringify(merged));
  authDebug("saveUsers merge", { before: existing.length, after: merged.length });
  notifyUserStoreChanged();
}

/**
 * Serialized read-modify-write. `merge` (default) unions by id with storage;
 * `exact` replaces the store (duplicate collapse only).
 */
async function readModifyWriteUsers(
  update: (current: UserAccount[]) => UserAccount[],
  mode: UserStoreWriteMode = "merge",
): Promise<void> {
  if (typeof window === "undefined") return;

  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const previous = userStoreWriteChain;
  userStoreWriteChain = userStoreWriteChain.then(() => gate);
  await previous;

  try {
    migrateAndRepairUserStore();
    const current = readUsersFromStorage();
    const next = update(current);
    saveUsers(next, mode);
  } finally {
    release();
  }
}

/** All stored rows for an email (including legacy duplicates not yet collapsed). */
function findUsersByEmail(email: string): UserAccount[] {
  const normalized = normalizeEmail(email);
  return loadRawUsers().filter((u) => emailsMatch(u.email, normalized));
}

/** Drop duplicate auth rows for an email, keeping the row that authenticated. */
async function collapseDuplicatesForEmail(email: string, keepUserId: string) {
  const normalized = normalizeEmail(email);
  await readModifyWriteUsers(
    (users) => users.filter((u) => !emailsMatch(u.email, normalized) || u.id === keepUserId),
    "exact",
  );
}

export function getAllUsers(): UserAccount[] {
  return loadUsers();
}

export function getUserById(userId: string): UserAccount | undefined {
  return loadUsers().find((u) => u.id === userId);
}

export function getUserByEmail(email: string): UserAccount | undefined {
  const normalized = normalizeEmail(email);
  const users = findUsersByEmail(normalized);
  if (users.length === 0) return undefined;
  if (users.length === 1) return users[0];
  return dedupeUsersByEmail(users)[0];
}

export type EmailRegistrationConflict = "exists" | "orphaned";

/** Case-insensitive: auth row and/or orphaned SME profile for this email. */
export function getEmailRegistrationConflict(email: string): EmailRegistrationConflict | null {
  const normalized = normalizeEmail(email);
  if (findUsersByEmail(normalized).length > 0) return "exists";
  if (hasOrphanedProfileForEmail(normalized)) return "orphaned";
  return null;
}

/** Local + remote email conflict check used by registration forms. */
export async function resolveEmailRegistrationConflict(
  email: string,
): Promise<EmailRegistrationConflict | null> {
  if (await isRemoteAuthEnabled()) {
    return checkRemoteEmailConflict(email);
  }
  return getEmailRegistrationConflict(email);
}

/** Case-insensitive check against all stored accounts (including portal operator). */
export function isEmailRegistered(email: string): boolean {
  return getEmailRegistrationConflict(email) !== null;
}

export function getCurrentUser(): UserAccount | null {
  const session = getSession();
  if (!session) return null;
  return getUserById(session.userId) ?? null;
}

export function isSuperAdmin(): boolean {
  const session = getSession();
  if (session?.role === "SUPER_ADMIN") return true;
  return getCurrentUser()?.role === "SUPER_ADMIN";
}

export function isSmeOwner(): boolean {
  const session = getSession();
  if (session?.role === "SME_OWNER") return true;
  return getCurrentUser()?.role === "SME_OWNER";
}

let seedPromise: Promise<void> | null = null;

function upsertDirectoryAccount(account: UserAccount) {
  return readModifyWriteUsers((users) => {
    const without = users.filter((u) => u.id !== account.id && !emailsMatch(u.email, account.email));
    return [...without, account];
  });
}

/** Pull account directory from Postgres into the local mirror used by admin views. */
export async function syncRemoteUserDirectory(): Promise<void> {
  if (typeof window === "undefined") return;
  if (!(await isRemoteAuthEnabled())) return;
  const accounts = await fetchRemoteAccounts();
  await readModifyWriteUsers(
    () => accounts.map((account) => directoryRowFromRemote(account)),
    "exact",
  );
}

export async function seedSuperAdmin(): Promise<void> {
  if (typeof window === "undefined") return;

  if (await isRemoteAuthEnabled()) {
    await seedRemoteSuperAdmin();
    await syncRemoteUserDirectory();
    return;
  }

  migrateAndRepairUserStore();
  if (loadUsers().some((u) => emailsMatch(u.email, SUPER_ADMIN_EMAIL))) return;

  const salt = randomSalt();
  const passwordHash = await hashPassword(SUPER_ADMIN_PASSWORD, salt);

  // Re-read after async work so concurrent register/login writes are not clobbered.
  await readModifyWriteUsers((users) => {
    if (users.some((u) => emailsMatch(u.email, SUPER_ADMIN_EMAIL))) return users;
    return [
      ...users,
      {
        id: "super-admin",
        email: SUPER_ADMIN_EMAIL,
        passwordHash,
        salt,
        createdAt: new Date().toISOString(),
        role: "SUPER_ADMIN",
        status: "active",
      },
    ];
  });
}

export function ensureSeeded(): Promise<void> {
  // Never cache an SSR no-op — client must still seed localStorage on first real load.
  if (typeof window === "undefined") return Promise.resolve();
  if (!seedPromise) {
    seedPromise = seedSuperAdmin().catch((err) => {
      seedPromise = null;
      throw err;
    });
  }
  return seedPromise;
}

async function applyIssuedToken(
  token: string,
  opts?: { boundGeneration?: number },
): Promise<void> {
  if (opts?.boundGeneration !== undefined && isSessionGenerationStale(opts.boundGeneration)) {
    return;
  }
  const session = readTokenSession(token);
  if (!session) throw new Error("Could not complete sign-in.");
  writeStoredToken(token);
  memorySession = session;
}

function readStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(JWT_STORAGE_KEY);
}

function writeStoredToken(token: string) {
  if (typeof window !== "undefined") localStorage.setItem(JWT_STORAGE_KEY, token);
}

function removeStoredToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(JWT_STORAGE_KEY);
    localStorage.removeItem(LEGACY_SESSION_KEY);
  }
}

/** Migrate legacy plain JSON sessions to JWT on first read. */
async function migrateLegacySession(boundGeneration: number): Promise<void> {
  if (typeof window === "undefined") return;
  if (isSessionGenerationStale(boundGeneration)) return;
  if (localStorage.getItem(JWT_STORAGE_KEY)) return;

  try {
    const raw = localStorage.getItem(LEGACY_SESSION_KEY);
    if (!raw) return;

    const legacy = JSON.parse(raw) as {
      userId: string;
      email: string;
      expiresAt: number;
    };
    if (!legacy.userId || legacy.expiresAt <= Date.now()) {
      localStorage.removeItem(LEGACY_SESSION_KEY);
      return;
    }

    const user = getUserById(legacy.userId);
    if (!user) {
      localStorage.removeItem(LEGACY_SESSION_KEY);
      return;
    }

    await establishSession(user.id, user.email, user.role, { boundGeneration });
    localStorage.removeItem(LEGACY_SESSION_KEY);
  } catch {
    localStorage.removeItem(LEGACY_SESSION_KEY);
  }
}

async function establishSession(
  userId: string,
  email: string,
  role: UserRole,
  opts?: { boundGeneration?: number },
): Promise<void> {
  const normalizedEmail = normalizeEmail(email);
  try {
    const { token } = await issueAuthTokenFn({
      data: { userId, email: normalizedEmail, role },
    });
    await applyIssuedToken(token, opts);
  } catch (error) {
    authDebug("establishSession failed", error);
    throw new Error(
      "Could not complete sign-in. If you are on a phone, stay on the same Wi‑Fi and use the Network URL from your PC, then try again.",
    );
  }
}

export function getSession(): AuthSession | null {
  if (memorySession && memorySession.expiresAt > Date.now()) {
    return memorySession;
  }

  const token = readStoredToken();
  if (!token) {
    memorySession = null;
    return null;
  }

  const session = sessionFromToken(token);
  if (!session) {
    removeStoredToken();
    memorySession = null;
    return null;
  }

  memorySession = session;
  return session;
}

export function clearSession() {
  sessionGeneration += 1;
  memorySession = null;
  removeStoredToken();
}

export function isAuthenticated() {
  return getSession() !== null;
}

/**
 * Verify the stored JWT with the server and refresh when near expiry.
 * Call during route guards and app hydration.
 */
export async function hydrateAuth(): Promise<boolean> {
  if (hydratePromise) return hydratePromise;

  const boundGeneration = sessionGeneration;

  hydratePromise = (async () => {
    await migrateLegacySession(boundGeneration);
    if (isSessionGenerationStale(boundGeneration)) return false;

    const token = readStoredToken();
    if (!token) {
      memorySession = null;
      return false;
    }

    const result = await verifyAuthTokenFn({ data: { token } });
    if (isSessionGenerationStale(boundGeneration)) return false;

    if (!result.ok) {
      clearSession();
      return false;
    }

    memorySession = {
      userId: result.userId,
      email: result.email,
      role: result.role,
      expiresAt: result.expiresAt,
    };

    if (isSessionGenerationStale(boundGeneration)) {
      memorySession = null;
      return false;
    }

    const user = getUserById(result.userId);
    if (user?.status === "suspended") {
      clearSession();
      return false;
    }

    if (!user) {
      if (await isRemoteAuthEnabled()) {
        const remote = await fetchRemoteAccount(result.userId);
        if (!remote || remote.status === "suspended") {
          clearSession();
          return false;
        }
        await upsertDirectoryAccount(directoryRowFromRemote(remote));
      } else {
        clearSession();
        return false;
      }
    }

    if (result.expiresAt - Date.now() < JWT_REFRESH_THRESHOLD_MS) {
      await establishSession(result.userId, result.email, result.role, { boundGeneration });
    }

    if (isSessionGenerationStale(boundGeneration)) {
      memorySession = null;
      removeStoredToken();
      return false;
    }

    return true;
  })().finally(() => {
    hydratePromise = null;
  });

  return hydratePromise;
}

export type RegisterProfileInput = {
  businessName: string;
  ownerName: string;
  phone?: string;
  businessType: string;
  employees: number;
};

export async function registerUser(
  email: string,
  password: string,
  profile?: RegisterProfileInput,
): Promise<AuthResult & { profile?: RemoteProfile | null }> {
  await ensureSeeded();
  const normalized = normalizeEmail(email);
  if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };

  if (await isRemoteAuthEnabled()) {
    if (!profile) {
      return { ok: false, error: "Business profile is required to create an account." };
    }
    const remote = await remoteRegister({
      email: normalized,
      password,
      businessName: profile.businessName,
      ownerName: profile.ownerName,
      phone: profile.phone,
      businessType: profile.businessType,
      employees: profile.employees,
    });
    if (!remote.ok) return remote;
    if (!("token" in remote)) return { ok: false, error: "Could not create account." };

    await upsertDirectoryAccount(
      directoryRowFromRemote({
        id: remote.userId,
        email: remote.email,
        role: remote.role,
        status: remote.status,
        createdAt: remote.createdAt,
      }),
    );
    await applyIssuedToken(remote.token);
    return {
      ok: true,
      userId: remote.userId,
      email: remote.email,
      role: remote.role,
      profile: remote.profile,
    };
  }

  const conflict = getEmailRegistrationConflict(normalized);
  if (conflict === "exists") return { ok: false, error: EMAIL_ALREADY_EXISTS_ERROR };
  if (conflict === "orphaned") return { ok: false, error: ORPHANED_PROFILE_ERROR };

  const salt = randomSalt();
  const passwordHash = await hashPassword(password, salt);

  // Re-read after async work so concurrent register writes are not duplicated.
  const recheck = getEmailRegistrationConflict(normalized);
  if (recheck === "exists") return { ok: false, error: EMAIL_ALREADY_EXISTS_ERROR };
  if (recheck === "orphaned") return { ok: false, error: ORPHANED_PROFILE_ERROR };

  const user: UserAccount = {
    id: uid(),
    email: normalized,
    passwordHash,
    salt,
    createdAt: new Date().toISOString(),
    role: "SME_OWNER",
    status: "active",
  };
  await readModifyWriteUsers((users) => [...users, user]);
  await establishSession(user.id, user.email, user.role);
  return { ok: true, userId: user.id, email: user.email, role: user.role };
}

export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResult & { profile?: RemoteProfile | null }> {
  await ensureSeeded();
  const normalized = normalizeEmail(email);

  if (await isRemoteAuthEnabled()) {
    const remote = await remoteLogin(normalized, password);
    if (!remote.ok) return remote;
    if (!("token" in remote)) return { ok: false, error: "Invalid email or password." };

    await upsertDirectoryAccount(
      directoryRowFromRemote({
        id: remote.userId,
        email: remote.email,
        role: remote.role,
        status: remote.status,
        createdAt: remote.createdAt,
      }),
    );
    await applyIssuedToken(remote.token);
    return {
      ok: true,
      userId: remote.userId,
      email: remote.email,
      role: remote.role,
      profile: remote.profile,
    };
  }

  const candidates = findUsersByEmail(normalized);

  if (candidates.length === 0) {
    if (hasOrphanedProfileForEmail(normalized)) {
      return { ok: false, error: ORPHANED_PROFILE_ERROR };
    }
    return { ok: false, error: "Invalid email or password." };
  }

  let user: UserAccount | undefined;
  for (const candidate of candidates) {
    if (candidate.status === "suspended") continue;
    if (!(await verifyPassword(password, candidate.salt, candidate.passwordHash))) continue;
    user = candidate;
    break;
  }

  if (!user) {
    if (candidates.every((c) => c.status === "suspended")) {
      return { ok: false, error: "Your account has been suspended. Please contact support." };
    }
    return { ok: false, error: "Invalid email or password." };
  }

  await collapseDuplicatesForEmail(normalized, user.id);
  await establishSession(user.id, user.email, user.role);
  return { ok: true, userId: user.id, email: user.email, role: user.role };
}

export async function resetPassword(email: string, newPassword: string): Promise<AuthResult> {
  await ensureSeeded();
  const normalized = normalizeEmail(email);
  if (newPassword.length < 6)
    return { ok: false, error: "Password must be at least 6 characters." };

  if (await isRemoteAuthEnabled()) {
    return remoteResetPassword(normalized, newPassword);
  }

  const match = dedupeUsersByEmail(findUsersByEmail(normalized))[0];
  if (!match) {
    const recovered = await recoverAuthFromOrphanedProfile(normalized, newPassword);
    if (recovered) return recovered;
    return { ok: false, error: "No account found with that email." };
  }

  const matchId = match.id;
  const updated = loadUsers().find((u) => u.id === matchId);
  if (!updated) {
    const recovered = await recoverAuthFromOrphanedProfile(normalized, newPassword);
    if (recovered) return recovered;
    return { ok: false, error: "No account found with that email." };
  }

  const salt = randomSalt();
  const passwordHash = await hashPassword(newPassword, salt);
  await readModifyWriteUsers((users) =>
    users.map((u) => (u.id === matchId ? { ...u, salt, passwordHash } : u)),
  );
  await collapseDuplicatesForEmail(normalized, matchId);
  return { ok: true, userId: updated.id, email: updated.email, role: updated.role };
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<AuthResult> {
  if (newPassword.length < 6)
    return { ok: false, error: "New password must be at least 6 characters." };

  if (await isRemoteAuthEnabled()) {
    return remoteChangePassword(userId, currentPassword, newPassword);
  }

  const user = loadUsers().find((u) => u.id === userId);
  if (!user) return { ok: false, error: "Account not found." };

  const currentHash = await hashPassword(currentPassword, user.salt);
  if (currentHash !== user.passwordHash) {
    return { ok: false, error: "Current password is incorrect." };
  }

  const salt = randomSalt();
  const passwordHash = await hashPassword(newPassword, salt);
  await readModifyWriteUsers((users) =>
    users.map((u) => (u.id === userId ? { ...u, salt, passwordHash } : u)),
  );
  return { ok: true, userId: user.id, email: user.email, role: user.role };
}

export async function updateUserEmail(userId: string, email: string): Promise<AuthResult> {
  const normalized = normalizeEmail(email);

  if (await isRemoteAuthEnabled()) {
    const result = await remoteUpdateEmail(userId, normalized);
    if (!result.ok) return result;
    const user = getUserById(userId);
    if (user) {
      await upsertDirectoryAccount({ ...user, email: normalized });
    }
    const session = getSession();
    if (session?.userId === userId) {
      await establishSession(userId, normalized, result.role);
    }
    return result;
  }

  const user = loadUsers().find((u) => u.id === userId);
  if (!user) return { ok: false, error: "Account not found." };

  const conflict = getEmailRegistrationConflict(normalized);
  if (conflict && !emailsMatch(user.email, normalized)) {
    return { ok: false, error: "That email is already in use." };
  }

  await readModifyWriteUsers((users) =>
    users.map((u) => (u.id === userId ? { ...u, email: normalized } : u)),
  );

  const session = getSession();
  if (session?.userId === userId) {
    await establishSession(userId, normalized, user.role);
  }

  return { ok: true, userId: user.id, email: normalized, role: user.role };
}

export async function updateUserStatus(userId: string, status: UserStatus): Promise<AuthResult> {
  if (await isRemoteAuthEnabled()) {
    const result = await remoteUpdateStatus(userId, status);
    if (result.ok) {
      const user = getUserById(userId);
      if (user) await upsertDirectoryAccount({ ...user, status });
    }
    return result;
  }

  const user = loadUsers().find((u) => u.id === userId);
  if (!user) return { ok: false, error: "Account not found." };
  if (user.role === "SUPER_ADMIN") return { ok: false, error: "Cannot change super admin status." };

  await readModifyWriteUsers((users) => users.map((u) => (u.id === userId ? { ...u, status } : u)));
  return { ok: true, userId: user.id, email: user.email, role: user.role };
}

/** Reset in-memory auth module state after a full data wipe. */
export function resetAuthModuleState(): void {
  sessionGeneration += 1;
  memorySession = null;
  hydratePromise = null;
  seedPromise = null;
  userStoreRepaired = false;
  userStoreWriteChain = Promise.resolve();
  resetRemoteAuthCache();
}

/**
 * Remove every SME owner account; keep or re-seed the portal operator only.
 * Does not touch JWT/session — call `clearSession()` separately.
 */
export async function resetUserAccountsKeepSuperAdmin(): Promise<void> {
  if (typeof window === "undefined") return;
  migrateAndRepairUserStore();
  await readModifyWriteUsers(
    (users) =>
      users.filter((u) => u.role === "SUPER_ADMIN" || emailsMatch(u.email, SUPER_ADMIN_EMAIL)),
    "exact",
  );
  await seedSuperAdmin();
}

/**
 * Wipe every account (including portal operator), then re-seed default operator credentials.
 * Does not touch JWT/session — call `clearSession()` separately.
 */
export async function resetAllUserAccountsAndReseedSuperAdmin(): Promise<void> {
  if (typeof window === "undefined") return;
  migrateAndRepairUserStore();
  await readModifyWriteUsers(() => [], "exact");
  await seedSuperAdmin();
}
