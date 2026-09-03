import { vi } from "vitest";

export const getAuthBackendStatusFn = vi.fn(async () => ({ available: false as const }));

export const seedSuperAdminAccountFn = vi.fn(async () => ({
  ok: false as const,
  error: "Database not configured.",
}));

export const checkEmailAvailableFn = vi.fn(async () => ({
  available: true as const,
  conflict: null,
}));

export const registerAccountFn = vi.fn(async () => ({
  ok: false as const,
  error: "Database not configured.",
}));

export const loginAccountFn = vi.fn(async () => ({
  ok: false as const,
  error: "Database not configured.",
}));

export const resetAccountPasswordFn = vi.fn(async () => ({
  ok: false as const,
  error: "Database not configured.",
}));

export const changeAccountPasswordFn = vi.fn(async () => ({
  ok: false as const,
  error: "Database not configured.",
}));

export const updateAccountEmailFn = vi.fn(async () => ({
  ok: false as const,
  error: "Database not configured.",
}));

export const updateAccountStatusFn = vi.fn(async () => ({
  ok: false as const,
  error: "Database not configured.",
}));

export const listAccountsFn = vi.fn(async () => ({ accounts: [] }));

export const getAccountByIdFn = vi.fn(async () => ({ account: null }));

export const EMAIL_ALREADY_EXISTS_ERROR =
  "An account with this email already exists. Please sign in instead.";
