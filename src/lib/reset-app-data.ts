import { JWT_STORAGE_KEY, LEGACY_SESSION_KEY } from "./auth/jwt.shared";
import {
  clearSession,
  resetAuthModuleState,
  resetAllUserAccountsAndReseedSuperAdmin,
  SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_PASSWORD,
} from "./auth";
import { resetStoreAfterDataWipe } from "./risk-store";
import { adminStore } from "./admin-store";

/** Auth account store (v1). */
export const USERS_STORAGE_KEY = "srs:users:v1";
/** Legacy auth account store — merged into v1 on load. */
export const LEGACY_USERS_STORAGE_KEY = "srs:users";
/** SME profile + risk data key prefix (`srs:state:v1:{userId}`). */
export const STATE_STORAGE_PREFIX = "srs:state:v1:";
/** Optional auth diagnostics flag — not cleared by reset. */
export const AUTH_DEBUG_STORAGE_KEY = "srs:debug:auth";

export type ResetApplicationDataResult = {
  removedAccounts: number;
  removedStateKeys: number;
  superAdminReseeded: boolean;
  clearedKeys: string[];
};

/**
 * Wipe all accounts (SME owners and portal operator), SME profile/risk data, and sessions.
 * Re-seeds the default portal operator so login remains possible with seeded credentials.
 */
export async function resetAllApplicationData(): Promise<ResetApplicationDataResult> {
  if (typeof window === "undefined") {
    return {
      removedAccounts: 0,
      removedStateKeys: 0,
      superAdminReseeded: false,
      clearedKeys: [],
    };
  }

  const clearedKeys: string[] = [];
  let removedAccounts = 0;

  try {
    const rawUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (rawUsers) {
      removedAccounts = (JSON.parse(rawUsers) as unknown[]).length;
    }
  } catch {
    /* ignore malformed store */
  }

  const stateKeys: string[] = [];
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
    localStorage.getItem(USERS_STORAGE_KEY)?.includes(SUPER_ADMIN_EMAIL),
  );

  resetStoreAfterDataWipe();
  adminStore.refresh();

  if (!clearedKeys.includes(USERS_STORAGE_KEY)) {
    clearedKeys.push(
      `${USERS_STORAGE_KEY} (all accounts wiped; default super admin re-seeded: ${SUPER_ADMIN_EMAIL} / ${SUPER_ADMIN_PASSWORD})`,
    );
  }

  return {
    removedAccounts,
    removedStateKeys: stateKeys.length,
    superAdminReseeded,
    clearedKeys,
  };
}

declare global {
  interface Window {
    /** Dev/console helper: `await window.__resetAppData?.()` */
    __resetAppData?: () => Promise<ResetApplicationDataResult>;
  }
}

export function exposeResetOnWindow(): void {
  if (typeof window === "undefined") return;
  window.__resetAppData = resetAllApplicationData;
}
