import { vi } from "vitest";

import type { PersistedRiskState } from "@/lib/api/risk-data.functions";

import {
  findMockAccountById,
  getAllMockRiskStates,
  getMockRiskState,
  setMockRiskState,
  upsertMockAccount,
} from "./memory-db";

function unwrap<T>(input: { data: T } | T): T {
  return input && typeof input === "object" && "data" in input ? input.data : input;
}

export const loadRiskStateFn = vi.fn(async (input: { data: { userId: string } }) => ({
  state: getMockRiskState(unwrap(input).userId),
}));

export const loadAllSmeRiskStatesFn = vi.fn(async () => ({
  states: getAllMockRiskStates(),
}));

export const saveRiskStateFn = vi.fn(
  async (input: { data: { userId: string; state: PersistedRiskState } }) => {
    const { userId, state } = unwrap(input);
    setMockRiskState(userId, state);
    const account = findMockAccountById(userId);
    if (account) {
      account.businessName = state.profile.businessName;
      account.ownerName = state.profile.ownerName;
      account.phone = state.profile.phone;
      account.businessType = state.profile.businessType;
      account.employees = state.profile.employees;
      upsertMockAccount(account);
    }
    return { ok: true as const, state };
  },
);
