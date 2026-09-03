import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { sendAlertEmail } from "../email/mailer.server";

const alertEmailInput = z.object({
  to: z.string().email(),
  alertId: z.string().min(1),
  title: z.string().min(1),
  category: z.enum(["financial", "cybersecurity", "compliance", "operational"]),
  severity: z.enum(["low", "medium", "high"]),
  action: z.string().min(1),
  date: z.string().min(1),
  businessName: z.string(),
  ownerName: z.string(),
  dashboardUrl: z.string().url().optional(),
});

export const sendAlertEmailFn = createServerFn({ method: "POST" })
  .validator(alertEmailInput)
  .handler(async ({ data }) => {
    const { to, ...payload } = data;
    return sendAlertEmail(to, payload);
  });
