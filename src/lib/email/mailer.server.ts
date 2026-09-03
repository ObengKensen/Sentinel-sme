import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

import {
  renderAlertEmailHtml,
  renderAlertEmailText,
  type AlertEmailPayload,
} from "./alert-template.server";

export type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
};

export type SendAlertEmailResult =
  | { ok: true; messageId: string }
  | { ok: false; skipped: true; reason: string }
  | { ok: false; skipped: false; error: string };

export function getSmtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS ?? process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM ?? user;

  if (!host || !user || !pass || !from) return null;

  const port = Number(process.env.SMTP_PORT ?? "587");
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  return { host, port, secure, user, pass, from };
}

let transporter: Transporter | null | undefined;

function getTransporter(config: SmtpConfig): Transporter {
  if (transporter === undefined) {
    transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: { user: config.user, pass: config.pass },
    });
  }
  return transporter;
}

export async function sendAlertEmail(
  to: string,
  payload: AlertEmailPayload,
): Promise<SendAlertEmailResult> {
  const config = getSmtpConfig();
  if (!config) {
    console.warn(
      "[Risk Sentinel] SMTP not configured — alert email skipped. Set SMTP_HOST, SMTP_USER, SMTP_PASS, and SMTP_FROM.",
    );
    return {
      ok: false,
      skipped: true,
      reason: "SMTP environment variables are not configured.",
    };
  }

  try {
    const info = await getTransporter(config).sendMail({
      from: config.from,
      to,
      subject: `[Risk Sentinel] ${payload.severity.toUpperCase()} alert: ${payload.title}`,
      text: renderAlertEmailText(payload),
      html: renderAlertEmailHtml(payload),
    });

    return { ok: true, messageId: info.messageId };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown email error";
    console.error("[Risk Sentinel] Failed to send alert email:", message);
    return { ok: false, skipped: false, error: message };
  }
}
