export const loadRiskStateFn = async () => ({ state: null });
export const loadAllSmeRiskStatesFn = async () => ({ states: {} });
export const saveRiskStateFn = async () => ({
  ok: false as const,
  error: "Database not configured.",
  state: null,
});
