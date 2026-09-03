import { describe, expect, it, beforeEach } from "vitest";
import { adminStore } from "./admin-store";
import { registerUser, resetAuthModuleState, updateUserStatus } from "./auth";
import { type State } from "./risk-store";

function seedUserState(userId: string, state: Partial<State>) {
  localStorage.setItem(
    `srs:state:v1:${userId}`,
    JSON.stringify({
      profile: {
        businessName: "Acme Corp",
        ownerName: "Jane Doe",
        email: "sme@test.com",
        phone: "",
        businessType: "Retail",
        employees: 5,
        ...(state.profile ?? {}),
      },
      financial: state.financial ?? [],
      cyber: state.cyber ?? [],
      compliance: state.compliance ?? [],
      operational: state.operational ?? [],
      alerts: state.alerts ?? [],
    }),
  );
}

describe("admin-store dashboard metrics", () => {
  beforeEach(() => {
    resetAuthModuleState();
    localStorage.clear();
  });

  it("returns empty metrics when no SMEs exist", () => {
    const data = adminStore.getData();
    expect(data.metrics).toEqual({
      totalSmes: 0,
      activeSmes: 0,
      suspendedSmes: 0,
      highRiskSmes: 0,
      totalAlerts: 0,
      totalReports: 0,
    });
    expect(data.smes).toEqual([]);
    expect(data.riskDistribution).toEqual([
      { name: "Low", value: 0 },
      { name: "Medium", value: 0 },
      { name: "High", value: 0 },
    ]);
  });

  it("aggregates SME records after registration", async () => {
    await registerUser("sme1@test.com", "password1");
    adminStore.refresh();
    const data = adminStore.getData();
    expect(data.metrics.totalSmes).toBe(1);
    expect(data.metrics.activeSmes).toBe(1);
    expect(data.smes[0]?.email).toBe("sme1@test.com");
  });

  it("counts high-risk SMEs from stored monitoring data", async () => {
    const result = await registerUser("highrisk@test.com", "password1");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    seedUserState(result.userId, {
      financial: [{ id: "1", date: "2026-01-01", income: 1000, expenses: 2000, outstanding: 0 }],
      cyber: [
        {
          id: "1",
          date: "2026-01-01",
          passwordUpdated: false,
          antivirusActive: false,
          suspicious: true,
        },
      ],
      compliance: [
        {
          id: "1",
          date: "2026-01-01",
          taxDeadline: "2020-01-01",
          taxStatus: "overdue",
          licenseExpiry: "2020-06-01",
          licenseStatus: "expired",
        },
      ],
      operational: [
        {
          id: "1",
          date: "2026-01-01",
          staffPresent: 1,
          staffRequired: 5,
          equipment: "faulty",
          delivery: "delayed",
        },
      ],
    });
    adminStore.refresh();
    const data = adminStore.getData();
    expect(data.metrics.highRiskSmes).toBe(1);
    expect(data.metrics.totalReports).toBe(1);
    expect(data.smes[0]?.riskLevel).toBe("high");
    expect(data.riskDistribution).toEqual([
      { name: "Low", value: 0 },
      { name: "Medium", value: 0 },
      { name: "High", value: 1 },
    ]);
  });

  it("aggregates alert counts across SMEs", async () => {
    const user1 = await registerUser("alerts1@test.com", "password1");
    const user2 = await registerUser("alerts2@test.com", "password1");
    expect(user1.ok && user2.ok).toBe(true);
    if (!user1.ok || !user2.ok) return;

    seedUserState(user1.userId, {
      alerts: [
        {
          id: "a1",
          category: "financial",
          severity: "high",
          title: "Expenses exceed income",
          action: "Cut costs",
          date: "2026-06-01",
          status: "active",
        },
        {
          id: "a2",
          category: "cybersecurity",
          severity: "medium",
          title: "Passwords not updated",
          action: "Rotate passwords",
          date: "2026-06-02",
          status: "resolved",
        },
      ],
    });
    seedUserState(user2.userId, {
      alerts: [
        {
          id: "b1",
          category: "operational",
          severity: "medium",
          title: "Delivery delayed",
          action: "Notify customers",
          date: "2026-06-03",
          status: "active",
        },
      ],
    });

    adminStore.refresh();
    const data = adminStore.getData();
    expect(data.metrics.totalAlerts).toBe(3);
    expect(data.smes.find((s) => s.email === "alerts1@test.com")?.activeAlerts).toBe(1);
    expect(data.smes.find((s) => s.email === "alerts2@test.com")?.activeAlerts).toBe(1);
  });

  it("aggregates risk scores by category across SMEs", async () => {
    const lowRisk = await registerUser("low@test.com", "password1");
    const highRisk = await registerUser("high@test.com", "password1");
    expect(lowRisk.ok && highRisk.ok).toBe(true);
    if (!lowRisk.ok || !highRisk.ok) return;

    seedUserState(lowRisk.userId, {
      financial: [{ id: "1", date: "2026-01-01", income: 10_000, expenses: 5000, outstanding: 0 }],
      cyber: [
        {
          id: "1",
          date: "2026-01-01",
          passwordUpdated: true,
          antivirusActive: true,
          suspicious: false,
        },
      ],
    });
    seedUserState(highRisk.userId, {
      financial: [{ id: "1", date: "2026-01-01", income: 1000, expenses: 2000, outstanding: 0 }],
      cyber: [
        {
          id: "1",
          date: "2026-01-01",
          passwordUpdated: false,
          antivirusActive: false,
          suspicious: true,
        },
      ],
    });

    adminStore.refresh();
    const agg = adminStore.getData().riskAggregation;
    expect(agg.financial.high).toBe(1);
    expect(agg.financial.low).toBe(1);
    expect(agg.cybersecurity.high).toBe(1);
    expect(agg.cybersecurity.low).toBe(1);
    expect(agg.financial.avgScore).toBeGreaterThan(0);
    expect(agg.cybersecurity.avgScore).toBeGreaterThan(agg.financial.avgScore - 100);
  });

  it("tracks suspended SME account status", async () => {
    const result = await registerUser("suspended@test.com", "password1");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    await updateUserStatus(result.userId, "suspended");
    adminStore.refresh();
    const data = adminStore.getData();
    expect(data.metrics.suspendedSmes).toBe(1);
    expect(data.metrics.activeSmes).toBe(0);
    expect(data.smes[0]?.accountStatus).toBe("suspended");
  });

  it("builds category distribution from business types", async () => {
    const retail = await registerUser("retail@test.com", "password1");
    const food1 = await registerUser("food1@test.com", "password1");
    const food2 = await registerUser("food2@test.com", "password1");
    expect(retail.ok && food1.ok && food2.ok).toBe(true);
    if (!retail.ok || !food1.ok || !food2.ok) return;

    seedUserState(retail.userId, { profile: { businessType: "Retail" } as State["profile"] });
    seedUserState(food1.userId, { profile: { businessType: "Food" } as State["profile"] });
    seedUserState(food2.userId, { profile: { businessType: "Food" } as State["profile"] });

    adminStore.refresh();
    const distribution = adminStore.getData().categoryDistribution;
    expect(distribution).toContainEqual({ name: "Retail", value: 1 });
    expect(distribution).toContainEqual({ name: "Food", value: 2 });
  });

  it("getSmeDetails returns user and persisted state", async () => {
    const result = await registerUser("details@test.com", "password1");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const { user, state } = adminStore.getSmeDetails(result.userId);
    expect(user?.email).toBe("details@test.com");
    expect(state).toBeNull();

    seedUserState(result.userId, {
      profile: {
        businessName: "Acme",
        ownerName: "Jane",
        email: "details@test.com",
        phone: "",
        businessType: "Retail",
        employees: 3,
      },
    });
    adminStore.refresh();
    const loaded = adminStore.getSmeDetails(result.userId);
    expect(loaded.state?.profile.businessName).toBe("Acme");
  });
});
