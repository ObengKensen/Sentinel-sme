import { vi } from "vitest";

export const loadRiskStateFn = vi.fn(async () => ({ state: null }));
export const loadAllSmeRiskStatesFn = vi.fn(async () => ({ states: {} }));
export const saveRiskStateFn = vi.fn(async () => ({
  ok: false as const,
  error: "Database not configured.",
  state: null,
}));
