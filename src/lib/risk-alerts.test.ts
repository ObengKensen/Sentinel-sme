import { describe, expect, it } from "vitest";
import {
  evaluateFinancialAlerts,
  evaluateCyberAlerts,
  evaluateComplianceAlerts,
  evaluateOperationalAlerts,
  daysUntilDate,
  type ComplianceEntry,
  type CyberEntry,
  type FinancialEntry,
  type OperationalEntry,
} from "./risk-store";

const financial = (overrides: Partial<FinancialEntry> = {}): FinancialEntry => ({
  id: "f1",
  date: "2026-01-01",
  income: 10_000,
  expenses: 5_000,
  outstanding: 0,
  ...overrides,
});

const cyber = (overrides: Partial<CyberEntry> = {}): CyberEntry => ({
  id: "c1",
  date: "2026-01-01",
  passwordUpdated: true,
  antivirusActive: true,
  suspicious: false,
  ...overrides,
});

const compliance = (overrides: Partial<ComplianceEntry> = {}): ComplianceEntry => ({
  id: "co1",
  date: "2026-01-01",
  taxDeadline: "2030-06-01",
  taxStatus: "pending",
  licenseExpiry: "2030-12-01",
  licenseStatus: "valid",
  ...overrides,
});

const operational = (overrides: Partial<OperationalEntry> = {}): OperationalEntry => ({
  id: "o1",
  date: "2026-01-01",
  staffPresent: 5,
  staffRequired: 5,
  equipment: "working",
  delivery: "on-schedule",
  ...overrides,
});

describe("daysUntilDate", () => {
  const now = new Date(2026, 5, 15, 12, 0, 0).getTime();

  it("returns positive days for future dates", () => {
    const expected = Math.floor((new Date("2026-06-20").getTime() - now) / 86400000);
    expect(daysUntilDate("2026-06-20", now)).toBe(expected);
    expect(expected).toBeGreaterThan(0);
  });

  it("returns negative days for past dates", () => {
    const expected = Math.floor((new Date("2026-06-10").getTime() - now) / 86400000);
    expect(daysUntilDate("2026-06-10", now)).toBe(expected);
    expect(expected).toBeLessThan(0);
  });

  it("returns zero or negative for same calendar day depending on timezone", () => {
    const expected = Math.floor((new Date("2026-06-15").getTime() - now) / 86400000);
    expect(daysUntilDate("2026-06-15", now)).toBe(expected);
    expect(expected).toBeLessThanOrEqual(0);
  });
});

describe("evaluateFinancialAlerts", () => {
  it("returns no alerts for healthy finances", () => {
    expect(evaluateFinancialAlerts(financial())).toEqual([]);
  });

  it("flags high severity when expenses exceed income", () => {
    const alerts = evaluateFinancialAlerts(financial({ income: 1000, expenses: 1500 }));
    expect(alerts).toHaveLength(1);
    expect(alerts[0]).toMatchObject({
      category: "financial",
      severity: "high",
      title: "Expenses exceed income",
    });
  });

  it("flags medium severity for low profit margin below 10%", () => {
    const alerts = evaluateFinancialAlerts(financial({ income: 1000, expenses: 950 }));
    expect(alerts).toHaveLength(1);
    expect(alerts[0]).toMatchObject({
      category: "financial",
      severity: "medium",
      title: "Low profit margin (<10%)",
    });
  });

  it("does not flag low margin when profit is exactly 10%", () => {
    const alerts = evaluateFinancialAlerts(financial({ income: 1000, expenses: 900 }));
    expect(alerts.some((a) => a.title === "Low profit margin (<10%)")).toBe(false);
  });

  it("flags medium severity when outstanding exceeds 20% of income", () => {
    const alerts = evaluateFinancialAlerts(financial({ income: 1000, outstanding: 250 }));
    const outstanding = alerts.find((a) => a.title === "Outstanding payments above threshold");
    expect(outstanding?.severity).toBe("medium");
  });

  it("flags high severity when outstanding exceeds 40% of income", () => {
    const alerts = evaluateFinancialAlerts(financial({ income: 1000, outstanding: 500 }));
    const outstanding = alerts.find((a) => a.title === "Outstanding payments above threshold");
    expect(outstanding?.severity).toBe("high");
  });

  it("does not flag outstanding at exactly 20% threshold", () => {
    const alerts = evaluateFinancialAlerts(financial({ income: 1000, outstanding: 200 }));
    expect(alerts.some((a) => a.title === "Outstanding payments above threshold")).toBe(false);
  });

  it("can emit multiple alerts for combined issues", () => {
    const alerts = evaluateFinancialAlerts(
      financial({ income: 1000, expenses: 1100, outstanding: 500 }),
    );
    expect(alerts).toHaveLength(2);
    expect(alerts.map((a) => a.title)).toContain("Expenses exceed income");
    expect(alerts.map((a) => a.title)).toContain("Outstanding payments above threshold");
  });

  it("handles zero income without throwing", () => {
    const alerts = evaluateFinancialAlerts(financial({ income: 0, expenses: 0, outstanding: 0 }));
    expect(Array.isArray(alerts)).toBe(true);
  });
});

describe("evaluateCyberAlerts", () => {
  it("returns no alerts when all checks pass", () => {
    expect(evaluateCyberAlerts(cyber())).toEqual([]);
  });

  it("flags high severity for inactive antivirus", () => {
    const alerts = evaluateCyberAlerts(cyber({ antivirusActive: false }));
    expect(alerts).toContainEqual(
      expect.objectContaining({ severity: "high", title: "Antivirus inactive" }),
    );
  });

  it("flags high severity for suspicious activity", () => {
    const alerts = evaluateCyberAlerts(cyber({ suspicious: true }));
    expect(alerts).toContainEqual(
      expect.objectContaining({ severity: "high", title: "Suspicious activity reported" }),
    );
  });

  it("flags medium severity for stale passwords", () => {
    const alerts = evaluateCyberAlerts(cyber({ passwordUpdated: false }));
    expect(alerts).toContainEqual(
      expect.objectContaining({ severity: "medium", title: "Passwords not updated" }),
    );
  });

  it("returns all applicable alerts when multiple issues exist", () => {
    const alerts = evaluateCyberAlerts(
      cyber({ antivirusActive: false, suspicious: true, passwordUpdated: false }),
    );
    expect(alerts).toHaveLength(3);
    expect(alerts.every((a) => a.category === "cybersecurity")).toBe(true);
  });
});

describe("evaluateComplianceAlerts", () => {
  const now = new Date(2026, 5, 15, 12, 0, 0).getTime();

  it("returns no alerts when deadlines are far in the future", () => {
    expect(evaluateComplianceAlerts(compliance(), now)).toEqual([]);
  });

  it("flags high severity when tax deadline has passed", () => {
    const alerts = evaluateComplianceAlerts(
      compliance({ taxDeadline: "2026-01-01" }),
      now,
    );
    expect(alerts).toContainEqual(
      expect.objectContaining({ severity: "high", title: "Tax deadline passed" }),
    );
  });

  it("flags medium severity when tax deadline is within 7 days", () => {
    const alerts = evaluateComplianceAlerts(
      compliance({ taxDeadline: "2026-06-20" }),
      now,
    );
    expect(alerts).toHaveLength(1);
    expect(alerts[0]?.severity).toBe("medium");
    expect(alerts[0]?.title).toMatch(/^Tax deadline in \d+ days$/);
    expect(alerts[0]?.title).not.toBe("Tax deadline passed");
  });

  it("flags high severity when license is expired", () => {
    const alerts = evaluateComplianceAlerts(
      compliance({ licenseExpiry: "2026-01-01" }),
      now,
    );
    expect(alerts).toContainEqual(
      expect.objectContaining({ severity: "high", title: "Business license expired" }),
    );
  });

  it("flags medium severity when license expires within 7 days", () => {
    const alerts = evaluateComplianceAlerts(
      compliance({ licenseExpiry: "2026-06-18" }),
      now,
    );
    expect(alerts).toHaveLength(1);
    expect(alerts[0]?.severity).toBe("medium");
    expect(alerts[0]?.title).toMatch(/^License expires in \d+ days$/);
  });

  it("can emit alerts for both tax and license issues", () => {
    const alerts = evaluateComplianceAlerts(
      compliance({ taxDeadline: "2026-01-01", licenseExpiry: "2026-06-18" }),
      now,
    );
    expect(alerts).toHaveLength(2);
    expect(alerts.every((a) => a.category === "compliance")).toBe(true);
  });
});

describe("evaluateOperationalAlerts", () => {
  it("returns no alerts when operations are healthy", () => {
    expect(evaluateOperationalAlerts(operational())).toEqual([]);
  });

  it("flags medium severity for understaffing", () => {
    const alerts = evaluateOperationalAlerts(operational({ staffPresent: 2, staffRequired: 5 }));
    expect(alerts).toContainEqual(
      expect.objectContaining({ severity: "medium", title: "Low staff availability" }),
    );
  });

  it("flags medium severity for faulty equipment", () => {
    const alerts = evaluateOperationalAlerts(operational({ equipment: "faulty" }));
    expect(alerts).toContainEqual(
      expect.objectContaining({ severity: "medium", title: "Faulty equipment reported" }),
    );
  });

  it("flags medium severity for delayed delivery", () => {
    const alerts = evaluateOperationalAlerts(operational({ delivery: "delayed" }));
    expect(alerts).toContainEqual(
      expect.objectContaining({ severity: "medium", title: "Delivery delayed" }),
    );
  });

  it("returns all applicable alerts for combined operational issues", () => {
    const alerts = evaluateOperationalAlerts(
      operational({ staffPresent: 1, staffRequired: 4, equipment: "faulty", delivery: "delayed" }),
    );
    expect(alerts).toHaveLength(3);
    expect(alerts.every((a) => a.category === "operational")).toBe(true);
  });
});
