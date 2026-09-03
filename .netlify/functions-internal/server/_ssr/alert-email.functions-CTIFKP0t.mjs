import { c as createServerRpc } from "./createServerRpc-DDGXgg5L.mjs";
import { createServerFn } from "./server-DpwYz346.mjs";
import { n as nodemailer } from "../_libs/nodemailer.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType, e as enumType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "url";
import "http";
import "https";
import "zlib";
import "os";
import "child_process";
import "events";
import "fs";
import "net";
import "dns";
import "path";
import "tls";
const severityColor = {
  low: "#16A34A",
  medium: "#F59E0B",
  high: "#DC2626"
};
function renderAlertEmailHtml(payload) {
  const {
    alertId,
    title,
    category,
    severity,
    action,
    date,
    businessName,
    ownerName,
    dashboardUrl = "https://risk-sentinel.app/app/alerts"
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
function renderAlertEmailText(payload) {
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
    `View alerts: ${payload.dashboardUrl ?? "https://risk-sentinel.app/app/alerts"}`
  ].join("\n");
}
function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS ?? process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM ?? user;
  if (!host || !user || !pass || !from) return null;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  return { host, port, secure, user, pass, from };
}
let transporter;
function getTransporter(config) {
  if (transporter === void 0) {
    transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: { user: config.user, pass: config.pass }
    });
  }
  return transporter;
}
async function sendAlertEmail(to, payload) {
  const config = getSmtpConfig();
  if (!config) {
    console.warn(
      "[Risk Sentinel] SMTP not configured — alert email skipped. Set SMTP_HOST, SMTP_USER, SMTP_PASS, and SMTP_FROM."
    );
    return {
      ok: false,
      skipped: true,
      reason: "SMTP environment variables are not configured."
    };
  }
  try {
    const info = await getTransporter(config).sendMail({
      from: config.from,
      to,
      subject: `[Risk Sentinel] ${payload.severity.toUpperCase()} alert: ${payload.title}`,
      text: renderAlertEmailText(payload),
      html: renderAlertEmailHtml(payload)
    });
    return { ok: true, messageId: info.messageId };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown email error";
    console.error("[Risk Sentinel] Failed to send alert email:", message);
    return { ok: false, skipped: false, error: message };
  }
}
const alertEmailInput = objectType({
  to: stringType().email(),
  alertId: stringType().min(1),
  title: stringType().min(1),
  category: enumType(["financial", "cybersecurity", "compliance", "operational"]),
  severity: enumType(["low", "medium", "high"]),
  action: stringType().min(1),
  date: stringType().min(1),
  businessName: stringType(),
  ownerName: stringType(),
  dashboardUrl: stringType().url().optional()
});
const sendAlertEmailFn_createServerFn_handler = createServerRpc({
  id: "6ad6e3b3d756b1c8368ac45cc64fba9b34d6b7055bfc1520544fb082bafd1d64",
  name: "sendAlertEmailFn",
  filename: "src/lib/api/alert-email.functions.ts"
}, (opts) => sendAlertEmailFn.__executeServer(opts));
const sendAlertEmailFn = createServerFn({
  method: "POST"
}).validator(alertEmailInput).handler(sendAlertEmailFn_createServerFn_handler, async ({
  data
}) => {
  const {
    to,
    ...payload
  } = data;
  return sendAlertEmail(to, payload);
});
export {
  sendAlertEmailFn_createServerFn_handler
};
