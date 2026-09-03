import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { S as redirect } from "../_libs/tanstack__router-core.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { g as getGlobalStartContext, a as getCsrfToken, C as CSRF_META_NAME } from "./csrf-C3jkS9Bv.mjs";
import { a as JWT_REFRESH_THRESHOLD_MS, b as JWT_STORAGE_KEY, L as LEGACY_SESSION_KEY, s as sessionFromToken } from "./jwt.shared-gMsek6D_.mjs";
import { createServerFn, TSS_SERVER_FUNCTION, getServerFnById } from "./server-DpwYz346.mjs";
import { T as Toaster$1 } from "../_libs/sonner.mjs";
import { o as objectType, s as stringType, e as enumType, n as numberType, a as arrayType, u as unknownType, b as booleanType } from "../_libs/zod.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const appCss = "/assets/styles-DfklmnPN.css";
function reportError(error, context = {}) {
  if (typeof window === "undefined") return;
  console.error(error, context);
}
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const tokenClaimsInput = objectType({
  userId: stringType().min(1),
  email: stringType().transform((value) => value.trim().toLowerCase()).pipe(stringType().email()),
  role: enumType(["SME_OWNER", "SUPER_ADMIN"])
});
const issueAuthTokenFn = createServerFn({
  method: "POST"
}).validator(tokenClaimsInput).handler(createSsrRpc("92ba317f8c696bd3af31aa139ed9c1f6740732c08f6c083c502d2813c9dfeaa0"));
const verifyAuthTokenFn = createServerFn({
  method: "POST"
}).validator(objectType({
  token: stringType().min(1)
})).handler(createSsrRpc("2cc65e98fefcdd3523289cc8a671abdf44e90f757943b5409842ee4a91125820"));
function normalizeEmail$1(email) {
  return email.trim().toLowerCase();
}
const getAuthBackendStatusFn = createServerFn({
  method: "GET"
}).handler(createSsrRpc("5f4c63a8e6da6620b2acc63d751b16b25799520269b5a383e39974269a22d9ea"));
const seedSuperAdminAccountFn = createServerFn({
  method: "POST"
}).handler(createSsrRpc("cb0be79324c6744b939c899ad9fd32dcd83eab44bac828ca7c406f10d642fbc6"));
const emailInput = objectType({
  email: stringType().transform((v) => normalizeEmail$1(v)).pipe(stringType().email())
});
const checkEmailAvailableFn = createServerFn({
  method: "POST"
}).validator(emailInput).handler(createSsrRpc("c5b08e312a37de18e53540c3a57745e2cd2e614ca3e31a10e103a0d1ff0a920b"));
const registerInput = objectType({
  email: stringType().transform((v) => normalizeEmail$1(v)).pipe(stringType().email()),
  password: stringType().min(6),
  businessName: stringType().min(1),
  ownerName: stringType().min(1),
  phone: stringType().optional().default(""),
  businessType: stringType().min(1),
  employees: numberType().int().min(1)
});
const registerAccountFn = createServerFn({
  method: "POST"
}).validator(registerInput).handler(createSsrRpc("4a36f2d1bfd66242a88264b4575b60e5bfc3560f46d9e20607f2eb7b7d74c30a"));
const loginInput = objectType({
  email: stringType().transform((v) => normalizeEmail$1(v)).pipe(stringType().email()),
  password: stringType().min(1)
});
const loginAccountFn = createServerFn({
  method: "POST"
}).validator(loginInput).handler(createSsrRpc("06de1968dc1a0e125ee62ba6428556b0a9554d4fbccdf60324f60f63b6756b07"));
const resetInput = objectType({
  email: stringType().transform((v) => normalizeEmail$1(v)).pipe(stringType().email()),
  newPassword: stringType().min(6)
});
const resetAccountPasswordFn = createServerFn({
  method: "POST"
}).validator(resetInput).handler(createSsrRpc("bb59c875dd92178bbe25ad83a00d2e5dbe184c16c843f13754a8f8b001988b62"));
const changePasswordInput = objectType({
  userId: stringType().uuid(),
  currentPassword: stringType().min(1),
  newPassword: stringType().min(6)
});
const changeAccountPasswordFn = createServerFn({
  method: "POST"
}).validator(changePasswordInput).handler(createSsrRpc("d2907f0502872a9f5b8fd67efb414e58cb9ff6406c29750d5b6d32213f069e6c"));
const updateEmailInput = objectType({
  userId: stringType().uuid(),
  email: stringType().transform((v) => normalizeEmail$1(v)).pipe(stringType().email())
});
const updateAccountEmailFn = createServerFn({
  method: "POST"
}).validator(updateEmailInput).handler(createSsrRpc("95ea42531ae72f0a74f8253be52252bc00022e1996017828d7cdd7512efa2eb8"));
const updateStatusInput = objectType({
  userId: stringType().uuid(),
  status: enumType(["active", "suspended"])
});
const updateAccountStatusFn = createServerFn({
  method: "POST"
}).validator(updateStatusInput).handler(createSsrRpc("9591f62ae6ff24aeef9b8412d8074a07565301e7c55713f02cc769a6d19a3da7"));
const listAccountsFn = createServerFn({
  method: "GET"
}).handler(createSsrRpc("ca5596057431a8fb0ec5416c9c95bf3e1a9e41a38fd46323e50fdb772cb7a6c1"));
const getAccountByIdFn = createServerFn({
  method: "POST"
}).validator(objectType({
  userId: stringType().uuid()
})).handler(createSsrRpc("ae4d836b75db405fa7e212e24f298bedc15be81b0069838a96cb62ecc8853bc2"));
let remoteEnabledCache = null;
function resetRemoteAuthCache() {
  remoteEnabledCache = null;
}
async function isRemoteAuthEnabled() {
  if (remoteEnabledCache !== null) return remoteEnabledCache;
  try {
    const status = await getAuthBackendStatusFn();
    remoteEnabledCache = status.available;
  } catch {
    remoteEnabledCache = false;
  }
  return remoteEnabledCache;
}
async function seedRemoteSuperAdmin() {
  if (!await isRemoteAuthEnabled()) return false;
  const result = await seedSuperAdminAccountFn();
  return result.ok;
}
async function checkRemoteEmailConflict(email) {
  if (!await isRemoteAuthEnabled()) return null;
  const result = await checkEmailAvailableFn({ data: { email } });
  return result.conflict;
}
async function remoteRegister(input) {
  if (!await isRemoteAuthEnabled()) {
    return { ok: false, error: "Database not configured." };
  }
  return registerAccountFn({ data: input });
}
async function remoteLogin(email, password) {
  if (!await isRemoteAuthEnabled()) {
    return { ok: false, error: "Database not configured." };
  }
  return loginAccountFn({ data: { email, password } });
}
async function remoteResetPassword(email, newPassword) {
  if (!await isRemoteAuthEnabled()) {
    return { ok: false, error: "Database not configured." };
  }
  return resetAccountPasswordFn({ data: { email, newPassword } });
}
async function remoteChangePassword(userId, currentPassword, newPassword) {
  if (!await isRemoteAuthEnabled()) {
    return { ok: false, error: "Database not configured." };
  }
  return changeAccountPasswordFn({ data: { userId, currentPassword, newPassword } });
}
async function remoteUpdateEmail(userId, email) {
  if (!await isRemoteAuthEnabled()) {
    return { ok: false, error: "Database not configured." };
  }
  return updateAccountEmailFn({ data: { userId, email } });
}
async function remoteUpdateStatus(userId, status) {
  if (!await isRemoteAuthEnabled()) {
    return { ok: false, error: "Database not configured." };
  }
  return updateAccountStatusFn({ data: { userId, status } });
}
async function fetchRemoteAccounts() {
  if (!await isRemoteAuthEnabled()) return [];
  const result = await listAccountsFn();
  return result.accounts;
}
async function fetchRemoteAccount(userId) {
  if (!await isRemoteAuthEnabled()) return null;
  const result = await getAccountByIdFn({ data: { userId } });
  return result.account;
}
function directoryRowFromRemote(account) {
  return {
    id: account.id,
    email: account.email,
    passwordHash: "",
    salt: "",
    createdAt: account.createdAt,
    role: account.role,
    status: account.status
  };
}
function readTokenSession(token) {
  return sessionFromToken(token);
}
const USERS_KEY = "srs:users:v1";
const LEGACY_USERS_KEYS = ["srs:users"];
const USERS_CHANGED_EVENT = "srs:users-changed";
const SUPER_ADMIN_EMAIL = "admin@smerisksentinel.com";
const SUPER_ADMIN_PASSWORD = "SuperAdmin2024!";
const EMAIL_ALREADY_EXISTS_ERROR = "An account with this email already exists. Please sign in instead.";
const ORPHANED_PROFILE_ERROR = "An account with this email already exists but needs to be restored. Use Forgot password to regain access.";
const uid$1 = () => Math.random().toString(36).slice(2, 10);
let memorySession = null;
let hydratePromise = null;
let sessionGeneration = 0;
function isSessionGenerationStale(boundGeneration) {
  return boundGeneration !== sessionGeneration;
}
let userStoreRepaired = false;
let userStoreWriteChain = Promise.resolve();
const AUTH_DEBUG_KEY = "srs:debug:auth";
function authDebug(...args) {
  if (typeof window !== "undefined" && localStorage.getItem(AUTH_DEBUG_KEY) === "1") {
    console.debug("[auth]", ...args);
  }
}
function normalizeEmail(email) {
  return email.trim().toLowerCase();
}
function emailsMatch(a, b) {
  return normalizeEmail(a) === normalizeEmail(b);
}
const STATE_KEY_PREFIX = "srs:state:v1:";
function isCompleteAuthRow(user) {
  return Boolean(
    user.id && user.email && typeof user.passwordHash === "string" && user.passwordHash.length > 0 && typeof user.salt === "string" && user.salt.length > 0 && user.createdAt
  );
}
function pickPreferredDuplicate(existing, candidate) {
  const existingComplete = isCompleteAuthRow(existing);
  const candidateComplete = isCompleteAuthRow(candidate);
  if (existingComplete && !candidateComplete) return existing;
  if (!existingComplete && candidateComplete) return candidate;
  return existing.createdAt >= candidate.createdAt ? existing : candidate;
}
function dedupeUsersByEmail(users) {
  const byEmail = /* @__PURE__ */ new Map();
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
function mergeAccountsById(...groups) {
  const byId = /* @__PURE__ */ new Map();
  for (const group of groups) {
    for (const user of group) {
      if (!user?.id) continue;
      byId.set(user.id, migrateUser(user));
    }
  }
  return [...byId.values()];
}
function readUsersFromStorage() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return parseStoredUsers(raw).map(migrateUser);
  } catch {
  }
  return [];
}
function migrateAndRepairUserStore() {
  if (typeof window === "undefined" || userStoreRepaired) return;
  userStoreRepaired = true;
  const legacyCollected = [];
  let v1Users = [];
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
function findOrphanedStateUserId(normalizedEmail) {
  if (typeof window === "undefined") return null;
  migrateAndRepairUserStore();
  const authIds = new Set(readUsersFromStorage().map((u) => u.id));
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith(STATE_KEY_PREFIX)) continue;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (!parsed.profile?.email || !emailsMatch(parsed.profile.email, normalizedEmail)) continue;
      const userId = key.slice(STATE_KEY_PREFIX.length);
      if (!authIds.has(userId)) return userId;
    } catch {
    }
  }
  return null;
}
function hasOrphanedProfileForEmail(normalizedEmail) {
  return findOrphanedStateUserId(normalizedEmail) !== null;
}
async function recoverAuthFromOrphanedProfile(normalizedEmail, password) {
  const userId = findOrphanedStateUserId(normalizedEmail);
  if (!userId || getUserById(userId)) return null;
  const salt = randomSalt();
  const user = {
    id: userId,
    email: normalizedEmail,
    passwordHash: await hashPassword(password, salt),
    salt,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    role: "SME_OWNER",
    status: "active"
  };
  await readModifyWriteUsers((current) => [...current, user]);
  return { ok: true, userId: user.id, email: user.email, role: user.role };
}
function randomSalt() {
  return crypto.randomUUID();
}
async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function verifyPassword(password, salt, passwordHash) {
  return await hashPassword(password, salt) === passwordHash;
}
function migrateUser(raw) {
  return {
    ...raw,
    email: normalizeEmail(raw.email),
    role: raw.role ?? "SME_OWNER",
    status: raw.status ?? "active"
  };
}
function parseStoredUsers(raw) {
  return JSON.parse(raw);
}
function loadRawUsers() {
  if (typeof window === "undefined") return [];
  migrateAndRepairUserStore();
  return readUsersFromStorage();
}
function loadUsers() {
  return dedupeUsersByEmail(loadRawUsers());
}
function notifyUserStoreChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(USERS_CHANGED_EVENT));
  }
}
function saveUsers(users, mode = "merge") {
  if (typeof window === "undefined") return;
  const normalized = dedupeUsersByEmail(users.map(migrateUser));
  if (mode === "exact") {
    localStorage.setItem(USERS_KEY, JSON.stringify(normalized));
    authDebug("saveUsers exact", normalized.length);
    notifyUserStoreChanged();
    return;
  }
  const existing = readUsersFromStorage();
  const merged = dedupeUsersByEmail(mergeAccountsById(existing, normalized));
  localStorage.setItem(USERS_KEY, JSON.stringify(merged));
  authDebug("saveUsers merge", { before: existing.length, after: merged.length });
  notifyUserStoreChanged();
}
async function readModifyWriteUsers(update, mode = "merge") {
  if (typeof window === "undefined") return;
  let release;
  const gate = new Promise((resolve) => {
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
function findUsersByEmail(email) {
  const normalized = normalizeEmail(email);
  return loadRawUsers().filter((u) => emailsMatch(u.email, normalized));
}
async function collapseDuplicatesForEmail(email, keepUserId) {
  const normalized = normalizeEmail(email);
  await readModifyWriteUsers(
    (users) => users.filter((u) => !emailsMatch(u.email, normalized) || u.id === keepUserId),
    "exact"
  );
}
function getAllUsers() {
  return loadUsers();
}
function getUserById(userId) {
  return loadUsers().find((u) => u.id === userId);
}
function getEmailRegistrationConflict(email) {
  const normalized = normalizeEmail(email);
  if (findUsersByEmail(normalized).length > 0) return "exists";
  if (hasOrphanedProfileForEmail(normalized)) return "orphaned";
  return null;
}
async function resolveEmailRegistrationConflict(email) {
  if (await isRemoteAuthEnabled()) {
    return checkRemoteEmailConflict(email);
  }
  return getEmailRegistrationConflict(email);
}
function getCurrentUser() {
  const session = getSession();
  if (!session) return null;
  return getUserById(session.userId) ?? null;
}
function isSuperAdmin() {
  const session = getSession();
  if (session?.role === "SUPER_ADMIN") return true;
  return getCurrentUser()?.role === "SUPER_ADMIN";
}
let seedPromise = null;
function upsertDirectoryAccount(account) {
  return readModifyWriteUsers((users) => {
    const without = users.filter((u) => u.id !== account.id && !emailsMatch(u.email, account.email));
    return [...without, account];
  });
}
async function syncRemoteUserDirectory() {
  if (typeof window === "undefined") return;
  if (!await isRemoteAuthEnabled()) return;
  const accounts = await fetchRemoteAccounts();
  await readModifyWriteUsers(
    () => accounts.map((account) => directoryRowFromRemote(account)),
    "exact"
  );
}
async function seedSuperAdmin() {
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
  await readModifyWriteUsers((users) => {
    if (users.some((u) => emailsMatch(u.email, SUPER_ADMIN_EMAIL))) return users;
    return [
      ...users,
      {
        id: "super-admin",
        email: SUPER_ADMIN_EMAIL,
        passwordHash,
        salt,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        role: "SUPER_ADMIN",
        status: "active"
      }
    ];
  });
}
function ensureSeeded() {
  if (typeof window === "undefined") return Promise.resolve();
  if (!seedPromise) {
    seedPromise = seedSuperAdmin().catch((err) => {
      seedPromise = null;
      throw err;
    });
  }
  return seedPromise;
}
async function applyIssuedToken(token, opts) {
  if (opts?.boundGeneration !== void 0 && isSessionGenerationStale(opts.boundGeneration)) {
    return;
  }
  const session = readTokenSession(token);
  if (!session) throw new Error("Could not complete sign-in.");
  writeStoredToken(token);
  memorySession = session;
}
function readStoredToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(JWT_STORAGE_KEY);
}
function writeStoredToken(token) {
  if (typeof window !== "undefined") localStorage.setItem(JWT_STORAGE_KEY, token);
}
function removeStoredToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(JWT_STORAGE_KEY);
    localStorage.removeItem(LEGACY_SESSION_KEY);
  }
}
async function migrateLegacySession(boundGeneration) {
  if (typeof window === "undefined") return;
  if (isSessionGenerationStale(boundGeneration)) return;
  if (localStorage.getItem(JWT_STORAGE_KEY)) return;
  try {
    const raw = localStorage.getItem(LEGACY_SESSION_KEY);
    if (!raw) return;
    const legacy = JSON.parse(raw);
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
async function establishSession(userId, email, role, opts) {
  const normalizedEmail = normalizeEmail(email);
  try {
    const { token } = await issueAuthTokenFn({
      data: { userId, email: normalizedEmail, role }
    });
    await applyIssuedToken(token, opts);
  } catch (error) {
    authDebug("establishSession failed", error);
    throw new Error(
      "Could not complete sign-in. If you are on a phone, stay on the same Wi‑Fi and use the Network URL from your PC, then try again."
    );
  }
}
function getSession() {
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
function clearSession() {
  sessionGeneration += 1;
  memorySession = null;
  removeStoredToken();
}
function isAuthenticated() {
  return getSession() !== null;
}
async function hydrateAuth() {
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
      expiresAt: result.expiresAt
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
async function registerUser(email, password, profile) {
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
      employees: profile.employees
    });
    if (!remote.ok) return remote;
    if (!("token" in remote)) return { ok: false, error: "Could not create account." };
    await upsertDirectoryAccount(
      directoryRowFromRemote({
        id: remote.userId,
        email: remote.email,
        role: remote.role,
        status: remote.status,
        createdAt: remote.createdAt
      })
    );
    await applyIssuedToken(remote.token);
    return {
      ok: true,
      userId: remote.userId,
      email: remote.email,
      role: remote.role,
      profile: remote.profile
    };
  }
  const conflict = getEmailRegistrationConflict(normalized);
  if (conflict === "exists") return { ok: false, error: EMAIL_ALREADY_EXISTS_ERROR };
  if (conflict === "orphaned") return { ok: false, error: ORPHANED_PROFILE_ERROR };
  const salt = randomSalt();
  const passwordHash = await hashPassword(password, salt);
  const recheck = getEmailRegistrationConflict(normalized);
  if (recheck === "exists") return { ok: false, error: EMAIL_ALREADY_EXISTS_ERROR };
  if (recheck === "orphaned") return { ok: false, error: ORPHANED_PROFILE_ERROR };
  const user = {
    id: uid$1(),
    email: normalized,
    passwordHash,
    salt,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    role: "SME_OWNER",
    status: "active"
  };
  await readModifyWriteUsers((users) => [...users, user]);
  await establishSession(user.id, user.email, user.role);
  return { ok: true, userId: user.id, email: user.email, role: user.role };
}
async function loginUser(email, password) {
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
        createdAt: remote.createdAt
      })
    );
    await applyIssuedToken(remote.token);
    return {
      ok: true,
      userId: remote.userId,
      email: remote.email,
      role: remote.role,
      profile: remote.profile
    };
  }
  const candidates = findUsersByEmail(normalized);
  if (candidates.length === 0) {
    if (hasOrphanedProfileForEmail(normalized)) {
      return { ok: false, error: ORPHANED_PROFILE_ERROR };
    }
    return { ok: false, error: "Invalid email or password." };
  }
  let user;
  for (const candidate of candidates) {
    if (candidate.status === "suspended") continue;
    if (!await verifyPassword(password, candidate.salt, candidate.passwordHash)) continue;
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
async function resetPassword(email, newPassword) {
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
  await readModifyWriteUsers(
    (users) => users.map((u) => u.id === matchId ? { ...u, salt, passwordHash } : u)
  );
  await collapseDuplicatesForEmail(normalized, matchId);
  return { ok: true, userId: updated.id, email: updated.email, role: updated.role };
}
async function changePassword(userId, currentPassword, newPassword) {
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
  await readModifyWriteUsers(
    (users) => users.map((u) => u.id === userId ? { ...u, salt, passwordHash } : u)
  );
  return { ok: true, userId: user.id, email: user.email, role: user.role };
}
async function updateUserEmail(userId, email) {
  const normalized = normalizeEmail(email);
  if (await isRemoteAuthEnabled()) {
    const result = await remoteUpdateEmail(userId, normalized);
    if (!result.ok) return result;
    const user2 = getUserById(userId);
    if (user2) {
      await upsertDirectoryAccount({ ...user2, email: normalized });
    }
    const session2 = getSession();
    if (session2?.userId === userId) {
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
  await readModifyWriteUsers(
    (users) => users.map((u) => u.id === userId ? { ...u, email: normalized } : u)
  );
  const session = getSession();
  if (session?.userId === userId) {
    await establishSession(userId, normalized, user.role);
  }
  return { ok: true, userId: user.id, email: normalized, role: user.role };
}
async function updateUserStatus(userId, status) {
  if (await isRemoteAuthEnabled()) {
    const result = await remoteUpdateStatus(userId, status);
    if (result.ok) {
      const user2 = getUserById(userId);
      if (user2) await upsertDirectoryAccount({ ...user2, status });
    }
    return result;
  }
  const user = loadUsers().find((u) => u.id === userId);
  if (!user) return { ok: false, error: "Account not found." };
  if (user.role === "SUPER_ADMIN") return { ok: false, error: "Cannot change super admin status." };
  await readModifyWriteUsers((users) => users.map((u) => u.id === userId ? { ...u, status } : u));
  return { ok: true, userId: user.id, email: user.email, role: user.role };
}
function resetAuthModuleState() {
  sessionGeneration += 1;
  memorySession = null;
  hydratePromise = null;
  seedPromise = null;
  userStoreRepaired = false;
  userStoreWriteChain = Promise.resolve();
  resetRemoteAuthCache();
}
async function resetAllUserAccountsAndReseedSuperAdmin() {
  if (typeof window === "undefined") return;
  migrateAndRepairUserStore();
  await readModifyWriteUsers(() => [], "exact");
  await seedSuperAdmin();
}
const alertEmailInput = objectType({
  to: stringType().email(),
  alertId: stringType().min(1),
  title: stringType().min(1),
  category: enumType(["financial", "cybersecurity", "compliance", "operational"]),
  severity: enumType(["low", "medium", "high"]),
  action: stringType().min(1),
  date: stringType().min(1),
  businessName: stringType(),
  ownerName: stringType(),
  dashboardUrl: stringType().url().optional()
});
const sendAlertEmailFn = createServerFn({
  method: "POST"
}).validator(alertEmailInput).handler(createSsrRpc("6ad6e3b3d756b1c8368ac45cc64fba9b34d6b7055bfc1520544fb082bafd1d64"));
async function sendEmail(payload) {
  const { alert, profile, dashboardUrl } = payload;
  const to = profile.email.trim();
  if (!to) {
    console.info("[Risk Sentinel] Alert email skipped — no recipient email on profile.");
    return;
  }
  try {
    const result = await sendAlertEmailFn({
      data: {
        to,
        alertId: alert.id,
        title: alert.title,
        category: alert.category,
        severity: alert.severity,
        action: alert.action,
        date: alert.date,
        businessName: profile.businessName || "Your business",
        ownerName: profile.ownerName || "Business owner",
        dashboardUrl
      }
    });
    if (result.ok) return;
    if (result.skipped) {
      console.info(`[Risk Sentinel] Alert email skipped: ${result.reason}`);
      return;
    }
    console.warn(`[Risk Sentinel] Alert email failed: ${result.error}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.warn(`[Risk Sentinel] Alert email request failed: ${message}`);
  }
}
async function notifyAlertCreated(payload) {
  await sendEmail(payload);
}
const labelOf$1 = (level) => ({ low: "Low Risk", medium: "Medium Risk", high: "High Risk" })[level];
function levelFromScore(score) {
  if (score >= 75) return "high";
  if (score >= 40) return "medium";
  return "low";
}
const CYBER_THREAT_OPTIONS = [
  {
    id: "phishing",
    name: "Phishing",
    description: "Fraudulent emails, messages, or websites designed to trick users into revealing information or clicking malicious links.",
    questions: [
      {
        id: "received_suspicious",
        label: "Have employees received suspicious emails or messages?",
        impact: "medium"
      },
      { id: "clicked_link", label: "Has anyone clicked a suspicious link?", impact: "high" },
      {
        id: "submitted_credentials",
        label: "Has anyone submitted login credentials through a suspicious link?",
        impact: "high"
      },
      { id: "reported", label: "Has the incident been reported?", impact: "info" },
      { id: "resolved", label: "Is the incident currently resolved?", impact: "info" }
    ]
  },
  {
    id: "bec",
    name: "Business Email Compromise (BEC)",
    description: "Attackers impersonate executives or suppliers by email to trick staff into sending money or sensitive information.",
    questions: [
      {
        id: "impersonation_email",
        label: "Has the business received emails impersonating a manager or supplier?",
        impact: "medium"
      },
      {
        id: "payment_requested",
        label: "Was a payment or fund transfer requested through that email?",
        impact: "high"
      },
      { id: "payment_sent", label: "Was money or data sent based on the request?", impact: "high" },
      { id: "reported", label: "Has the incident been reported?", impact: "info" },
      { id: "resolved", label: "Is the incident currently resolved?", impact: "info" }
    ]
  },
  {
    id: "malware",
    name: "Malware",
    description: "Malicious software installed on devices that can steal data, spy on activity, or disrupt systems.",
    questions: [
      {
        id: "device_infected",
        label: "Has any business device shown signs of malware infection?",
        impact: "high"
      },
      {
        id: "unexpected_behavior",
        label: "Have systems behaved unexpectedly (slowdowns, pop-ups, unknown programs)?",
        impact: "medium"
      },
      {
        id: "antivirus_alert",
        label: "Has antivirus or security software raised an alert?",
        impact: "medium"
      },
      { id: "reported", label: "Has the incident been reported?", impact: "info" },
      {
        id: "resolved",
        label: "Has the affected device been cleaned or replaced?",
        impact: "info"
      }
    ]
  },
  {
    id: "ransomware",
    name: "Ransomware",
    description: "Malware that locks or encrypts files and demands payment to restore access.",
    questions: [
      { id: "device_affected", label: "Has any business device been affected?", impact: "high" },
      {
        id: "files_encrypted",
        label: "Have files been encrypted or made inaccessible?",
        impact: "high"
      },
      {
        id: "ops_disrupted",
        label: "Has the business experienced operational disruption?",
        impact: "high"
      },
      { id: "reported", label: "Has the incident been reported?", impact: "info" },
      { id: "isolated", label: "Has the affected device been isolated?", impact: "info" }
    ]
  },
  {
    id: "password_attacks",
    name: "Password Attacks / Account Compromise",
    description: "Unauthorized access attempts or successful logins using stolen, guessed, or reused passwords.",
    questions: [
      {
        id: "unauthorized_access",
        label: "Has an employee account been accessed without authorization?",
        impact: "high"
      },
      {
        id: "suspicious_logins",
        label: "Have suspicious login attempts been detected?",
        impact: "medium"
      },
      { id: "password_compromised", label: "Has a password been compromised?", impact: "high" },
      { id: "password_changed", label: "Has the affected password been changed?", impact: "info" },
      {
        id: "mfa_enabled",
        label: "Has multi-factor authentication been enabled?",
        impact: "info"
      }
    ]
  },
  {
    id: "social_engineering",
    name: "Social Engineering",
    description: "Psychological tricks used to manipulate people into giving access, money, or confidential information.",
    questions: [
      {
        id: "staff_targeted",
        label: "Have staff been contacted by someone pretending to be trusted?",
        impact: "medium"
      },
      {
        id: "info_shared",
        label: "Was confidential information shared during the interaction?",
        impact: "high"
      },
      {
        id: "access_granted",
        label: "Was system or building access granted as a result?",
        impact: "high"
      },
      { id: "reported", label: "Has the incident been reported?", impact: "info" },
      {
        id: "resolved",
        label: "Have staff been briefed and controls updated?",
        impact: "info"
      }
    ]
  },
  {
    id: "data_breach",
    name: "Data Breach / Data Theft",
    description: "Unauthorized access to, exposure of, or theft of business or customer data.",
    questions: [
      {
        id: "unauthorized_access",
        label: "Has unauthorized access to business data been detected?",
        impact: "high"
      },
      {
        id: "customer_data",
        label: "Was customer or personal data affected?",
        impact: "high"
      },
      {
        id: "still_accessible",
        label: "Is the affected data still accessible to the attacker?",
        impact: "high"
      },
      { id: "reported", label: "Has the incident been reported?", impact: "info" },
      { id: "resolved", label: "Has the issue been resolved?", impact: "info" }
    ]
  },
  {
    id: "payment_fraud",
    name: "Online Payment / Financial Fraud",
    description: "Fraudulent online payments, stolen card details, or unauthorized financial transactions.",
    questions: [
      {
        id: "fraud_detected",
        label: "Have unauthorized or fraudulent transactions been detected?",
        impact: "high"
      },
      {
        id: "customer_impact",
        label: "Have customers reported payment issues linked to your business?",
        impact: "medium"
      },
      {
        id: "funds_lost",
        label: "Has the business lost money due to the fraud?",
        impact: "high"
      },
      {
        id: "reported",
        label: "Has the incident been reported to the bank/provider?",
        impact: "info"
      },
      { id: "resolved", label: "Have payment channels been secured?", impact: "info" }
    ]
  },
  {
    id: "website_attacks",
    name: "Website Attacks",
    description: "Attempts to deface, hack, inject malware into, or take over the business website.",
    questions: [
      {
        id: "site_compromised",
        label: "Has the website been defaced or compromised?",
        impact: "high"
      },
      {
        id: "suspicious_changes",
        label: "Have unexpected website changes or redirects been noticed?",
        impact: "medium"
      },
      {
        id: "customer_impact",
        label: "Are customers unable to use the website normally?",
        impact: "medium"
      },
      {
        id: "reported",
        label: "Has the incident been reported to your hosting provider?",
        impact: "info"
      },
      {
        id: "resolved",
        label: "Has the website been restored and secured?",
        impact: "info"
      }
    ]
  },
  {
    id: "ddos",
    name: "Denial-of-Service (DoS/DDoS)",
    description: "Flooding online services so websites, email, or apps become slow or unavailable.",
    questions: [
      {
        id: "service_down",
        label: "Have online services become unavailable or extremely slow?",
        impact: "high"
      },
      { id: "ongoing", label: "Is the disruption still ongoing?", impact: "high" },
      {
        id: "customer_impact",
        label: "Are customers or staff unable to operate because of it?",
        impact: "medium"
      },
      { id: "reported", label: "Has the provider been notified?", impact: "info" },
      { id: "mitigated", label: "Have mitigation steps been applied?", impact: "info" }
    ]
  },
  {
    id: "insider_threat",
    name: "Insider Threat",
    description: "Risk from employees, contractors, or partners misusing legitimate access to harm the business.",
    questions: [
      {
        id: "misuse_suspected",
        label: "Is misuse of internal access suspected or confirmed?",
        impact: "high"
      },
      {
        id: "data_exfiltrated",
        label: "Was business data copied, deleted, or shared improperly?",
        impact: "high"
      },
      {
        id: "access_revoked",
        label: "Has the person's access been revoked or restricted?",
        impact: "info"
      },
      { id: "reported", label: "Has the incident been reported internally?", impact: "info" },
      {
        id: "resolved",
        label: "Have access reviews and controls been updated?",
        impact: "info"
      }
    ]
  },
  {
    id: "other",
    name: "Other",
    description: "A cybersecurity threat that is not listed above.",
    questions: [
      {
        id: "active_incident",
        label: "Is this threat currently affecting the business?",
        impact: "high"
      },
      {
        id: "data_or_access_impact",
        label: "Has data, access, or operations been impacted?",
        impact: "high"
      },
      {
        id: "customers_affected",
        label: "Have customers or staff been affected?",
        impact: "medium"
      },
      { id: "reported", label: "Has the incident been reported?", impact: "info" },
      { id: "resolved", label: "Is the issue currently resolved?", impact: "info" }
    ]
  }
];
function getThreatOption(id) {
  return CYBER_THREAT_OPTIONS.find((t) => t.id === id);
}
const ACTIONS = {
  phishing: [
    "Change affected account passwords immediately.",
    "Enable multi-factor authentication.",
    "Review recent account activity.",
    "Report and investigate the suspicious message.",
    "Provide phishing awareness training to affected employees."
  ],
  bec: [
    "Verify payment requests through a second channel.",
    "Freeze or reverse any suspicious transfers if possible.",
    "Review email account forwarding rules and inbox rules.",
    "Warn staff about executive/supplier impersonation.",
    "Enable stronger email authentication where available."
  ],
  malware: [
    "Disconnect and scan affected devices.",
    "Update antivirus definitions and run a full scan.",
    "Remove unknown software and restore from a clean backup if needed.",
    "Review downloads and email attachments from the past week.",
    "Keep operating systems and apps patched."
  ],
  ransomware: [
    "Isolate affected devices from the network immediately.",
    "Do not pay a ransom without professional advice.",
    "Restore critical files from clean backups.",
    "Report the incident to relevant authorities/providers.",
    "Review backup and recovery procedures."
  ],
  password_attacks: [
    "Change compromised passwords immediately.",
    "Enable multi-factor authentication on all critical accounts.",
    "Review recent login history for unauthorized access.",
    "Disable unused or shared accounts.",
    "Use a password manager for unique strong passwords."
  ],
  social_engineering: [
    "Brief staff on the incident and verification procedures.",
    "Revoke any access granted during the interaction.",
    "Confirm no funds or data were released incorrectly.",
    "Update call-back and identity verification rules.",
    "Log the incident for future awareness training."
  ],
  data_breach: [
    "Contain unauthorized access immediately.",
    "Identify what data was exposed and who is affected.",
    "Notify affected parties where legally or ethically required.",
    "Rotate credentials and review access permissions.",
    "Preserve logs for investigation."
  ],
  payment_fraud: [
    "Contact your bank or payment provider immediately.",
    "Disable compromised payment channels temporarily.",
    "Review recent transactions for further fraud.",
    "Notify affected customers if their payments were impacted.",
    "Strengthen checkout and refund verification controls."
  ],
  website_attacks: [
    "Take the compromised site offline or into maintenance mode if needed.",
    "Restore from a clean backup.",
    "Update CMS, plugins, and hosting credentials.",
    "Scan for injected scripts or backdoors.",
    "Enable monitoring and web application firewalls where available."
  ],
  ddos: [
    "Contact your hosting/ISP provider for mitigation.",
    "Enable rate-limiting or DDoS protection services.",
    "Communicate service status to customers.",
    "Monitor traffic until services stabilize.",
    "Document attack windows for future capacity planning."
  ],
  insider_threat: [
    "Revoke or restrict the individual's access immediately.",
    "Preserve audit logs and evidence.",
    "Review what systems and data were accessed.",
    "Update access control and least-privilege policies.",
    "Conduct an internal review with management."
  ],
  other: [
    "Document the threat and impact clearly.",
    "Contain any active exposure or unauthorized access.",
    "Escalate to your IT support or cybersecurity advisor.",
    "Update passwords and access controls as needed.",
    "Monitor systems closely after containment."
  ]
};
function scoreThreat(threat, answers) {
  let score = 18;
  const reasons = [];
  for (const q of threat.questions) {
    const yes = Boolean(answers[q.id]);
    if (q.impact === "high" && yes) {
      score = Math.max(score, 88);
      reasons.push(q.label.replace(/\?$/, ""));
    } else if (q.impact === "medium" && yes) {
      score = Math.max(score, 58);
      if (reasons.length < 2) reasons.push(q.label.replace(/\?$/, ""));
    }
  }
  if (answers.resolved || answers.mitigated || answers.isolated || answers.password_changed) {
    if (score < 75) score = Math.max(15, score - 10);
  }
  if (answers.mfa_enabled) score = Math.max(15, score - 5);
  if (threat.id === "phishing") {
    if (answers.submitted_credentials || answers.clicked_link) score = Math.max(score, 88);
    else if (answers.received_suspicious) score = Math.max(score, 55);
  }
  if (threat.id === "ransomware") {
    if (answers.files_encrypted || answers.ops_disrupted || answers.device_affected) {
      score = Math.max(score, 90);
    }
  }
  if (threat.id === "password_attacks") {
    if (answers.unauthorized_access || answers.password_compromised) score = Math.max(score, 88);
    else if (answers.suspicious_logins) score = Math.max(score, 55);
  }
  const hasActiveIssue = threat.questions.some((q) => q.impact !== "info" && answers[q.id]);
  const resolved = Boolean(answers.resolved || answers.mitigated);
  if (!hasActiveIssue) {
    return {
      score: Math.min(score, 22),
      reason: "No high-impact cybersecurity indicators were reported for this threat.",
      status: "resolved"
    };
  }
  return {
    score,
    reason: reasons.length > 0 ? `${reasons[0]}${reasons[1] ? `; ${reasons[1].charAt(0).toLowerCase()}${reasons[1].slice(1)}` : ""}.` : "Relevant cybersecurity indicators were reported for this threat.",
    status: resolved ? "resolved" : "active"
  };
}
function assessCyberThreats(input) {
  const selected = [...new Set(input.selectedThreats)];
  if (selected.length === 0) {
    throw new Error("Select at least one cybersecurity threat.");
  }
  if (selected.includes("other") && !input.otherDescription?.trim()) {
    throw new Error("Please specify the cybersecurity threat for Other.");
  }
  const threats = selected.map((id) => {
    const option = getThreatOption(id);
    if (!option) throw new Error(`Unknown threat: ${id}`);
    const answers = input.answersByThreat[id] ?? {};
    for (const q of option.questions) {
      if (typeof answers[q.id] !== "boolean") {
        throw new Error(`Please answer all questions for ${option.name}.`);
      }
    }
    const scored = scoreThreat(option, answers);
    const level = levelFromScore(scored.score);
    return {
      threatType: id,
      threatName: option.name,
      otherDescription: id === "other" ? input.otherDescription?.trim() : void 0,
      answers,
      score: scored.score,
      level,
      label: labelOf$1(level),
      reason: scored.reason,
      recommendedActions: ACTIONS[id],
      status: scored.status
    };
  });
  const overallScore = Math.max(...threats.map((t) => t.score));
  const overallLevel = levelFromScore(overallScore);
  const top = [...threats].sort((a, b) => b.score - a.score)[0];
  return {
    selectedThreats: selected,
    otherDescription: input.otherDescription?.trim() || void 0,
    threats,
    overallScore,
    overallLevel,
    overallLabel: labelOf$1(overallLevel),
    overallReason: top.reason
  };
}
function legacyFlagsFromAssessment(assessment) {
  const flat = assessment.threats.flatMap((t) => Object.entries(t.answers));
  const yes = (id) => flat.some(([key, value]) => key === id && value);
  const passwordIssue = yes("password_compromised") || yes("unauthorized_access") || yes("submitted_credentials") || assessment.threats.some(
    (t) => (t.threatType === "password_attacks" || t.threatType === "phishing") && t.level !== "low"
  );
  const malwareLike = assessment.selectedThreats.includes("malware") || assessment.selectedThreats.includes("ransomware");
  const deviceHit = yes("device_infected") || yes("device_affected") || yes("files_encrypted");
  const suspicious = assessment.overallLevel !== "low" || yes("clicked_link") || yes("submitted_credentials") || yes("unauthorized_access") || yes("fraud_detected");
  return {
    passwordUpdated: !passwordIssue || yes("password_changed"),
    antivirusActive: !(malwareLike && deviceHit),
    suspicious
  };
}
const severitySchema = enumType(["low", "medium", "high"]);
const categorySchema = enumType(["financial", "cybersecurity", "compliance", "operational"]);
const alertStatusSchema = enumType(["active", "reviewed", "resolved"]);
const profileSchema = objectType({
  businessName: stringType(),
  ownerName: stringType(),
  email: stringType().email(),
  phone: stringType(),
  businessType: stringType(),
  employees: numberType().int().min(0)
});
const stateSchema = objectType({
  profile: profileSchema,
  financial: arrayType(objectType({
    id: stringType(),
    date: stringType(),
    income: numberType(),
    expenses: numberType(),
    outstanding: numberType()
  })),
  cyber: arrayType(objectType({
    id: stringType(),
    date: stringType(),
    passwordUpdated: booleanType(),
    antivirusActive: booleanType(),
    suspicious: booleanType(),
    assessment: unknownType().optional()
  })),
  compliance: arrayType(objectType({
    id: stringType(),
    date: stringType(),
    taxDeadline: stringType(),
    taxStatus: stringType(),
    licenseExpiry: stringType(),
    licenseStatus: stringType()
  })),
  operational: arrayType(objectType({
    id: stringType(),
    date: stringType(),
    staffPresent: numberType().int(),
    staffRequired: numberType().int(),
    equipment: enumType(["working", "faulty"]),
    delivery: enumType(["on-schedule", "delayed"])
  })),
  alerts: arrayType(objectType({
    id: stringType(),
    category: categorySchema,
    severity: severitySchema,
    title: stringType(),
    action: stringType(),
    date: stringType(),
    status: alertStatusSchema
  }))
});
const loadRiskStateFn = createServerFn({
  method: "POST"
}).validator(objectType({
  userId: stringType().uuid()
})).handler(createSsrRpc("ab86894539af2179a85590228fde8468173a76344cb30a56302e203c77b25318"));
const loadAllSmeRiskStatesFn = createServerFn({
  method: "GET"
}).handler(createSsrRpc("1ab810b15808738ba3b6d08f809f56a547ab4585c80649081b08fca4df9b2b6d"));
const saveRiskStateFn = createServerFn({
  method: "POST"
}).validator(objectType({
  userId: stringType().uuid(),
  state: stateSchema
})).handler(createSsrRpc("8fa0e13e4a07249306929f9e1dca61bd78057527aae39fb142b159cc1a5aceb8"));
async function loadRemoteRiskState(userId) {
  if (!await isRemoteAuthEnabled()) return null;
  try {
    const result = await loadRiskStateFn({ data: { userId } });
    return result.state;
  } catch (error) {
    console.error("[risk] load remote failed:", error);
    return null;
  }
}
async function loadAllRemoteRiskStates() {
  if (!await isRemoteAuthEnabled()) return {};
  try {
    const result = await loadAllSmeRiskStatesFn();
    return result.states;
  } catch (error) {
    console.error("[risk] load all remote failed:", error);
    return {};
  }
}
async function saveRemoteRiskState(userId, state2) {
  if (!await isRemoteAuthEnabled()) return null;
  try {
    const result = await saveRiskStateFn({ data: { userId, state: state2 } });
    if (!result.ok) {
      console.error("[risk] save remote failed:", result.error);
      return null;
    }
    return result.state;
  } catch (error) {
    console.error("[risk] save remote failed:", error);
    return null;
  }
}
function stateHasMonitoringData(state2) {
  if (!state2) return false;
  return state2.financial.length > 0 || state2.cyber.length > 0 || state2.compliance.length > 0 || state2.operational.length > 0 || state2.alerts.length > 0;
}
const today = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
const uid = () => Math.random().toString(36).slice(2, 10);
const stateKey = (userId) => `srs:state:v1:${userId}`;
const STATE_CHANGED_EVENT$1 = "srs:state-changed";
const guestProfile = {
  businessName: "",
  ownerName: "",
  email: "",
  phone: "",
  businessType: "Retail",
  employees: 0
};
function emptyState(profile = guestProfile) {
  return { profile, financial: [], cyber: [], compliance: [], operational: [], alerts: [] };
}
function writeLocalState(userId, next) {
  if (typeof window === "undefined") return;
  localStorage.setItem(stateKey(userId), JSON.stringify(next));
  window.dispatchEvent(new Event(STATE_CHANGED_EVENT$1));
}
function loadUserState(userId, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(stateKey(userId));
    if (raw) {
      const parsed = JSON.parse(raw);
      delete parsed.authed;
      return parsed;
    }
  } catch {
  }
  return fallback;
}
function loadStateForUser(userId) {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(stateKey(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    delete parsed.authed;
    return parsed;
  } catch {
    return null;
  }
}
async function syncAllRemoteRiskStates() {
  if (typeof window === "undefined") return;
  if (!await isRemoteAuthEnabled()) return;
  const states = await loadAllRemoteRiskStates();
  for (const [userId, remoteState] of Object.entries(states)) {
    writeLocalState(userId, remoteState);
  }
}
async function resolveUserState(userId, fallback) {
  if (!await isRemoteAuthEnabled()) {
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
const adminProfile = {
  businessName: "SME Risk Sentinel",
  ownerName: "System Administrator",
  email: SUPER_ADMIN_EMAIL,
  phone: "",
  businessType: "Platform",
  employees: 0
};
let currentUserId = null;
let state = emptyState();
let snapshotCache = null;
let postLogoutLoginVisit = false;
const listeners$1 = /* @__PURE__ */ new Set();
let remotePersistTimer = null;
let remotePersistChain = Promise.resolve();
let remotePersistSeq = 0;
function isPostLogoutLoginVisit() {
  return postLogoutLoginVisit;
}
function consumePostLogoutLoginVisit() {
  if (!postLogoutLoginVisit) return false;
  postLogoutLoginVisit = false;
  return true;
}
function buildSnapshot() {
  return { ...state, authed: isAuthenticated() && currentUserId !== null };
}
function invalidateSnapshot() {
  snapshotCache = null;
}
function getSnapshot() {
  if (!snapshotCache) snapshotCache = buildSnapshot();
  return snapshotCache;
}
function notify$1() {
  invalidateSnapshot();
  listeners$1.forEach((l) => l());
}
function resetStoreAfterDataWipe() {
  currentUserId = null;
  state = emptyState();
  postLogoutLoginVisit = true;
  notify$1();
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
function persist(opts) {
  if (typeof window !== "undefined" && currentUserId) {
    writeLocalState(currentUserId, state);
  }
  notify$1();
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
    remotePersistChain = remotePersistChain.then(async () => {
      if (seq !== remotePersistSeq || currentUserId !== userId) return;
      if (!await isRemoteAuthEnabled()) return;
      const snapshot = state;
      const saved = await saveRemoteRiskState(userId, snapshot);
      if (!saved || seq !== remotePersistSeq || currentUserId !== userId) return;
      state = saved;
      writeLocalState(userId, saved);
      notify$1();
    }).catch((error) => {
      console.error("[risk] remote persist failed:", error);
    });
  }, 400);
}
async function switchToUser(userId, fallback) {
  currentUserId = userId;
  state = await resolveUserState(userId, fallback);
  persist({ skipRemote: true });
  if (await isRemoteAuthEnabled()) {
    scheduleRemotePersist();
  }
}
function setState(updater) {
  state = updater(state);
  persist();
}
const store = {
  getState: getSnapshot,
  subscribe: (l) => {
    listeners$1.add(l);
    return () => listeners$1.delete(l);
  },
  hydrateFromSession: async () => {
    await hydrateAuth();
    const session = getSession();
    if (!session) {
      currentUserId = null;
      state = emptyState();
      notify$1();
      return;
    }
    currentUserId = session.userId;
    state = await resolveUserState(
      session.userId,
      emptyState({ ...guestProfile, email: session.email })
    );
    persist({ skipRemote: true });
  },
  isAuthed: () => isAuthenticated() && currentUserId !== null,
  authenticate: async (email, password) => {
    await ensureSeeded();
    const result = await loginUser(normalizeEmail(email), password);
    if (!result.ok) return result;
    if (result.role === "SUPER_ADMIN") {
      await switchToUser(result.userId, emptyState(adminProfile));
    } else {
      const profile = result.profile ?? {
        ...guestProfile,
        email: result.email
      };
      const existing = loadStateForUser(result.userId);
      await switchToUser(
        result.userId,
        existing ? {
          ...existing,
          profile: {
            ...existing.profile,
            ...profile,
            email: result.email
          }
        } : emptyState({ ...guestProfile, ...profile, email: result.email })
      );
    }
    return result;
  },
  register: async (profile, password) => {
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
      employees: profile.employees
    });
    if (!result.ok) return result;
    const nextProfile = result.profile ? { ...profile, ...result.profile, email: result.email } : { ...profile, email: result.email };
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
    notify$1();
  },
  resetPassword: (email, newPassword) => resetPassword(email, newPassword),
  changePassword: (currentPassword, newPassword) => {
    const session = getSession();
    if (!session) return Promise.resolve({ ok: false, error: "Not signed in." });
    return changePassword(session.userId, currentPassword, newPassword);
  },
  updateProfile: async (p) => {
    if (p.email && currentUserId && normalizeEmail(p.email) !== normalizeEmail(state.profile.email)) {
      const result = await updateUserEmail(currentUserId, p.email);
      if (!result.ok) return result;
    }
    setState((s) => ({ ...s, profile: { ...s.profile, ...p } }));
    return { ok: true, userId: currentUserId, email: state.profile.email };
  },
  reset: () => {
    if (!currentUserId) return;
    state = emptyState(state.profile);
    persist();
  },
  addFinancial: (e) => {
    const entry = { ...e, id: uid(), date: today() };
    setState((s) => ({ ...s, financial: [...s.financial, entry] }));
    runFinancialRules(entry);
  },
  addCyber: (e) => {
    const entry = { ...e, id: uid(), date: today() };
    setState((s) => ({ ...s, cyber: [...s.cyber, entry] }));
    runCyberRules(entry);
  },
  addCyberAssessment: (assessment) => {
    const flags = legacyFlagsFromAssessment(assessment);
    const entry = {
      id: uid(),
      date: today(),
      ...flags,
      assessment
    };
    setState((s) => ({ ...s, cyber: [...s.cyber, entry] }));
    runCyberRules(entry);
  },
  addCompliance: (e) => {
    const entry = { ...e, id: uid(), date: today() };
    setState((s) => ({ ...s, compliance: [...s.compliance, entry] }));
    runComplianceRules(entry);
  },
  addOperational: (e) => {
    const entry = { ...e, id: uid(), date: today() };
    setState((s) => ({ ...s, operational: [...s.operational, entry] }));
    runOperationalRules(entry);
  },
  markReviewed: (id) => setState((s) => ({
    ...s,
    alerts: s.alerts.map(
      (a) => a.id === id && a.status === "active" ? { ...a, status: "reviewed" } : a
    )
  })),
  markResolved: (id) => setState((s) => ({
    ...s,
    alerts: s.alerts.map(
      (a) => a.id === id && a.status !== "resolved" ? { ...a, status: "resolved" } : a
    )
  })),
  resolveAlert: (id) => setState((s) => ({
    ...s,
    alerts: s.alerts.map(
      (a) => a.id === id && a.status !== "resolved" ? { ...a, status: "resolved" } : a
    )
  })),
  resolveAllActive: () => setState((s) => ({
    ...s,
    alerts: s.alerts.map(
      (a) => a.status === "active" ? { ...a, status: "resolved" } : a
    )
  })),
  syncAlertsFromLatest
};
function alertDedupeKey(a) {
  return `${a.category}:${a.title}`;
}
function notifyNewAlert(alert) {
  if (typeof window === "undefined") return;
  const profile = { ...state.profile };
  void notifyAlertCreated({
    alert,
    profile,
    dashboardUrl: `${window.location.origin}/app/alerts`
  });
}
function pushAlert(a, opts) {
  const key = alertDedupeKey(a);
  const existing = state.alerts.find((x) => alertDedupeKey(x) === key);
  if (existing) {
    if (existing.status === "active") return;
    if (opts?.syncOnly) return;
    const alert2 = {
      ...existing,
      ...a,
      status: "active",
      date: today()
    };
    setState((s) => ({
      ...s,
      alerts: [alert2, ...s.alerts.filter((x) => x.id !== existing.id)]
    }));
    notifyNewAlert(alert2);
    return;
  }
  const alert = { ...a, id: uid(), date: today(), status: "active" };
  setState((s) => ({ ...s, alerts: [alert, ...s.alerts] }));
  notifyNewAlert(alert);
}
function syncAlertsFromLatest() {
  const syncOpts = { syncOnly: true };
  const e = state.financial.at(-1);
  if (e) runFinancialRules(e, syncOpts);
  const c = state.cyber.at(-1);
  if (c) runCyberRules(c, syncOpts);
  const co = state.compliance.at(-1);
  if (co) runComplianceRules(co, syncOpts);
  const o = state.operational.at(-1);
  if (o) runOperationalRules(o, syncOpts);
}
function daysUntilDate(dateStr, now = Date.now()) {
  return Math.floor((new Date(dateStr).getTime() - now) / 864e5);
}
function evaluateFinancialAlerts(e) {
  const alerts = [];
  if (e.expenses > e.income) {
    alerts.push({
      category: "financial",
      severity: "high",
      title: "Expenses exceed income",
      action: "Review variable costs and renegotiate non-essential spending immediately."
    });
  } else if (e.income - e.expenses < e.income * 0.1) {
    alerts.push({
      category: "financial",
      severity: "medium",
      title: "Low profit margin (<10%)",
      action: "Identify top-margin products and prioritize sales of higher-margin items."
    });
  }
  if (e.outstanding > e.income * 0.2) {
    alerts.push({
      category: "financial",
      severity: e.outstanding > e.income * 0.4 ? "high" : "medium",
      title: "Outstanding payments above threshold",
      action: "Send collection reminders and offer short-term payment plans."
    });
  }
  return alerts;
}
function evaluateCyberAlerts(e) {
  if (e.assessment) {
    const alerts2 = [];
    for (const threat of e.assessment.threats) {
      if (threat.level !== "high" && threat.level !== "medium") continue;
      alerts2.push({
        category: "cybersecurity",
        severity: threat.level,
        title: threat.level === "high" ? `High cybersecurity risk: ${threat.threatName}` : `Medium cybersecurity risk: ${threat.threatName}`,
        action: threat.recommendedActions[0] ?? threat.reason
      });
    }
    if (alerts2.length === 0 && e.assessment.overallLevel !== "low") {
      alerts2.push({
        category: "cybersecurity",
        severity: e.assessment.overallLevel,
        title: `${e.assessment.overallLabel} detected`,
        action: e.assessment.overallReason
      });
    }
    return alerts2;
  }
  const alerts = [];
  if (!e.antivirusActive) {
    alerts.push({
      category: "cybersecurity",
      severity: "high",
      title: "Antivirus inactive",
      action: "Re-enable endpoint protection on all devices today."
    });
  }
  if (e.suspicious) {
    alerts.push({
      category: "cybersecurity",
      severity: "high",
      title: "Suspicious activity reported",
      action: "Isolate affected accounts and force a password reset."
    });
  }
  if (!e.passwordUpdated) {
    alerts.push({
      category: "cybersecurity",
      severity: "medium",
      title: "Passwords not updated",
      action: "Rotate all admin and shared-account passwords within 7 days."
    });
  }
  return alerts;
}
function evaluateComplianceAlerts(e, now = Date.now()) {
  const alerts = [];
  const td = daysUntilDate(e.taxDeadline, now);
  if (td < 0) {
    alerts.push({
      category: "compliance",
      severity: "high",
      title: "Tax deadline passed",
      action: "File outstanding tax submissions and contact a tax advisor."
    });
  } else if (td <= 7) {
    alerts.push({
      category: "compliance",
      severity: "medium",
      title: `Tax deadline in ${td} days`,
      action: "Prepare filing documents and confirm payment schedule."
    });
  }
  const ld = daysUntilDate(e.licenseExpiry, now);
  if (ld < 0) {
    alerts.push({
      category: "compliance",
      severity: "high",
      title: "Business license expired",
      action: "Renew license immediately to avoid operating illegally."
    });
  } else if (ld <= 7) {
    alerts.push({
      category: "compliance",
      severity: "medium",
      title: `License expires in ${ld} days`,
      action: "Submit renewal paperwork this week."
    });
  }
  return alerts;
}
function evaluateOperationalAlerts(e) {
  const alerts = [];
  if (e.staffPresent < e.staffRequired) {
    alerts.push({
      category: "operational",
      severity: "medium",
      title: "Low staff availability",
      action: "Schedule cover or activate part-time staff for the shortfall."
    });
  }
  if (e.equipment === "faulty") {
    alerts.push({
      category: "operational",
      severity: "medium",
      title: "Faulty equipment reported",
      action: "Log a service request and prepare a backup workflow."
    });
  }
  if (e.delivery === "delayed") {
    alerts.push({
      category: "operational",
      severity: "medium",
      title: "Delivery delayed",
      action: "Notify affected customers and confirm new ETA with supplier."
    });
  }
  return alerts;
}
function runFinancialRules(e, opts) {
  for (const alert of evaluateFinancialAlerts(e)) pushAlert(alert, opts);
}
function runCyberRules(e, opts) {
  for (const alert of evaluateCyberAlerts(e)) pushAlert(alert, opts);
}
function runComplianceRules(e, opts) {
  for (const alert of evaluateComplianceAlerts(e)) pushAlert(alert, opts);
}
function runOperationalRules(e, opts) {
  for (const alert of evaluateOperationalAlerts(e)) pushAlert(alert, opts);
}
const RISK_SCORE_HIGH_THRESHOLD = 75;
const RISK_SCORE_MEDIUM_THRESHOLD = 40;
function riskLevelFromScore(score) {
  if (score >= RISK_SCORE_HIGH_THRESHOLD) return "high";
  if (score >= RISK_SCORE_MEDIUM_THRESHOLD) return "medium";
  return "low";
}
const labelOf = (l) => ({ low: "Low Risk", medium: "Medium Risk", high: "High Risk" })[l];
function financialRisk(s) {
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
function cyberRisk(s) {
  const e = s.cyber.at(-1);
  if (!e) return { level: "low", score: 10, label: labelOf("low") };
  if (e.assessment) {
    const score2 = e.assessment.overallScore;
    const lvl2 = e.assessment.overallLevel;
    return { level: lvl2, score: score2, label: e.assessment.overallLabel };
  }
  let score = 15;
  if (!e.antivirusActive) score = Math.max(score, 90);
  if (e.suspicious) score = Math.max(score, 88);
  if (!e.passwordUpdated) score = Math.max(score, 55);
  const lvl = riskLevelFromScore(score);
  return { level: lvl, score, label: labelOf(lvl) };
}
function complianceRisk(s, now = Date.now()) {
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
function operationalRisk(s) {
  const e = s.operational.at(-1);
  if (!e) return { level: "low", score: 10, label: labelOf("low") };
  let score = 15;
  if (e.staffPresent < e.staffRequired) score = Math.max(score, 55);
  if (e.equipment === "faulty") score = Math.max(score, 60);
  if (e.delivery === "delayed") score = Math.max(score, 55);
  const lvl = riskLevelFromScore(score);
  return { level: lvl, score, label: labelOf(lvl) };
}
function overallRisk(s, now = Date.now()) {
  const all = [financialRisk(s), cyberRisk(s), complianceRisk(s, now), operationalRisk(s)];
  const score = Math.round(all.reduce((a, r) => a + r.score, 0) / all.length);
  const lvl = riskLevelFromScore(score);
  return { level: lvl, score, label: labelOf(lvl) };
}
function hasFinancialData(s) {
  return s.financial.length > 0;
}
function hasCyberData(s) {
  return s.cyber.length > 0;
}
function hasComplianceData(s) {
  return s.compliance.length > 0;
}
function hasOperationalData(s) {
  return s.operational.length > 0;
}
function hasAnyRiskData(s) {
  return hasFinancialData(s) || hasCyberData(s) || hasComplianceData(s) || hasOperationalData(s);
}
const serverSnapshot = { ...emptyState(), authed: false };
function useStore(selector) {
  return reactExports.useSyncExternalStore(
    store.subscribe,
    () => selector(getSnapshot()),
    () => selector(serverSnapshot)
  );
}
const categoryLinks = {
  financial: "/app/financial",
  cybersecurity: "/app/cybersecurity",
  compliance: "/app/compliance",
  operational: "/app/operational"
};
const severityPriority = { high: 3, medium: 2, low: 1 };
function getRecommendations(s, limit = 6) {
  const items = [];
  for (const alert of s.alerts.filter((a) => a.status === "active")) {
    items.push({
      priority: severityPriority[alert.severity],
      title: alert.title,
      action: alert.action,
      category: alert.category,
      href: categoryLinks[alert.category]
    });
  }
  const checks = [
    {
      category: "financial",
      risk: financialRisk(s),
      hint: "Review income, expenses, and outstanding payments."
    },
    {
      category: "cybersecurity",
      risk: cyberRisk(s),
      hint: "Run a cybersecurity threat assessment and follow recommended actions."
    },
    {
      category: "compliance",
      risk: complianceRisk(s),
      hint: "Confirm tax and license deadlines are on track."
    },
    {
      category: "operational",
      risk: operationalRisk(s),
      hint: "Update staffing, equipment, and delivery status."
    }
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
      href: categoryLinks[category]
    });
  }
  return items.sort((a, b) => b.priority - a.priority).filter((item, i, arr) => arr.findIndex((x) => x.title === item.title) === i).slice(0, limit);
}
function riskAtDate(s, date, category) {
  const cut = {
    ...s,
    financial: s.financial.filter((e) => e.date <= date),
    cyber: s.cyber.filter((e) => e.date <= date),
    compliance: s.compliance.filter((e) => e.date <= date),
    operational: s.operational.filter((e) => e.date <= date)
  };
  if (category === "financial") return financialRisk(cut);
  if (category === "cybersecurity") return cyberRisk(cut);
  if (category === "compliance") return complianceRisk(cut);
  return operationalRisk(cut);
}
const severityColor = {
  low: "bg-success text-success-foreground",
  medium: "bg-warning text-warning-foreground",
  high: "bg-destructive text-destructive-foreground"
};
const alertStatusColor = {
  active: "bg-destructive/10 text-destructive",
  reviewed: "bg-warning/10 text-warning",
  resolved: "bg-success/10 text-success"
};
const listeners = /* @__PURE__ */ new Set();
let cache = null;
let syncStarted = false;
const STATE_CHANGED_EVENT = "srs:state-changed";
const USERS_STORAGE_KEY$1 = "srs:users:v1";
const STATE_STORAGE_PREFIX$1 = "srs:state:v1:";
function notify() {
  cache = null;
  listeners.forEach((l) => l());
}
function storageKeyAffectsAdmin(key) {
  return key === USERS_STORAGE_KEY$1 || key?.startsWith(STATE_STORAGE_PREFIX$1) === true;
}
function initAdminStoreSync() {
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
function countByLevel(counts, level) {
  counts[level]++;
}
function buildSmeRecord(user) {
  const state2 = loadStateForUser(user.id);
  const profile = state2?.profile ?? emptyProfile(user.email);
  const risk = state2 ? overallRisk(state2) : { level: "low", score: 0, label: "Low Risk" };
  const alerts = state2?.alerts ?? [];
  const hasMonitoringData = !!state2 && (state2.financial.length > 0 || state2.cyber.length > 0 || state2.compliance.length > 0 || state2.operational.length > 0);
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
    hasMonitoringData
  };
}
function emptyProfile(email) {
  return { businessName: "", ownerName: "", email, phone: "", businessType: "Other", employees: 0 };
}
function monthKey(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function monthLabel(key) {
  const [y, m] = key.split("-");
  return new Date(Number(y), Number(m) - 1).toLocaleDateString(void 0, {
    month: "short",
    year: "2-digit"
  });
}
function buildDashboardData() {
  const smeUsers = getAllUsers().filter((u) => u.role === "SME_OWNER");
  const smes = smeUsers.map(buildSmeRecord);
  const metrics = {
    totalSmes: smes.length,
    activeSmes: smes.filter((s) => s.accountStatus === "active").length,
    suspendedSmes: smes.filter((s) => s.accountStatus === "suspended").length,
    highRiskSmes: smes.filter((s) => s.riskLevel === "high").length,
    totalAlerts: smes.reduce((sum, s) => sum + s.alertCount, 0),
    totalReports: smes.filter((s) => s.hasMonitoringData).length
  };
  const riskDistribution = [
    { name: "Low", value: smes.filter((s) => s.riskLevel === "low").length },
    { name: "Medium", value: smes.filter((s) => s.riskLevel === "medium").length },
    { name: "High", value: smes.filter((s) => s.riskLevel === "high").length }
  ];
  const regByMonth = /* @__PURE__ */ new Map();
  for (const u of smeUsers) {
    const key = monthKey(u.createdAt);
    regByMonth.set(key, (regByMonth.get(key) ?? 0) + 1);
  }
  const registrationTrends = [...regByMonth.entries()].sort(([a], [b]) => a.localeCompare(b)).slice(-6).map(([key, count]) => ({ month: monthLabel(key), count }));
  const alertByMonth = /* @__PURE__ */ new Map();
  for (const u of smeUsers) {
    const state2 = loadStateForUser(u.id);
    for (const a of state2?.alerts ?? []) {
      const key = monthKey(a.date);
      alertByMonth.set(key, (alertByMonth.get(key) ?? 0) + 1);
    }
  }
  const alertTrends = [...alertByMonth.entries()].sort(([a], [b]) => a.localeCompare(b)).slice(-6).map(([key, count]) => ({ month: monthLabel(key), count }));
  const categoryCounts = /* @__PURE__ */ new Map();
  for (const s of smes) {
    categoryCounts.set(s.businessType, (categoryCounts.get(s.businessType) ?? 0) + 1);
  }
  const categoryDistribution = [...categoryCounts.entries()].map(([name, value]) => ({
    name,
    value
  }));
  const riskAggregation = {
    financial: { low: 0, medium: 0, high: 0, avgScore: 0 },
    cybersecurity: { low: 0, medium: 0, high: 0, avgScore: 0 },
    compliance: { low: 0, medium: 0, high: 0, avgScore: 0 },
    operational: { low: 0, medium: 0, high: 0, avgScore: 0 }
  };
  let finTotal = 0;
  let cybTotal = 0;
  let comTotal = 0;
  let opsTotal = 0;
  const n = smeUsers.length || 1;
  for (const u of smeUsers) {
    const state2 = loadStateForUser(u.id);
    if (!state2) continue;
    const fin = financialRisk(state2);
    const cyb = cyberRisk(state2);
    const com = complianceRisk(state2);
    const ops = operationalRisk(state2);
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
    smes
  };
}
function getData() {
  if (typeof window === "undefined") return emptyData;
  if (!cache) cache = buildDashboardData();
  return cache;
}
const emptyData = {
  metrics: {
    totalSmes: 0,
    activeSmes: 0,
    suspendedSmes: 0,
    highRiskSmes: 0,
    totalAlerts: 0,
    totalReports: 0
  },
  riskDistribution: [],
  registrationTrends: [],
  alertTrends: [],
  categoryDistribution: [],
  riskAggregation: {
    financial: { low: 0, medium: 0, high: 0, avgScore: 0 },
    cybersecurity: { low: 0, medium: 0, high: 0, avgScore: 0 },
    compliance: { low: 0, medium: 0, high: 0, avgScore: 0 },
    operational: { low: 0, medium: 0, high: 0, avgScore: 0 }
  },
  smes: []
};
const adminStore = {
  subscribe: (l) => {
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
      } finally {
        notify();
      }
    })();
  },
  isAdminAuthed: () => isAuthenticated() && isSuperAdmin(),
  getSmeDetails: (userId) => ({
    user: getUserById(userId),
    state: loadStateForUser(userId)
  }),
  suspendSme: async (userId) => {
    const result = await updateUserStatus(userId, "suspended");
    if (result.ok) notify();
    return result;
  },
  reactivateSme: async (userId) => {
    const result = await updateUserStatus(userId, "active");
    if (result.ok) notify();
    return result;
  }
};
function useAdminStore(selector) {
  return reactExports.useSyncExternalStore(
    adminStore.subscribe,
    () => selector(getData()),
    () => selector(emptyData)
  );
}
const USERS_STORAGE_KEY = "srs:users:v1";
const LEGACY_USERS_STORAGE_KEY = "srs:users";
const STATE_STORAGE_PREFIX = "srs:state:v1:";
async function resetAllApplicationData() {
  if (typeof window === "undefined") {
    return {
      removedAccounts: 0,
      removedStateKeys: 0,
      superAdminReseeded: false,
      clearedKeys: []
    };
  }
  const clearedKeys = [];
  let removedAccounts = 0;
  try {
    const rawUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (rawUsers) {
      removedAccounts = JSON.parse(rawUsers).length;
    }
  } catch {
  }
  const stateKeys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STATE_STORAGE_PREFIX)) stateKeys.push(key);
  }
  for (const key of stateKeys) {
    localStorage.removeItem(key);
    clearedKeys.push(key);
  }
  for (const key of [JWT_STORAGE_KEY, LEGACY_SESSION_KEY, LEGACY_USERS_STORAGE_KEY]) {
    if (localStorage.getItem(key) !== null) {
      localStorage.removeItem(key);
      clearedKeys.push(key);
    }
  }
  clearSession();
  resetAuthModuleState();
  await resetAllUserAccountsAndReseedSuperAdmin();
  const superAdminReseeded = Boolean(
    localStorage.getItem(USERS_STORAGE_KEY)?.includes(SUPER_ADMIN_EMAIL)
  );
  resetStoreAfterDataWipe();
  adminStore.refresh();
  if (!clearedKeys.includes(USERS_STORAGE_KEY)) {
    clearedKeys.push(
      `${USERS_STORAGE_KEY} (all accounts wiped; default super admin re-seeded: ${SUPER_ADMIN_EMAIL} / ${SUPER_ADMIN_PASSWORD})`
    );
  }
  return {
    removedAccounts,
    removedStateKeys: stateKeys.length,
    superAdminReseeded,
    clearedKeys
  };
}
function exposeResetOnWindow() {
  if (typeof window === "undefined") return;
  window.__resetAppData = resetAllApplicationData;
}
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-base text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-base text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$k = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Risk Sentinel" },
      { name: "description", content: "SME risk monitoring and reporting" },
      { property: "og:title", content: "Risk Sentinel" },
      { property: "og:description", content: "SME risk monitoring and reporting" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" }
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap"
      },
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  const csrfToken = getCsrfToken();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("head", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}),
      csrfToken ? /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: CSRF_META_NAME, content: csrfToken }) : null
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$k.useRouteContext();
  reactExports.useEffect(() => {
    exposeResetOnWindow();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { richColors: true, position: "top-right" })
  ] });
}
const $$splitComponentImporter$j = () => import("./register-CMQgA4OE.mjs");
const Route$j = createFileRoute("/register")({
  beforeLoad: async () => {
    await ensureSeeded();
    await hydrateAuth();
    if (isAuthenticated()) {
      if (isSuperAdmin()) throw redirect({
        to: "/admin/dashboard"
      });
      throw redirect({
        to: "/app/dashboard"
      });
    }
  },
  head: () => ({
    meta: [{
      title: "Register — Risk Sentinel"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("./login-BdjXHuZZ.mjs");
const Route$i = createFileRoute("/login")({
  beforeLoad: async () => {
    await ensureSeeded();
    if (isPostLogoutLoginVisit()) {
      clearSession();
      return;
    }
    await hydrateAuth();
    if (isAuthenticated()) {
      if (isSuperAdmin()) throw redirect({
        to: "/admin/dashboard"
      });
      throw redirect({
        to: "/app/dashboard"
      });
    }
  },
  head: () => ({
    meta: [{
      title: "Login — Risk Sentinel"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./forgot-password-DmAr4ejV.mjs");
const Route$h = createFileRoute("/forgot-password")({
  beforeLoad: async () => {
    await hydrateAuth();
    if (isAuthenticated()) throw redirect({
      to: "/app/dashboard"
    });
  },
  head: () => ({
    meta: [{
      title: "Reset Password — Risk Sentinel"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./app-DWUHW10i.mjs");
const Route$g = createFileRoute("/app")({
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./admin-KB_qFIUC.mjs");
const Route$f = createFileRoute("/admin")({
  beforeLoad: async () => {
    await ensureSeeded();
    await hydrateAuth();
    adminStore.refresh();
  },
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./index-Ds5vknIu.mjs");
const Route$e = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "SME Risk Sentinel — Early Detection of Business Risks"
    }, {
      name: "description",
      content: "A rule-based decision support platform that helps SMEs detect financial, cybersecurity, compliance and operational risks early."
    }, {
      property: "og:title",
      content: "SME Risk Sentinel"
    }, {
      property: "og:description",
      content: "Detect SME business risks early with a clear, rule-based monitoring dashboard."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./app.reports-ytOdBTzl.mjs");
const Route$d = createFileRoute("/app/reports")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./app.profile-8kOOclRD.mjs");
const Route$c = createFileRoute("/app/profile")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./app.operational-62I50uFQ.mjs");
const Route$b = createFileRoute("/app/operational")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./app.history-yDv3JRQr.mjs");
const Route$a = createFileRoute("/app/history")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./app.financial-DVspxWIQ.mjs");
const Route$9 = createFileRoute("/app/financial")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./app.dashboard-CF-vsNRi.mjs");
const Route$8 = createFileRoute("/app/dashboard")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./app.cybersecurity-ClgQDVdZ.mjs");
const Route$7 = createFileRoute("/app/cybersecurity")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./app.compliance-Cifc4HbW.mjs");
const Route$6 = createFileRoute("/app/compliance")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./app.alerts-BojnLsE9.mjs");
const Route$5 = createFileRoute("/app/alerts")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./admin.smes-tOFGjRru.mjs");
const Route$4 = createFileRoute("/admin/smes")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./admin.risk-DptD6RC3.mjs");
const Route$3 = createFileRoute("/admin/risk")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./admin.reports-B5h0pxiq.mjs");
const Route$2 = createFileRoute("/admin/reports")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./admin.profile-B1aDZnLD.mjs");
const Route$1 = createFileRoute("/admin/profile")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./admin.dashboard-0dtthVRX.mjs");
const Route = createFileRoute("/admin/dashboard")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const RegisterRoute = Route$j.update({
  id: "/register",
  path: "/register",
  getParentRoute: () => Route$k
});
const LoginRoute = Route$i.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$k
});
const ForgotPasswordRoute = Route$h.update({
  id: "/forgot-password",
  path: "/forgot-password",
  getParentRoute: () => Route$k
});
const AppRoute = Route$g.update({
  id: "/app",
  path: "/app",
  getParentRoute: () => Route$k
});
const AdminRoute = Route$f.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$k
});
const IndexRoute = Route$e.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$k
});
const AppReportsRoute = Route$d.update({
  id: "/reports",
  path: "/reports",
  getParentRoute: () => AppRoute
});
const AppProfileRoute = Route$c.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => AppRoute
});
const AppOperationalRoute = Route$b.update({
  id: "/operational",
  path: "/operational",
  getParentRoute: () => AppRoute
});
const AppHistoryRoute = Route$a.update({
  id: "/history",
  path: "/history",
  getParentRoute: () => AppRoute
});
const AppFinancialRoute = Route$9.update({
  id: "/financial",
  path: "/financial",
  getParentRoute: () => AppRoute
});
const AppDashboardRoute = Route$8.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AppRoute
});
const AppCybersecurityRoute = Route$7.update({
  id: "/cybersecurity",
  path: "/cybersecurity",
  getParentRoute: () => AppRoute
});
const AppComplianceRoute = Route$6.update({
  id: "/compliance",
  path: "/compliance",
  getParentRoute: () => AppRoute
});
const AppAlertsRoute = Route$5.update({
  id: "/alerts",
  path: "/alerts",
  getParentRoute: () => AppRoute
});
const AdminSmesRoute = Route$4.update({
  id: "/smes",
  path: "/smes",
  getParentRoute: () => AdminRoute
});
const AdminRiskRoute = Route$3.update({
  id: "/risk",
  path: "/risk",
  getParentRoute: () => AdminRoute
});
const AdminReportsRoute = Route$2.update({
  id: "/reports",
  path: "/reports",
  getParentRoute: () => AdminRoute
});
const AdminProfileRoute = Route$1.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => AdminRoute
});
const AdminDashboardRoute = Route.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AdminRoute
});
const AdminRouteChildren = {
  AdminDashboardRoute,
  AdminProfileRoute,
  AdminReportsRoute,
  AdminRiskRoute,
  AdminSmesRoute
};
const AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
const AppRouteChildren = {
  AppAlertsRoute,
  AppComplianceRoute,
  AppCybersecurityRoute,
  AppDashboardRoute,
  AppFinancialRoute,
  AppHistoryRoute,
  AppOperationalRoute,
  AppProfileRoute,
  AppReportsRoute
};
const AppRouteWithChildren = AppRoute._addFileChildren(AppRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AdminRoute: AdminRouteWithChildren,
  AppRoute: AppRouteWithChildren,
  ForgotPasswordRoute,
  LoginRoute,
  RegisterRoute
};
const routeTree = Route$k._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const nonce = getGlobalStartContext()?.nonce;
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    ssr: nonce ? { nonce } : void 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  CYBER_THREAT_OPTIONS,
  EMAIL_ALREADY_EXISTS_ERROR,
  ORPHANED_PROFILE_ERROR,
  adminStore,
  alertStatusColor,
  assessCyberThreats,
  complianceRisk,
  consumePostLogoutLoginVisit,
  cyberRisk,
  ensureSeeded,
  financialRisk,
  getRecommendations,
  getThreatOption,
  hasAnyRiskData,
  hasComplianceData,
  hasCyberData,
  hasFinancialData,
  hasOperationalData,
  hydrateAuth,
  initAdminStoreSync,
  isSuperAdmin,
  normalizeEmail,
  operationalRisk,
  overallRisk,
  resolveEmailRegistrationConflict,
  riskAtDate,
  router,
  severityColor,
  store,
  useAdminStore,
  useStore
};
