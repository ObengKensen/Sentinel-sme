import type { Category, Severity } from "../risk-store";

export type AlertEmailPayload = {
  alertId: string;
  title: string;
  category: Category;
  severity: Severity;
  action: string;
  date: string;
  businessName: string;
  ownerName: string;
  dashboardUrl?: string;
};

const severityColor: Record<Severity, string> = {
  low: "#16A34A",
  medium: "#F59E0B",
  high: "#DC2626",
};

export function renderAlertEmailHtml(payload: AlertEmailPayload): string {
  const {
    alertId,
    title,
    category,
    severity,
    action,
    date,
    businessName,
    ownerName,
    dashboardUrl = "https://risk-sentinel.app/app/alerts",
  } = payload;

  const badgeColor = severityColor[severity];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Risk Sentinel Alert — ${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#334155;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F8FAFC;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;background:#FFFFFF;border:1px solid #E2E8F0;border-radius:10px;overflow:hidden;">
          <tr>
            <td style="background:#0F172A;padding:24px 28px;">
              <div style="font-size:18px;font-weight:700;color:#FFFFFF;letter-spacing:0.02em;">Risk Sentinel</div>
              <div style="font-size:12px;color:#94A3B8;margin-top:4px;">SME Risk Monitoring Platform</div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              <p style="margin:0 0 8px;font-size:13px;color:#64748B;">Hello ${escapeHtml(ownerName)},</p>
              <h1 style="margin:0 0 16px;font-size:20px;line-height:1.4;color:#0F172A;">New risk alert for ${escapeHtml(businessName)}</h1>
              <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#475569;">
                Our monitoring engine detected a condition that requires your attention. Review the details below and take the recommended action promptly.
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;margin-bottom:20px;">
                <tr>
                  <td style="padding:16px 18px;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#64748B;margin-bottom:8px;">Alert ID</div>
                    <div style="font-family:Consolas,Monaco,monospace;font-size:13px;color:#0F172A;margin-bottom:14px;">${escapeHtml(alertId)}</div>
                    <div style="font-size:16px;font-weight:600;color:#0F172A;margin-bottom:10px;">${escapeHtml(title)}</div>
                    <span style="display:inline-block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#FFFFFF;background:${badgeColor};border-radius:999px;padding:4px 10px;margin-right:8px;">${severity}</span>
                    <span style="display:inline-block;font-size:10px;font-weight:600;text-transform:capitalize;color:#0F766E;background:#CCFBF1;border-radius:999px;padding:4px 10px;">${escapeHtml(category)}</span>
                    <div style="margin-top:14px;font-size:12px;color:#64748B;">Generated: ${escapeHtml(date)}</div>
                  </td>
                </tr>
              </table>
              <div style="margin-bottom:24px;">
                <div style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#64748B;margin-bottom:8px;">Recommended action</div>
                <p style="margin:0;font-size:14px;line-height:1.6;color:#334155;">${escapeHtml(action)}</p>
              </div>
              <a href="${escapeHtml(dashboardUrl)}" style="display:inline-block;background:#0F766E;color:#FFFFFF;text-decoration:none;font-size:14px;font-weight:600;padding:12px 20px;border-radius:8px;">View in Alert Center</a>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 28px;background:#F1F5F9;border-top:1px solid #E2E8F0;">
              <p style="margin:0;font-size:11px;line-height:1.5;color:#64748B;">
                This is an automated notification from Risk Sentinel. If you did not expect this message, contact your platform administrator.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function renderAlertEmailText(payload: AlertEmailPayload): string {
  return [
    "Risk Sentinel — New Alert",
    "",
    `Hello ${payload.ownerName},`,
    "",
    `A new risk alert was generated for ${payload.businessName}.`,
    "",
    `Alert ID: ${payload.alertId}`,
    `Title: ${payload.title}`,
    `Category: ${payload.category}`,
    `Severity: ${payload.severity}`,
    `Date: ${payload.date}`,
    "",
    "Recommended action:",
    payload.action,
    "",
    `View alerts: ${payload.dashboardUrl ?? "https://risk-sentinel.app/app/alerts"}`,
  ].join("\n");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
