import { describe, expect, it, vi, beforeEach } from "vitest";
import { sendEmail, sendSms, notifyAlertCreated } from "./notification-service";
import { sendAlertEmailFn } from "./api/alert-email.functions";

const samplePayload = {
  alert: {
    id: "alert-1",
    category: "financial" as const,
    severity: "high" as const,
    title: "Test alert",
    action: "Do something",
    date: "2026-01-01",
    status: "active" as const,
  },
  profile: {
    businessName: "Test Co",
    ownerName: "Owner",
    email: "owner@test.com",
    phone: "",
    businessType: "Retail",
    employees: 5,
  },
  dashboardUrl: "http://localhost/app/alerts",
};

describe("notification-service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sendEmail calls alert email function", async () => {
    await sendEmail(samplePayload);
    expect(sendAlertEmailFn).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          to: "owner@test.com",
          title: "Test alert",
        }),
      }),
    );
  });

  it("sendEmail skips when profile has no email", async () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    await sendEmail({ ...samplePayload, profile: { ...samplePayload.profile, email: "  " } });
    expect(sendAlertEmailFn).not.toHaveBeenCalled();
    infoSpy.mockRestore();
  });

  it("sendSms is a no-op stub", async () => {
    await expect(sendSms(samplePayload)).resolves.toBeUndefined();
  });

  it("notifyAlertCreated sends email", async () => {
    await notifyAlertCreated(samplePayload);
    expect(sendAlertEmailFn).toHaveBeenCalled();
  });
});
