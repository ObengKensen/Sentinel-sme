import type { UserRole } from "@/lib/auth/jwt.shared";
import type { PersistedRiskState } from "@/lib/api/risk-data.functions";

export type MockAccount = {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  status: "active" | "suspended";
  createdAt: string;
  businessName: string;
  ownerName: string;
  phone: string;
  businessType: string;
  employees: number;
};

const accounts = new Map<string, MockAccount>();
const states = new Map<string, PersistedRiskState>();

export function resetMemoryDb() {
  accounts.clear();
  states.clear();
}

export function listMockAccounts() {
  return [...accounts.values()];
}

export function findMockAccountByEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  return [...accounts.values()].find((account) => account.email === normalized);
}

export function findMockAccountById(userId: string) {
  return accounts.get(userId) ?? null;
}

export function upsertMockAccount(account: MockAccount) {
  accounts.set(account.id, account);
}

export function deleteMockAccount(userId: string) {
  accounts.delete(userId);
  states.delete(userId);
}

export function emptyMockState(profile: PersistedRiskState["profile"]): PersistedRiskState {
  return {
    profile,
    financial: [],
    cyber: [],
    compliance: [],
    operational: [],
    alerts: [],
  };
}

export function getMockRiskState(userId: string) {
  return states.get(userId) ?? null;
}

export function setMockRiskState(userId: string, state: PersistedRiskState) {
  states.set(userId, state);
}

export function getAllMockRiskStates() {
  return Object.fromEntries(states.entries()) as Record<string, PersistedRiskState>;
}

export function publicMockAccount(account: MockAccount) {
  return {
    id: account.id,
    email: account.email,
    role: account.role,
    status: account.status,
    createdAt: account.createdAt,
    businessName: account.businessName,
    ownerName: account.ownerName,
    phone: account.phone,
    businessType: account.businessType,
    employees: account.employees,
  };
}
