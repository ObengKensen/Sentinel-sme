import { describe, expect, it, beforeEach } from "vitest";
import {
  financialRisk,
  cyberRisk,
  complianceRisk,
  operationalRisk,
  overallRisk,
  getRecommendations,
  hasFinancialData,
  hasCyberData,
  hasComplianceData,
  hasOperationalData,
  hasAnyRiskData,
  riskAtDate,
  riskLevelFromScore,
  RISK_SCORE_HIGH_THRESHOLD,
  RISK_SCORE_MEDIUM_THRESHOLD,
  store,
  resetStoreAfterDataWipe,
  type State,
} from "./risk-store";
import { resetAuthModuleState, registerUser, clearSession, EMAIL_ALREADY_EXISTS_ERROR, ORPHANED_PROFILE_ERROR } from "./auth";

const emptyState = (): State => ({
  profile: {
    businessName: "Test Co",
    ownerName: "Owner",
    email: "test@example.com",
    phone: "",
    businessType: "Retail",
    employees: 5,
  },
  financial: [],
  cyber: [],
  compliance: [],
  operational: [],
  alerts: [],
});

const FIXED_NOW = new Date(2026, 5, 15, 12, 0, 0).getTime();

describe("riskLevelFromScore boundaries", () => {
  it("maps scores below medium threshold to low", () => {
    expect(riskLevelFromScore(0)).toBe("low");
    expect(riskLevelFromScore(RISK_SCORE_MEDIUM_THRESHOLD - 1)).toBe("low");
  });

  it("maps scores at medium threshold to medium", () => {
    expect(riskLevelFromScore(RISK_SCORE_MEDIUM_THRESHOLD)).toBe("medium");
    expect(riskLevelFromScore(RISK_SCORE_HIGH_THRESHOLD - 1)).toBe("medium");
  });

  it("maps scores at high threshold to high", () => {
    expect(riskLevelFromScore(RISK_SCORE_HIGH_THRESHOLD)).toBe("high");
    expect(riskLevelFromScore(100)).toBe("high");
  });
});

describe("financialRisk", () => {
  it("returns default low score when no entries exist", () => {
    const risk = financialRisk(emptyState());
    expect(risk).toEqual({ level: "low", score: 10, label: "Low Risk" });
  });

  it("uses only the latest financial entry", () => {
    const s = {
      ...emptyState(),
      financial: [
        { id: "1", date: "2026-01-01", income: 1000, expenses: 2000, outstanding: 0 },
        { id: "2", date: "2026-06-01", income: 10_000, expenses: 5000, outstanding: 0 },
      ],
    };
    expect(financialRisk(s).level).toBe("low");
    expect(financialRisk(s).score).toBe(15);
  });

  it("scores high when expenses exceed income", () => {
    const s = {
      ...emptyState(),
      financial: [{ id: "1", date: "2026-01-01", income: 1000, expenses: 1500, outstanding: 0 }],
    };
    expect(financialRisk(s)).toMatchObject({ level: "high", score: 90, label: "High Risk" });
  });

  it("scores medium for low profit margin below 10%", () => {
    const s = {
      ...emptyState(),
      financial: [{ id: "1", date: "2026-01-01", income: 1000, expenses: 950, outstanding: 0 }],
    };
    expect(financialRisk(s)).toMatchObject({ level: "medium", score: 60 });
  });

  it("scores medium when outstanding exceeds 20% of income", () => {
    const s = {
      ...emptyState(),
      financial: [{ id: "1", date: "2026-01-01", income: 1000, expenses: 500, outstanding: 250 }],
    };
    expect(financialRisk(s).score).toBe(55);
    expect(financialRisk(s).level).toBe("medium");
  });

  it("scores high when outstanding exceeds 40% of income", () => {
    const s = {
      ...emptyState(),
      financial: [{ id: "1", date: "2026-01-01", income: 1000, expenses: 500, outstanding: 500 }],
    };
    expect(financialRisk(s).score).toBe(80);
    expect(financialRisk(s).level).toBe("high");
  });

  it("combines expense and outstanding factors using max score", () => {
    const s = {
      ...emptyState(),
      financial: [{ id: "1", date: "2026-01-01", income: 1000, expenses: 1100, outstanding: 500 }],
    };
    expect(financialRisk(s).score).toBe(90);
  });
});

describe("cyberRisk", () => {
  it("returns default low score when no entries exist", () => {
    expect(cyberRisk(emptyState())).toMatchObject({ level: "low", score: 10 });
  });

  it("scores high when antivirus is inactive", () => {
    const s = {
      ...emptyState(),
      cyber: [
        {
          id: "1",
          date: "2026-01-01",
          passwordUpdated: true,
          antivirusActive: false,
          suspicious: false,
        },
      ],
    };
    expect(cyberRisk(s)).toMatchObject({ level: "high", score: 90 });
  });

  it("scores high when suspicious activity is reported", () => {
    const s = {
      ...emptyState(),
      cyber: [
        {
          id: "1",
          date: "2026-01-01",
          passwordUpdated: true,
          antivirusActive: true,
          suspicious: true,
        },
      ],
    };
    expect(cyberRisk(s).score).toBe(88);
    expect(cyberRisk(s).level).toBe("high");
  });

  it("scores medium when passwords are not updated", () => {
    const s = {
      ...emptyState(),
      cyber: [
        {
          id: "1",
          date: "2026-01-01",
          passwordUpdated: false,
          antivirusActive: true,
          suspicious: false,
        },
      ],
    };
    expect(cyberRisk(s)).toMatchObject({ level: "medium", score: 55 });
  });

  it("uses max score when multiple cyber issues exist", () => {
    const s = {
      ...emptyState(),
      cyber: [
        {
          id: "1",
          date: "2026-01-01",
          passwordUpdated: false,
          antivirusActive: false,
          suspicious: true,
        },
      ],
    };
    expect(cyberRisk(s).score).toBe(90);
  });
});

describe("complianceRisk", () => {
  it("returns default low score when no entries exist", () => {
    expect(complianceRisk(emptyState(), FIXED_NOW)).toMatchObject({ level: "low", score: 10 });
  });

  it("scores high for overdue tax deadline", () => {
    const s = {
      ...emptyState(),
      compliance: [
        {
          id: "1",
          date: "2026-01-01",
          taxDeadline: "2020-01-01",
          taxStatus: "pending",
          licenseExpiry: "2030-01-01",
          licenseStatus: "valid",
        },
      ],
    };
    expect(complianceRisk(s, FIXED_NOW)).toMatchObject({ level: "high", score: 90 });
  });

  it("scores medium when tax deadline is within 7 days", () => {
    const s = {
      ...emptyState(),
      compliance: [
        {
          id: "1",
          date: "2026-01-01",
          taxDeadline: "2026-06-20",
          taxStatus: "pending",
          licenseExpiry: "2030-01-01",
          licenseStatus: "valid",
        },
      ],
    };
    expect(complianceRisk(s, FIXED_NOW)).toMatchObject({ level: "medium", score: 60 });
  });

  it("scores high when license is expired", () => {
    const s = {
      ...emptyState(),
      compliance: [
        {
          id: "1",
          date: "2026-01-01",
          taxDeadline: "2030-01-01",
          taxStatus: "valid",
          licenseExpiry: "2026-01-01",
          licenseStatus: "expired",
        },
      ],
    };
    expect(complianceRisk(s, FIXED_NOW)).toMatchObject({ level: "high", score: 90 });
  });

  it("scores medium when license expires within 7 days", () => {
    const s = {
      ...emptyState(),
      compliance: [
        {
          id: "1",
          date: "2026-01-01",
          taxDeadline: "2030-01-01",
          taxStatus: "valid",
          licenseExpiry: "2026-06-18",
          licenseStatus: "valid",
        },
      ],
    };
    expect(complianceRisk(s, FIXED_NOW)).toMatchObject({ level: "medium", score: 60 });
  });
});

describe("operationalRisk", () => {
  it("returns default low score when no entries exist", () => {
    expect(operationalRisk(emptyState())).toMatchObject({ level: "low", score: 10 });
  });

  it("scores medium for understaffing", () => {
    const s = {
      ...emptyState(),
      operational: [
        {
          id: "1",
          date: "2026-01-01",
          staffPresent: 1,
          staffRequired: 5,
          equipment: "working" as const,
          delivery: "on-schedule" as const,
        },
      ],
    };
    expect(operationalRisk(s)).toMatchObject({ level: "medium", score: 55 });
  });

  it("scores medium for faulty equipment", () => {
    const s = {
      ...emptyState(),
      operational: [
        {
          id: "1",
          date: "2026-01-01",
          staffPresent: 5,
          staffRequired: 5,
          equipment: "faulty" as const,
          delivery: "on-schedule" as const,
        },
      ],
    };
    expect(operationalRisk(s).score).toBe(60);
  });

  it("scores medium for delayed delivery", () => {
    const s = {
      ...emptyState(),
      operational: [
        {
          id: "1",
          date: "2026-01-01",
          staffPresent: 5,
          staffRequired: 5,
          equipment: "working" as const,
          delivery: "delayed" as const,
        },
      ],
    };
    expect(operationalRisk(s).score).toBe(55);
  });

  it("uses max score when multiple operational issues exist", () => {
    const s = {
      ...emptyState(),
      operational: [
        {
          id: "1",
          date: "2026-01-01",
          staffPresent: 1,
          staffRequired: 5,
          equipment: "faulty" as const,
          delivery: "delayed" as const,
        },
      ],
    };
    expect(operationalRisk(s).score).toBe(60);
  });
});

describe("overallRisk", () => {
  it("averages category scores across all four domains", () => {
    const s = {
      ...emptyState(),
      financial: [{ id: "1", date: "2026-01-01", income: 1000, expenses: 1500, outstanding: 0 }],
      cyber: [
        {
          id: "1",
          date: "2026-01-01",
          passwordUpdated: true,
          antivirusActive: true,
          suspicious: false,
        },
      ],
      compliance: [
        {
          id: "1",
          date: "2026-01-01",
          taxDeadline: "2030-01-01",
          taxStatus: "valid",
          licenseExpiry: "2030-01-01",
          licenseStatus: "valid",
        },
      ],
      operational: [
        {
          id: "1",
          date: "2026-01-01",
          staffPresent: 5,
          staffRequired: 5,
          equipment: "working" as const,
          delivery: "on-schedule" as const,
        },
      ],
    };
    const expected = Math.round((90 + 15 + 15 + 15) / 4);
    expect(overallRisk(s, FIXED_NOW).score).toBe(expected);
  });

  it("returns low overall risk when all categories are empty", () => {
    expect(overallRisk(emptyState(), FIXED_NOW)).toMatchObject({ level: "low", score: 10 });
  });
});

describe("getRecommendations", () => {
  it("prioritizes active alerts over category risk hints", () => {
    const s = {
      ...emptyState(),
      alerts: [
        {
          id: "a1",
          category: "financial" as const,
          severity: "high" as const,
          title: "Expenses exceed income",
          action: "Cut costs",
          date: "2026-01-01",
          status: "active" as const,
        },
      ],
      financial: [{ id: "1", date: "2026-01-01", income: 100, expenses: 200, outstanding: 0 }],
    };
    const recs = getRecommendations(s);
    expect(recs[0]?.title).toBe("Expenses exceed income");
  });

  it("ignores resolved alerts", () => {
    const s = {
      ...emptyState(),
      alerts: [
        {
          id: "a1",
          category: "financial" as const,
          severity: "high" as const,
          title: "Expenses exceed income",
          action: "Cut costs",
          date: "2026-01-01",
          status: "resolved" as const,
        },
      ],
    };
    const recs = getRecommendations(s);
    expect(recs.some((r) => r.title === "Expenses exceed income")).toBe(false);
  });

  it("respects the limit parameter", () => {
    const s = {
      ...emptyState(),
      alerts: Array.from({ length: 10 }, (_, i) => ({
        id: `a${i}`,
        category: "financial" as const,
        severity: "medium" as const,
        title: `Alert ${i}`,
        action: "Act",
        date: "2026-01-01",
        status: "active" as const,
      })),
    };
    expect(getRecommendations(s, 3)).toHaveLength(3);
  });
});

describe("riskAtDate", () => {
  it("filters entries by date for historical risk", () => {
    const s = {
      ...emptyState(),
      financial: [
        { id: "1", date: "2026-01-01", income: 1000, expenses: 500, outstanding: 0 },
        { id: "2", date: "2026-06-01", income: 1000, expenses: 2000, outstanding: 0 },
      ],
    };
    expect(riskAtDate(s, "2026-03-01", "financial").level).not.toBe("high");
    expect(riskAtDate(s, "2026-12-01", "financial").level).toBe("high");
  });
});

describe("has*Data helpers", () => {
  it("reflect entry presence per category", () => {
    const s = emptyState();
    expect(hasFinancialData(s)).toBe(false);
    expect(hasAnyRiskData(s)).toBe(false);
    s.financial.push({ id: "1", date: "2026-01-01", income: 100, expenses: 50, outstanding: 0 });
    expect(hasFinancialData(s)).toBe(true);
    expect(hasAnyRiskData(s)).toBe(true);
    expect(hasCyberData(s)).toBe(false);
    expect(hasComplianceData(s)).toBe(false);
    expect(hasOperationalData(s)).toBe(false);
  });
});

describe("risk-store alert integration", () => {
  beforeEach(async () => {
    resetAuthModuleState();
    resetStoreAfterDataWipe();
    localStorage.clear();
    await registerUser("alerts@test.com", "password1");
    await store.authenticate("alerts@test.com", "password1");
  });

  it("creates financial alerts with correct severity", () => {
    store.addFinancial({ income: 1000, expenses: 2000, outstanding: 500 });
    const alerts = store.getState().alerts;
    expect(alerts.find((a) => a.title === "Expenses exceed income")?.severity).toBe("high");
    expect(alerts.find((a) => a.title === "Outstanding payments above threshold")?.severity).toBe(
      "high",
    );
  });

  it("creates cyber alerts for each failing check", () => {
    store.addCyber({ passwordUpdated: false, antivirusActive: false, suspicious: true });
    const titles = store.getState().alerts.map((a) => a.title);
    expect(titles).toContain("Antivirus inactive");
    expect(titles).toContain("Suspicious activity reported");
    expect(titles).toContain("Passwords not updated");
  });

  it("creates compliance alerts for overdue tax and license", () => {
    store.addCompliance({
      taxDeadline: "2020-01-01",
      taxStatus: "overdue",
      licenseExpiry: "2020-06-01",
      licenseStatus: "expired",
    });
    const titles = store.getState().alerts.map((a) => a.title);
    expect(titles).toContain("Tax deadline passed");
    expect(titles).toContain("Business license expired");
  });

  it("creates operational alerts for staffing, equipment, and delivery", () => {
    store.addOperational({
      staffPresent: 1,
      staffRequired: 5,
      equipment: "faulty",
      delivery: "delayed",
    });
    const titles = store.getState().alerts.map((a) => a.title);
    expect(titles).toContain("Low staff availability");
    expect(titles).toContain("Faulty equipment reported");
    expect(titles).toContain("Delivery delayed");
  });

  it("deduplicates active alerts with the same category and title", () => {
    store.addFinancial({ income: 1000, expenses: 2000, outstanding: 0 });
    const countAfterFirst = store.getState().alerts.filter(
      (a) => a.title === "Expenses exceed income",
    ).length;
    store.addFinancial({ income: 1000, expenses: 2500, outstanding: 0 });
    const countAfterSecond = store.getState().alerts.filter(
      (a) => a.title === "Expenses exceed income",
    ).length;
    expect(countAfterFirst).toBe(1);
    expect(countAfterSecond).toBe(1);
  });

  it("reopens resolved alerts when the same condition recurs", () => {
    store.addFinancial({ income: 1000, expenses: 2000, outstanding: 0 });
    const alert = store.getState().alerts.find((a) => a.title === "Expenses exceed income");
    expect(alert).toBeDefined();
    store.resolveAlert(alert!.id);
    expect(
      store.getState().alerts.find((a) => a.id === alert!.id)?.status,
    ).toBe("resolved");
    store.addFinancial({ income: 1000, expenses: 3000, outstanding: 0 });
    const reopened = store.getState().alerts.find((a) => a.title === "Expenses exceed income");
    expect(reopened?.status).toBe("active");
  });
});

describe("risk-store actions", () => {
  beforeEach(() => {
    resetAuthModuleState();
    resetStoreAfterDataWipe();
    localStorage.clear();
  });

  it("authenticate switches to user state", async () => {
    await registerUser("store@test.com", "password1");
    resetStoreAfterDataWipe();
    const result = await store.authenticate("store@test.com", "password1");
    expect(result.ok).toBe(true);
    expect(store.isAuthed()).toBe(true);
    expect(store.getState().profile.email).toBe("store@test.com");
  });

  it("logout clears auth state", async () => {
    await registerUser("logout@test.com", "password1");
    await store.authenticate("logout@test.com", "password1");
    store.logout();
    expect(store.isAuthed()).toBe(false);
  });

  it("markReviewed updates alert status", async () => {
    await registerUser("review@test.com", "password1");
    await store.authenticate("review@test.com", "password1");
    store.addFinancial({ income: 1000, expenses: 2000, outstanding: 0 });
    const alert = store.getState().alerts[0];
    expect(alert).toBeDefined();
    store.markReviewed(alert!.id);
    expect(store.getState().alerts.find((a) => a.id === alert!.id)?.status).toBe("reviewed");
  });

  it("resolveAllActive resolves only active alerts", async () => {
    await registerUser("resolve-all@test.com", "password1");
    await store.authenticate("resolve-all@test.com", "password1");
    store.addFinancial({ income: 1000, expenses: 2000, outstanding: 500 });
    const alert = store.getState().alerts[0];
    store.markReviewed(alert!.id);
    store.resolveAllActive();
    const statuses = store.getState().alerts.map((a) => a.status);
    expect(statuses.every((s) => s === "resolved" || s === "reviewed")).toBe(true);
    expect(statuses.some((s) => s === "active")).toBe(false);
  });
});

describe("store.register", () => {
  const sampleProfile = {
    businessName: "Register Co",
    ownerName: "Owner",
    email: "register@test.com",
    phone: "",
    businessType: "Retail",
    employees: 5,
  };

  beforeEach(() => {
    resetAuthModuleState();
    resetStoreAfterDataWipe();
    localStorage.clear();
  });

  it("registers a new SME and authenticates", async () => {
    const result = await store.register(sampleProfile, "password1");
    expect(result.ok).toBe(true);
    expect(store.isAuthed()).toBe(true);
    expect(store.getState().profile.businessName).toBe("Register Co");
  });

  it("rejects duplicate email", async () => {
    await registerUser("dup-store@test.com", "password1");
    clearSession();
    const result = await store.register({ ...sampleProfile, email: "dup-store@test.com" }, "password2");
    expect(result).toEqual({ ok: false, error: EMAIL_ALREADY_EXISTS_ERROR });
  });

  it("rejects orphaned profile email", async () => {
    const userId = "orphan-user-id";
    localStorage.setItem(
      `srs:state:v1:${userId}`,
      JSON.stringify({
        profile: { ...sampleProfile, email: "orphan-store@test.com" },
        financial: [],
        cyber: [],
        compliance: [],
        operational: [],
        alerts: [],
      }),
    );
    const result = await store.register({ ...sampleProfile, email: "orphan-store@test.com" }, "password1");
    expect(result).toEqual({ ok: false, error: ORPHANED_PROFILE_ERROR });
  });
});
