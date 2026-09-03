import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { isDatabaseConfigured, query, withTransaction } from "../db.server";

const severitySchema = z.enum(["low", "medium", "high"]);
const categorySchema = z.enum(["financial", "cybersecurity", "compliance", "operational"]);
const alertStatusSchema = z.enum(["active", "reviewed", "resolved"]);

const profileSchema = z.object({
  businessName: z.string(),
  ownerName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  businessType: z.string(),
  employees: z.number().int().min(0),
});

const stateSchema = z.object({
  profile: profileSchema,
  financial: z.array(
    z.object({
      id: z.string(),
      date: z.string(),
      income: z.number(),
      expenses: z.number(),
      outstanding: z.number(),
    }),
  ),
  cyber: z.array(
    z.object({
      id: z.string(),
      date: z.string(),
      passwordUpdated: z.boolean(),
      antivirusActive: z.boolean(),
      suspicious: z.boolean(),
      assessment: z.unknown().optional(),
    }),
  ),
  compliance: z.array(
    z.object({
      id: z.string(),
      date: z.string(),
      taxDeadline: z.string(),
      taxStatus: z.string(),
      licenseExpiry: z.string(),
      licenseStatus: z.string(),
    }),
  ),
  operational: z.array(
    z.object({
      id: z.string(),
      date: z.string(),
      staffPresent: z.number().int(),
      staffRequired: z.number().int(),
      equipment: z.enum(["working", "faulty"]),
      delivery: z.enum(["on-schedule", "delayed"]),
    }),
  ),
  alerts: z.array(
    z.object({
      id: z.string(),
      category: categorySchema,
      severity: severitySchema,
      title: z.string(),
      action: z.string(),
      date: z.string(),
      status: alertStatusSchema,
    }),
  ),
});

export type PersistedRiskState = z.infer<typeof stateSchema>;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value: string) {
  return UUID_RE.test(value);
}

function nextId(value: string) {
  return isUuid(value) ? value : globalThis.crypto.randomUUID();
}

function toDeliveryDb(value: "on-schedule" | "delayed") {
  return value === "delayed" ? "delayed" : "on_schedule";
}

function fromDeliveryDb(value: string): "on-schedule" | "delayed" {
  return value === "delayed" ? "delayed" : "on-schedule";
}

async function getBusinessId(userId: string): Promise<string | null> {
  const result = await query<{ id: string }>(
    `SELECT id FROM businesses WHERE user_id = $1 LIMIT 1`,
    [userId],
  );
  return result.rows[0]?.id ?? null;
}

async function loadStateForBusiness(
  businessId: string,
  profile: PersistedRiskState["profile"],
): Promise<PersistedRiskState> {
  const [financial, cyber, compliance, operational, alerts] = await Promise.all([
    query<{
      id: string;
      record_date: string;
      income: string;
      expenses: string;
      outstanding_payments: string;
    }>(
      `SELECT id, record_date::text, income::text, expenses::text, outstanding_payments::text
       FROM financial_records WHERE business_id = $1 ORDER BY record_date ASC, created_at ASC`,
      [businessId],
    ),
    query<{
      id: string;
      record_date: string;
      password_updated: boolean;
      antivirus_active: boolean;
      suspicious_activity: boolean;
      assessment_json: unknown | null;
    }>(
      `SELECT id, record_date::text, password_updated, antivirus_active, suspicious_activity, assessment_json
       FROM cybersecurity_records WHERE business_id = $1 ORDER BY record_date ASC, created_at ASC`,
      [businessId],
    ),
    query<{
      id: string;
      record_date: string;
      tax_deadline: string;
      tax_status: string | null;
      license_expiry: string;
      license_status: string | null;
    }>(
      `SELECT id, record_date::text, tax_deadline::text, tax_status, license_expiry::text, license_status
       FROM compliance_records WHERE business_id = $1 ORDER BY record_date ASC, created_at ASC`,
      [businessId],
    ),
    query<{
      id: string;
      record_date: string;
      staff_present: number;
      staff_required: number;
      equipment_status: "working" | "faulty";
      delivery_status: string;
    }>(
      `SELECT id, record_date::text, staff_present, staff_required, equipment_status, delivery_status
       FROM operational_records WHERE business_id = $1 ORDER BY record_date ASC, created_at ASC`,
      [businessId],
    ),
    query<{
      id: string;
      category: PersistedRiskState["alerts"][number]["category"];
      severity: PersistedRiskState["alerts"][number]["severity"];
      title: string;
      action_text: string;
      status: PersistedRiskState["alerts"][number]["status"];
      created_at: Date | string;
    }>(
      `SELECT id, category, severity, title, action_text, status, created_at
       FROM alerts WHERE business_id = $1 ORDER BY created_at DESC`,
      [businessId],
    ),
  ]);

  return {
    profile,
    financial: financial.rows.map((row) => ({
      id: row.id,
      date: row.record_date.slice(0, 10),
      income: Number(row.income),
      expenses: Number(row.expenses),
      outstanding: Number(row.outstanding_payments),
    })),
    cyber: cyber.rows.map((row) => ({
      id: row.id,
      date: row.record_date.slice(0, 10),
      passwordUpdated: row.password_updated,
      antivirusActive: row.antivirus_active,
      suspicious: row.suspicious_activity,
      ...(row.assessment_json ? { assessment: row.assessment_json as PersistedRiskState["cyber"][number]["assessment"] } : {}),
    })),
    compliance: compliance.rows.map((row) => ({
      id: row.id,
      date: row.record_date.slice(0, 10),
      taxDeadline: row.tax_deadline.slice(0, 10),
      taxStatus: row.tax_status ?? "",
      licenseExpiry: row.license_expiry.slice(0, 10),
      licenseStatus: row.license_status ?? "",
    })),
    operational: operational.rows.map((row) => ({
      id: row.id,
      date: row.record_date.slice(0, 10),
      staffPresent: row.staff_present,
      staffRequired: row.staff_required,
      equipment: row.equipment_status,
      delivery: fromDeliveryDb(row.delivery_status),
    })),
    alerts: alerts.rows.map((row) => ({
      id: row.id,
      category: row.category,
      severity: row.severity,
      title: row.title,
      action: row.action_text,
      date: new Date(row.created_at).toISOString().slice(0, 10),
      status: row.status,
    })),
  };
}

async function readBusinessProfile(userId: string) {
  const business = await query<{
    id: string;
    business_name: string;
    owner_name: string;
    phone: string | null;
    business_type: string;
    employees: number;
    email: string;
  }>(
    `SELECT b.id, b.business_name, b.owner_name, b.phone, b.business_type, b.employees, u.email
     FROM businesses b
     JOIN users u ON u.id = b.user_id
     WHERE b.user_id = $1
     LIMIT 1`,
    [userId],
  );
  return business.rows[0] ?? null;
}

export const loadRiskStateFn = createServerFn({ method: "POST" })
  .validator(z.object({ userId: z.string().uuid() }))
  .handler(async ({ data }) => {
    if (!isDatabaseConfigured()) return { state: null as PersistedRiskState | null };

    const row = await readBusinessProfile(data.userId);
    if (!row) return { state: null as PersistedRiskState | null };

    return {
      state: await loadStateForBusiness(row.id, {
        businessName: row.business_name,
        ownerName: row.owner_name,
        email: row.email.toLowerCase(),
        phone: row.phone ?? "",
        businessType: row.business_type,
        employees: row.employees,
      }),
    };
  });

export const loadAllSmeRiskStatesFn = createServerFn({ method: "GET" }).handler(async () => {
  if (!isDatabaseConfigured()) return { states: {} as Record<string, PersistedRiskState> };

  const businesses = await query<{
    user_id: string;
    id: string;
    business_name: string;
    owner_name: string;
    phone: string | null;
    business_type: string;
    employees: number;
    email: string;
  }>(
    `SELECT b.user_id, b.id, b.business_name, b.owner_name, b.phone, b.business_type, b.employees, u.email
     FROM businesses b
     JOIN users u ON u.id = b.user_id
     WHERE u.role = 'SME_OWNER'`,
  );

  const states: Record<string, PersistedRiskState> = {};
  for (const row of businesses.rows) {
    states[row.user_id] = await loadStateForBusiness(row.id, {
      businessName: row.business_name,
      ownerName: row.owner_name,
      email: row.email.toLowerCase(),
      phone: row.phone ?? "",
      businessType: row.business_type,
      employees: row.employees,
    });
  }
  return { states };
});

export const saveRiskStateFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      userId: z.string().uuid(),
      state: stateSchema,
    }),
  )
  .handler(async ({ data }) => {
    if (!isDatabaseConfigured()) {
      return { ok: false as const, error: "Database not configured.", state: null };
    }

    const businessId = await getBusinessId(data.userId);
    if (!businessId) {
      return { ok: false as const, error: "Business profile not found.", state: null };
    }

    try {
      await withTransaction(async (client) => {
        await client.query(
          `UPDATE businesses
           SET business_name = $1,
               owner_name = $2,
               phone = $3,
               business_type = $4,
               employees = $5,
               updated_at = NOW()
           WHERE id = $6`,
          [
            data.state.profile.businessName,
            data.state.profile.ownerName,
            data.state.profile.phone || null,
            data.state.profile.businessType,
            data.state.profile.employees,
            businessId,
          ],
        );

        await client.query(`DELETE FROM financial_records WHERE business_id = $1`, [businessId]);
        await client.query(`DELETE FROM cybersecurity_records WHERE business_id = $1`, [businessId]);
        await client.query(`DELETE FROM compliance_records WHERE business_id = $1`, [businessId]);
        await client.query(`DELETE FROM operational_records WHERE business_id = $1`, [businessId]);
        await client.query(`DELETE FROM alerts WHERE business_id = $1`, [businessId]);

        for (const entry of data.state.financial) {
          await client.query(
            `INSERT INTO financial_records
              (id, business_id, record_date, income, expenses, outstanding_payments)
             VALUES ($1, $2, $3::date, $4, $5, $6)`,
            [
              nextId(entry.id),
              businessId,
              entry.date,
              entry.income,
              entry.expenses,
              entry.outstanding,
            ],
          );
        }

        for (const entry of data.state.cyber) {
          await client.query(
            `INSERT INTO cybersecurity_records
              (id, business_id, record_date, password_updated, antivirus_active, suspicious_activity, assessment_json)
             VALUES ($1, $2, $3::date, $4, $5, $6, $7::jsonb)`,
            [
              nextId(entry.id),
              businessId,
              entry.date,
              entry.passwordUpdated,
              entry.antivirusActive,
              entry.suspicious,
              entry.assessment ? JSON.stringify(entry.assessment) : null,
            ],
          );
        }

        for (const entry of data.state.compliance) {
          await client.query(
            `INSERT INTO compliance_records
              (id, business_id, record_date, tax_deadline, tax_status, license_expiry, license_status)
             VALUES ($1, $2, $3::date, $4::date, $5, $6::date, $7)`,
            [
              nextId(entry.id),
              businessId,
              entry.date,
              entry.taxDeadline,
              entry.taxStatus || null,
              entry.licenseExpiry,
              entry.licenseStatus || null,
            ],
          );
        }

        for (const entry of data.state.operational) {
          await client.query(
            `INSERT INTO operational_records
              (id, business_id, record_date, staff_present, staff_required, equipment_status, delivery_status)
             VALUES ($1, $2, $3::date, $4, $5, $6, $7)`,
            [
              nextId(entry.id),
              businessId,
              entry.date,
              entry.staffPresent,
              entry.staffRequired,
              entry.equipment,
              toDeliveryDb(entry.delivery),
            ],
          );
        }

        for (const alert of data.state.alerts) {
          await client.query(
            `INSERT INTO alerts
              (id, business_id, category, severity, title, action_text, status, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8::timestamptz)`,
            [
              nextId(alert.id),
              businessId,
              alert.category,
              alert.severity,
              alert.title,
              alert.action,
              alert.status,
              `${alert.date}T12:00:00.000Z`,
            ],
          );
        }
      });

      const row = await readBusinessProfile(data.userId);
      if (!row) return { ok: true as const, state: data.state };

      const state = await loadStateForBusiness(row.id, {
        businessName: row.business_name,
        ownerName: row.owner_name,
        email: row.email.toLowerCase(),
        phone: row.phone ?? "",
        businessType: row.business_type,
        employees: row.employees,
      });
      return { ok: true as const, state };
    } catch (error) {
      console.error("[risk-data] save failed:", error);
      return { ok: false as const, error: "Could not save risk data.", state: null };
    }
  });
