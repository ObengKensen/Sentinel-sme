import {
  loadAllSmeRiskStatesFn,
  loadRiskStateFn,
  saveRiskStateFn,
  type PersistedRiskState,
} from "./api/risk-data.functions";
import { isRemoteAuthEnabled } from "./remote-auth";

export type { PersistedRiskState };

export async function loadRemoteRiskState(userId: string): Promise<PersistedRiskState | null> {
  if (!(await isRemoteAuthEnabled())) return null;
  try {
    const result = await loadRiskStateFn({ data: { userId } });
    return result.state;
  } catch (error) {
    console.error("[risk] load remote failed:", error);
    return null;
  }
}

export async function loadAllRemoteRiskStates(): Promise<Record<string, PersistedRiskState>> {
  if (!(await isRemoteAuthEnabled())) return {};
  try {
    const result = await loadAllSmeRiskStatesFn();
    return result.states;
  } catch (error) {
    console.error("[risk] load all remote failed:", error);
    return {};
  }
}

export async function saveRemoteRiskState(
  userId: string,
  state: PersistedRiskState,
): Promise<PersistedRiskState | null> {
  if (!(await isRemoteAuthEnabled())) return null;
  try {
    const result = await saveRiskStateFn({ data: { userId, state } });
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

export function stateHasMonitoringData(state: PersistedRiskState | null | undefined): boolean {
  if (!state) return false;
  return (
    state.financial.length > 0 ||
    state.cyber.length > 0 ||
    state.compliance.length > 0 ||
    state.operational.length > 0 ||
    state.alerts.length > 0
  );
}
