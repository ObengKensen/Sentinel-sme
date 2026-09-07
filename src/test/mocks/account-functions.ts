import { vi } from "vitest";

import { createMockToken } from "./auth-functions";
import {
  emptyMockState,
  findMockAccountByEmail,
  findMockAccountById,
  listMockAccounts,
  publicMockAccount,
  setMockRiskState,
  upsertMockAccount,
  type MockAccount,
} from "./memory-db";

export const EMAIL_ALREADY_EXISTS_ERROR =
  "An account with this email already exists. Please sign in instead.";

const SUPER_ADMIN_EMAIL = "admin@smerisksentinel.com";
const SUPER_ADMIN_PASSWORD = "SuperAdmin2024!";

function unwrap<T>(input: { data: T } | T): T {
  return input && typeof input === "object" && "data" in input ? input.data : input;
}

function sessionFor(account: MockAccount) {
  return {
    ok: true as const,
    token: createMockToken({ userId: account.id, email: account.email, role: account.role }),
    userId: account.id,
    email: account.email,
    role: account.role,
    status: account.status,
    createdAt: account.createdAt,
    profile:
      account.role === "SME_OWNER"
        ? {
            businessName: account.businessName,
            ownerName: account.ownerName,
            email: account.email,
            phone: account.phone,
            businessType: account.businessType,
            employees: account.employees,
          }
        : null,
  };
}

export const getAuthBackendStatusFn = vi.fn(async () => ({
  available: true as const,
  mode: "postgres" as const,
}));

export const seedSuperAdminAccountFn = vi.fn(async () => {
  if (findMockAccountByEmail(SUPER_ADMIN_EMAIL)) {
    return { ok: true as const, seeded: false as const };
  }
  upsertMockAccount({
    id: crypto.randomUUID(),
    email: SUPER_ADMIN_EMAIL,
    password: SUPER_ADMIN_PASSWORD,
    role: "SUPER_ADMIN",
    status: "active",
    createdAt: new Date().toISOString(),
    businessName: "",
    ownerName: "",
    phone: "",
    businessType: "",
    employees: 0,
  });
  return { ok: true as const, seeded: true as const };
});

export const checkEmailAvailableFn = vi.fn(async (input: { data: { email: string } }) => {
  const { email } = unwrap(input);
  if (findMockAccountByEmail(email)) {
    return { available: false as const, conflict: "exists" as const };
  }
  return { available: true as const, conflict: null };
});

export const registerAccountFn = vi.fn(
  async (input: {
    data: {
      email: string;
      password: string;
      businessName: string;
      ownerName: string;
      phone?: string;
      businessType: string;
      employees: number;
    };
  }) => {
    const data = unwrap(input);
    const email = data.email.trim().toLowerCase();
    if (findMockAccountByEmail(email)) {
      return { ok: false as const, error: EMAIL_ALREADY_EXISTS_ERROR };
    }
    const account: MockAccount = {
      id: crypto.randomUUID(),
      email,
      password: data.password,
      role: "SME_OWNER",
      status: "active",
      createdAt: new Date().toISOString(),
      businessName: data.businessName.trim(),
      ownerName: data.ownerName.trim(),
      phone: data.phone?.trim() || "",
      businessType: data.businessType,
      employees: data.employees,
    };
    upsertMockAccount(account);
    setMockRiskState(
      account.id,
      emptyMockState({
        businessName: account.businessName,
        ownerName: account.ownerName,
        email: account.email,
        phone: account.phone,
        businessType: account.businessType,
        employees: account.employees,
      }),
    );
    return sessionFor(account);
  },
);

export const loginAccountFn = vi.fn(async (input: { data: { email: string; password: string } }) => {
  const { email, password } = unwrap(input);
  const account = findMockAccountByEmail(email);
  if (!account) return { ok: false as const, error: "Invalid email or password." };
  if (account.status === "suspended") {
    return {
      ok: false as const,
      error: "Your account has been suspended. Please contact support.",
    };
  }
  if (account.password !== password) {
    return { ok: false as const, error: "Invalid email or password." };
  }
  return sessionFor(account);
});

export const resetAccountPasswordFn = vi.fn(
  async (input: { data: { email: string; newPassword: string } }) => {
    const { email, newPassword } = unwrap(input);
    const account = findMockAccountByEmail(email);
    if (!account) return { ok: false as const, error: "No account found with that email." };
    account.password = newPassword;
    upsertMockAccount(account);
    return { ok: true as const, userId: account.id, email: account.email, role: account.role };
  },
);

export const changeAccountPasswordFn = vi.fn(
  async (input: { data: { userId: string; currentPassword: string; newPassword: string } }) => {
    const { userId, currentPassword, newPassword } = unwrap(input);
    const account = findMockAccountById(userId);
    if (!account) return { ok: false as const, error: "Account not found." };
    if (account.password !== currentPassword) {
      return { ok: false as const, error: "Current password is incorrect." };
    }
    account.password = newPassword;
    upsertMockAccount(account);
    return { ok: true as const, userId: account.id, email: account.email, role: account.role };
  },
);

export const updateAccountEmailFn = vi.fn(
  async (input: { data: { userId: string; email: string } }) => {
    const { userId, email } = unwrap(input);
    const account = findMockAccountById(userId);
    if (!account) return { ok: false as const, error: "Account not found." };
    const clash = findMockAccountByEmail(email);
    if (clash && clash.id !== userId) {
      return { ok: false as const, error: "That email is already in use." };
    }
    account.email = email.trim().toLowerCase();
    upsertMockAccount(account);
    return { ok: true as const, userId: account.id, email: account.email, role: account.role };
  },
);

export const updateAccountStatusFn = vi.fn(
  async (input: { data: { userId: string; status: "active" | "suspended" } }) => {
    const { userId, status } = unwrap(input);
    const account = findMockAccountById(userId);
    if (!account) return { ok: false as const, error: "Account not found." };
    if (account.role === "SUPER_ADMIN") {
      return { ok: false as const, error: "Cannot change super admin status." };
    }
    account.status = status;
    upsertMockAccount(account);
    return { ok: true as const, userId: account.id, email: account.email, role: account.role };
  },
);

export const listAccountsFn = vi.fn(async () => ({
  accounts: listMockAccounts().map(publicMockAccount),
}));

export const getAccountByIdFn = vi.fn(async (input: { data: { userId: string } }) => {
  const { userId } = unwrap(input);
  const account = findMockAccountById(userId);
  return { account: account ? publicMockAccount(account) : null };
});
