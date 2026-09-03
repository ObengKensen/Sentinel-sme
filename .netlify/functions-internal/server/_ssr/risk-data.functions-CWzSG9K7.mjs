import { c as createServerRpc } from "./createServerRpc-DDGXgg5L.mjs";
import { createServerFn } from "./server-DpwYz346.mjs";
import { i as isDatabaseConfigured, q as query, w as withTransaction } from "./db.server-B9pqecES.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "../_libs/pg.mjs";
import { e as enumType, o as objectType, n as numberType, s as stringType, a as arrayType, u as unknownType, b as booleanType } from "../_libs/zod.mjs";
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
import "node:process";
import "events";
import "util/types";
import "dns";
import "net";
import "tls";
import "../_libs/pg-types.mjs";
import "../_libs/postgres-array.mjs";
import "../_libs/postgres-date.mjs";
import "../_libs/postgres-interval.mjs";
import "../_libs/xtend.mjs";
import "../_libs/postgres-bytea.mjs";
import "../_libs/pg-int8.mjs";
import "../_libs/pg-connection-string.mjs";
import "fs";
import "../_libs/pg-protocol.mjs";
import "../_libs/pg-cloudflare.mjs";
import "../_libs/pgpass.mjs";
import "path";
import "../_libs/split2.mjs";
import "string_decoder";
import "../_libs/pg-pool.mjs";
const severitySchema = enumType(["low", "medium", "high"]);
const categorySchema = enumType(["financial", "cybersecurity", "compliance", "operational"]);
const alertStatusSchema = enumType(["active", "reviewed", "resolved"]);
const profileSchema = objectType({
  businessName: stringType(),
  ownerName: stringType(),
  email: stringType().email(),
  phone: stringType(),
  businessType: stringType(),
  employees: numberType().int().min(0)
});
const stateSchema = objectType({
  profile: profileSchema,
  financial: arrayType(objectType({
    id: stringType(),
    date: stringType(),
    income: numberType(),
    expenses: numberType(),
    outstanding: numberType()
  })),
  cyber: arrayType(objectType({
    id: stringType(),
    date: stringType(),
    passwordUpdated: booleanType(),
    antivirusActive: booleanType(),
    suspicious: booleanType(),
    assessment: unknownType().optional()
  })),
  compliance: arrayType(objectType({
    id: stringType(),
    date: stringType(),
    taxDeadline: stringType(),
    taxStatus: stringType(),
    licenseExpiry: stringType(),
    licenseStatus: stringType()
  })),
  operational: arrayType(objectType({
    id: stringType(),
    date: stringType(),
    staffPresent: numberType().int(),
    staffRequired: numberType().int(),
    equipment: enumType(["working", "faulty"]),
    delivery: enumType(["on-schedule", "delayed"])
  })),
  alerts: arrayType(objectType({
    id: stringType(),
    category: categorySchema,
    severity: severitySchema,
    title: stringType(),
    action: stringType(),
    date: stringType(),
    status: alertStatusSchema
  }))
});
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function isUuid(value) {
  return UUID_RE.test(value);
}
function nextId(value) {
  return isUuid(value) ? value : globalThis.crypto.randomUUID();
}
function toDeliveryDb(value) {
  return value === "delayed" ? "delayed" : "on_schedule";
}
function fromDeliveryDb(value) {
  return value === "delayed" ? "delayed" : "on-schedule";
}
async function getBusinessId(userId) {
  const result = await query(`SELECT id FROM businesses WHERE user_id = $1 LIMIT 1`, [userId]);
  return result.rows[0]?.id ?? null;
}
async function loadStateForBusiness(businessId, profile) {
  const [financial, cyber, compliance, operational, alerts] = await Promise.all([query(`SELECT id, record_date::text, income::text, expenses::text, outstanding_payments::text
       FROM financial_records WHERE business_id = $1 ORDER BY record_date ASC, created_at ASC`, [businessId]), query(`SELECT id, record_date::text, password_updated, antivirus_active, suspicious_activity, assessment_json
       FROM cybersecurity_records WHERE business_id = $1 ORDER BY record_date ASC, created_at ASC`, [businessId]), query(`SELECT id, record_date::text, tax_deadline::text, tax_status, license_expiry::text, license_status
       FROM compliance_records WHERE business_id = $1 ORDER BY record_date ASC, created_at ASC`, [businessId]), query(`SELECT id, record_date::text, staff_present, staff_required, equipment_status, delivery_status
       FROM operational_records WHERE business_id = $1 ORDER BY record_date ASC, created_at ASC`, [businessId]), query(`SELECT id, category, severity, title, action_text, status, created_at
       FROM alerts WHERE business_id = $1 ORDER BY created_at DESC`, [businessId])]);
  return {
    profile,
    financial: financial.rows.map((row) => ({
      id: row.id,
      date: row.record_date.slice(0, 10),
      income: Number(row.income),
      expenses: Number(row.expenses),
      outstanding: Number(row.outstanding_payments)
    })),
    cyber: cyber.rows.map((row) => ({
      id: row.id,
      date: row.record_date.slice(0, 10),
      passwordUpdated: row.password_updated,
      antivirusActive: row.antivirus_active,
      suspicious: row.suspicious_activity,
      ...row.assessment_json ? {
        assessment: row.assessment_json
      } : {}
    })),
    compliance: compliance.rows.map((row) => ({
      id: row.id,
      date: row.record_date.slice(0, 10),
      taxDeadline: row.tax_deadline.slice(0, 10),
      taxStatus: row.tax_status ?? "",
      licenseExpiry: row.license_expiry.slice(0, 10),
      licenseStatus: row.license_status ?? ""
    })),
    operational: operational.rows.map((row) => ({
      id: row.id,
      date: row.record_date.slice(0, 10),
      staffPresent: row.staff_present,
      staffRequired: row.staff_required,
      equipment: row.equipment_status,
      delivery: fromDeliveryDb(row.delivery_status)
    })),
    alerts: alerts.rows.map((row) => ({
      id: row.id,
      category: row.category,
      severity: row.severity,
      title: row.title,
      action: row.action_text,
      date: new Date(row.created_at).toISOString().slice(0, 10),
      status: row.status
    }))
  };
}
async function readBusinessProfile(userId) {
  const business = await query(`SELECT b.id, b.business_name, b.owner_name, b.phone, b.business_type, b.employees, u.email
     FROM businesses b
     JOIN users u ON u.id = b.user_id
     WHERE b.user_id = $1
     LIMIT 1`, [userId]);
  return business.rows[0] ?? null;
}
const loadRiskStateFn_createServerFn_handler = createServerRpc({
  id: "ab86894539af2179a85590228fde8468173a76344cb30a56302e203c77b25318",
  name: "loadRiskStateFn",
  filename: "src/lib/api/risk-data.functions.ts"
}, (opts) => loadRiskStateFn.__executeServer(opts));
const loadRiskStateFn = createServerFn({
  method: "POST"
}).validator(objectType({
  userId: stringType().uuid()
})).handler(loadRiskStateFn_createServerFn_handler, async ({
  data
}) => {
  if (!isDatabaseConfigured()) return {
    state: null
  };
  const row = await readBusinessProfile(data.userId);
  if (!row) return {
    state: null
  };
  return {
    state: await loadStateForBusiness(row.id, {
      businessName: row.business_name,
      ownerName: row.owner_name,
      email: row.email.toLowerCase(),
      phone: row.phone ?? "",
      businessType: row.business_type,
      employees: row.employees
    })
  };
});
const loadAllSmeRiskStatesFn_createServerFn_handler = createServerRpc({
  id: "1ab810b15808738ba3b6d08f809f56a547ab4585c80649081b08fca4df9b2b6d",
  name: "loadAllSmeRiskStatesFn",
  filename: "src/lib/api/risk-data.functions.ts"
}, (opts) => loadAllSmeRiskStatesFn.__executeServer(opts));
const loadAllSmeRiskStatesFn = createServerFn({
  method: "GET"
}).handler(loadAllSmeRiskStatesFn_createServerFn_handler, async () => {
  if (!isDatabaseConfigured()) return {
    states: {}
  };
  const businesses = await query(`SELECT b.user_id, b.id, b.business_name, b.owner_name, b.phone, b.business_type, b.employees, u.email
     FROM businesses b
     JOIN users u ON u.id = b.user_id
     WHERE u.role = 'SME_OWNER'`);
  const states = {};
  for (const row of businesses.rows) {
    states[row.user_id] = await loadStateForBusiness(row.id, {
      businessName: row.business_name,
      ownerName: row.owner_name,
      email: row.email.toLowerCase(),
      phone: row.phone ?? "",
      businessType: row.business_type,
      employees: row.employees
    });
  }
  return {
    states
  };
});
const saveRiskStateFn_createServerFn_handler = createServerRpc({
  id: "8fa0e13e4a07249306929f9e1dca61bd78057527aae39fb142b159cc1a5aceb8",
  name: "saveRiskStateFn",
  filename: "src/lib/api/risk-data.functions.ts"
}, (opts) => saveRiskStateFn.__executeServer(opts));
const saveRiskStateFn = createServerFn({
  method: "POST"
}).validator(objectType({
  userId: stringType().uuid(),
  state: stateSchema
})).handler(saveRiskStateFn_createServerFn_handler, async ({
  data
}) => {
  if (!isDatabaseConfigured()) {
    return {
      ok: false,
      error: "Database not configured.",
      state: null
    };
  }
  const businessId = await getBusinessId(data.userId);
  if (!businessId) {
    return {
      ok: false,
      error: "Business profile not found.",
      state: null
    };
  }
  try {
    await withTransaction(async (client) => {
      await client.query(`UPDATE businesses
           SET business_name = $1,
               owner_name = $2,
               phone = $3,
               business_type = $4,
               employees = $5,
               updated_at = NOW()
           WHERE id = $6`, [data.state.profile.businessName, data.state.profile.ownerName, data.state.profile.phone || null, data.state.profile.businessType, data.state.profile.employees, businessId]);
      await client.query(`DELETE FROM financial_records WHERE business_id = $1`, [businessId]);
      await client.query(`DELETE FROM cybersecurity_records WHERE business_id = $1`, [businessId]);
      await client.query(`DELETE FROM compliance_records WHERE business_id = $1`, [businessId]);
      await client.query(`DELETE FROM operational_records WHERE business_id = $1`, [businessId]);
      await client.query(`DELETE FROM alerts WHERE business_id = $1`, [businessId]);
      for (const entry of data.state.financial) {
        await client.query(`INSERT INTO financial_records
              (id, business_id, record_date, income, expenses, outstanding_payments)
             VALUES ($1, $2, $3::date, $4, $5, $6)`, [nextId(entry.id), businessId, entry.date, entry.income, entry.expenses, entry.outstanding]);
      }
      for (const entry of data.state.cyber) {
        await client.query(`INSERT INTO cybersecurity_records
              (id, business_id, record_date, password_updated, antivirus_active, suspicious_activity, assessment_json)
             VALUES ($1, $2, $3::date, $4, $5, $6, $7::jsonb)`, [nextId(entry.id), businessId, entry.date, entry.passwordUpdated, entry.antivirusActive, entry.suspicious, entry.assessment ? JSON.stringify(entry.assessment) : null]);
      }
      for (const entry of data.state.compliance) {
        await client.query(`INSERT INTO compliance_records
              (id, business_id, record_date, tax_deadline, tax_status, license_expiry, license_status)
             VALUES ($1, $2, $3::date, $4::date, $5, $6::date, $7)`, [nextId(entry.id), businessId, entry.date, entry.taxDeadline, entry.taxStatus || null, entry.licenseExpiry, entry.licenseStatus || null]);
      }
      for (const entry of data.state.operational) {
        await client.query(`INSERT INTO operational_records
              (id, business_id, record_date, staff_present, staff_required, equipment_status, delivery_status)
             VALUES ($1, $2, $3::date, $4, $5, $6, $7)`, [nextId(entry.id), businessId, entry.date, entry.staffPresent, entry.staffRequired, entry.equipment, toDeliveryDb(entry.delivery)]);
      }
      for (const alert of data.state.alerts) {
        await client.query(`INSERT INTO alerts
              (id, business_id, category, severity, title, action_text, status, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8::timestamptz)`, [nextId(alert.id), businessId, alert.category, alert.severity, alert.title, alert.action, alert.status, `${alert.date}T12:00:00.000Z`]);
      }
    });
    const row = await readBusinessProfile(data.userId);
    if (!row) return {
      ok: true,
      state: data.state
    };
    const state = await loadStateForBusiness(row.id, {
      businessName: row.business_name,
      ownerName: row.owner_name,
      email: row.email.toLowerCase(),
      phone: row.phone ?? "",
      businessType: row.business_type,
      employees: row.employees
    });
    return {
      ok: true,
      state
    };
  } catch (error) {
    console.error("[risk-data] save failed:", error);
    return {
      ok: false,
      error: "Could not save risk data.",
      state: null
    };
  }
});
export {
  loadAllSmeRiskStatesFn_createServerFn_handler,
  loadRiskStateFn_createServerFn_handler,
  saveRiskStateFn_createServerFn_handler
};
