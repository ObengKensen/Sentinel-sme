import type { Alert, Profile } from "./risk-store";
import { sendAlertEmailFn } from "./api/alert-email.functions";

export type NotificationChannel = "email" | "sms";

export type AlertNotificationPayload = {
  alert: Alert;
  profile: Profile;
  dashboardUrl?: string;
};

/**
 * Notification orchestration for Risk Sentinel alerts.
 *
 * SMS extension point: implement `sendSms` with a provider such as Twilio,
 * Vonage, or AWS SNS. Wire it into `notifyAlertCreated` alongside email when
 * the account profile includes a phone number and SMS is enabled in settings.
 */
export async function sendEmail(payload: AlertNotificationPayload): Promise<void> {
  const { alert, profile, dashboardUrl } = payload;
  const to = profile.email.trim();
  if (!to) {
    console.info("[Risk Sentinel] Alert email skipped — no recipient email on profile.");
    return;
  }

  try {
    const result = await sendAlertEmailFn({
      data: {
        to,
        alertId: alert.id,
        title: alert.title,
        category: alert.category,
        severity: alert.severity,
        action: alert.action,
        date: alert.date,
        businessName: profile.businessName || "Your business",
        ownerName: profile.ownerName || "Business owner",
        dashboardUrl,
      },
    });

    if (result.ok) return;

    if (result.skipped) {
      console.info(`[Risk Sentinel] Alert email skipped: ${result.reason}`);
      return;
    }

    console.warn(`[Risk Sentinel] Alert email failed: ${result.error}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.warn(`[Risk Sentinel] Alert email request failed: ${message}`);
  }
}

/** Stub for future SMS integration (Twilio, etc.). Not implemented by design. */
export async function sendSms(_payload: AlertNotificationPayload): Promise<void> {
  // Extension point — no-op until an SMS provider is configured.
  return;
}

export async function notifyAlertCreated(payload: AlertNotificationPayload): Promise<void> {
  await sendEmail(payload);
  // await sendSms(payload); — enable when SMS provider is integrated
}
