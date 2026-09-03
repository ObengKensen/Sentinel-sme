import {
  checkEmailAvailableFn,
  changeAccountPasswordFn,
  getAuthBackendStatusFn,
  getAccountByIdFn,
  listAccountsFn,
  loginAccountFn,
  registerAccountFn,
  resetAccountPasswordFn,
  seedSuperAdminAccountFn,
  updateAccountEmailFn,
  updateAccountStatusFn,
} from "./api/account.functions";
import { sessionFromToken, type UserRole } from "./auth/jwt.shared";

export type UserStatus = "active" | "suspended";

export type AuthResult =
  | { ok: true; userId: string; email: string; role: UserRole }
  | { ok: false; error: string };

export type RemoteProfile = {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  businessType: string;
  employees: number;
};

export type RemoteAuthSuccess = {
  ok: true;
  token: string;
  userId: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  profile: RemoteProfile | null;
};

export type DirectoryAccount = {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
  role: UserRole;
  status: UserStatus;
};

let remoteEnabledCache: boolean | null = null;

/** Reset cached backend detection (tests / full wipe). */
export function resetRemoteAuthCache() {
  remoteEnabledCache = null;
}

export async function isRemoteAuthEnabled(): Promise<boolean> {
  if (remoteEnabledCache !== null) return remoteEnabledCache;
  try {
    const status = await getAuthBackendStatusFn();
    remoteEnabledCache = status.available;
  } catch {
    remoteEnabledCache = false;
  }
  return remoteEnabledCache;
}

export async function seedRemoteSuperAdmin(): Promise<boolean> {
  if (!(await isRemoteAuthEnabled())) return false;
  const result = await seedSuperAdminAccountFn();
  return result.ok;
}

export async function checkRemoteEmailConflict(email: string): Promise<"exists" | null> {
  if (!(await isRemoteAuthEnabled())) return null;
  const result = await checkEmailAvailableFn({ data: { email } });
  return result.conflict;
}

export async function remoteRegister(input: {
  email: string;
  password: string;
  businessName: string;
  ownerName: string;
  phone?: string;
  businessType: string;
  employees: number;
}): Promise<RemoteAuthSuccess | AuthResult> {
  if (!(await isRemoteAuthEnabled())) {
    return { ok: false, error: "Database not configured." };
  }
  return registerAccountFn({ data: input });
}

export async function remoteLogin(
  email: string,
  password: string,
): Promise<RemoteAuthSuccess | AuthResult> {
  if (!(await isRemoteAuthEnabled())) {
    return { ok: false, error: "Database not configured." };
  }
  return loginAccountFn({ data: { email, password } });
}

export async function remoteResetPassword(email: string, newPassword: string): Promise<AuthResult> {
  if (!(await isRemoteAuthEnabled())) {
    return { ok: false, error: "Database not configured." };
  }
  return resetAccountPasswordFn({ data: { email, newPassword } });
}

export async function remoteChangePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<AuthResult> {
  if (!(await isRemoteAuthEnabled())) {
    return { ok: false, error: "Database not configured." };
  }
  return changeAccountPasswordFn({ data: { userId, currentPassword, newPassword } });
}

export async function remoteUpdateEmail(userId: string, email: string): Promise<AuthResult> {
  if (!(await isRemoteAuthEnabled())) {
    return { ok: false, error: "Database not configured." };
  }
  return updateAccountEmailFn({ data: { userId, email } });
}

export async function remoteUpdateStatus(userId: string, status: UserStatus): Promise<AuthResult> {
  if (!(await isRemoteAuthEnabled())) {
    return { ok: false, error: "Database not configured." };
  }
  return updateAccountStatusFn({ data: { userId, status } });
}

export async function fetchRemoteAccounts() {
  if (!(await isRemoteAuthEnabled())) return [];
  const result = await listAccountsFn();
  return result.accounts;
}

export async function fetchRemoteAccount(userId: string) {
  if (!(await isRemoteAuthEnabled())) return null;
  const result = await getAccountByIdFn({ data: { userId } });
  return result.account;
}

export function directoryRowFromRemote(account: {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}): DirectoryAccount {
  return {
    id: account.id,
    email: account.email,
    passwordHash: "",
    salt: "",
    createdAt: account.createdAt,
    role: account.role,
    status: account.status,
  };
}

export function readTokenSession(token: string) {
  return sessionFromToken(token);
}
