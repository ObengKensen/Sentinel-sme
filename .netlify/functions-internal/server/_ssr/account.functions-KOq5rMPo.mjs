import { c as createServerRpc } from "./createServerRpc-DDGXgg5L.mjs";
import { createServerFn } from "./server-DpwYz346.mjs";
import { s as signAuthToken } from "./jwt.server-sVP2l4Gx.mjs";
import { b as bcrypt } from "../_libs/bcryptjs.mjs";
import { i as isDatabaseConfigured, q as query, w as withTransaction } from "./db.server-B9pqecES.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "../_libs/pg.mjs";
import { o as objectType, s as stringType, n as numberType, e as enumType } from "../_libs/zod.mjs";
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
import "node:crypto";
import "./jwt.shared-gMsek6D_.mjs";
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
const ROUNDS = 10;
async function hashPasswordServer(password) {
  return bcrypt.hash(password, ROUNDS);
}
async function verifyPasswordServer(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}
const EMAIL_ALREADY_EXISTS_ERROR = "An account with this email already exists. Please sign in instead.";
const SUPER_ADMIN_EMAIL = "admin@smerisksentinel.com";
const SUPER_ADMIN_PASSWORD = "SuperAdmin2024!";
function normalizeEmail(email) {
  return email.trim().toLowerCase();
}
async function issueSession(user) {
  const token = await signAuthToken({
    userId: user.id,
    email: normalizeEmail(user.email),
    role: user.role
  });
  return {
    ok: true,
    token,
    userId: user.id,
    email: normalizeEmail(user.email),
    role: user.role,
    status: user.status,
    createdAt: new Date(user.created_at).toISOString()
  };
}
const getAuthBackendStatusFn_createServerFn_handler = createServerRpc({
  id: "5f4c63a8e6da6620b2acc63d751b16b25799520269b5a383e39974269a22d9ea",
  name: "getAuthBackendStatusFn",
  filename: "src/lib/api/account.functions.ts"
}, (opts) => getAuthBackendStatusFn.__executeServer(opts));
const getAuthBackendStatusFn = createServerFn({
  method: "GET"
}).handler(getAuthBackendStatusFn_createServerFn_handler, async () => {
  if (!isDatabaseConfigured()) return {
    available: false
  };
  try {
    await query("SELECT 1");
    return {
      available: true
    };
  } catch (error) {
    console.error("[auth] database unavailable:", error);
    return {
      available: false
    };
  }
});
const seedSuperAdminAccountFn_createServerFn_handler = createServerRpc({
  id: "cb0be79324c6744b939c899ad9fd32dcd83eab44bac828ca7c406f10d642fbc6",
  name: "seedSuperAdminAccountFn",
  filename: "src/lib/api/account.functions.ts"
}, (opts) => seedSuperAdminAccountFn.__executeServer(opts));
const seedSuperAdminAccountFn = createServerFn({
  method: "POST"
}).handler(seedSuperAdminAccountFn_createServerFn_handler, async () => {
  if (!isDatabaseConfigured()) return {
    ok: false,
    error: "Database not configured."
  };
  const existing = await query("SELECT id FROM users WHERE lower(email) = $1 LIMIT 1", [SUPER_ADMIN_EMAIL]);
  if ((existing.rowCount ?? 0) > 0) return {
    ok: true,
    seeded: false
  };
  const passwordHash = await hashPasswordServer(SUPER_ADMIN_PASSWORD);
  await query(`INSERT INTO users (email, password_hash, role, status)
     VALUES ($1, $2, 'SUPER_ADMIN', 'active')`, [SUPER_ADMIN_EMAIL, passwordHash]);
  return {
    ok: true,
    seeded: true
  };
});
const emailInput = objectType({
  email: stringType().transform((v) => normalizeEmail(v)).pipe(stringType().email())
});
const checkEmailAvailableFn_createServerFn_handler = createServerRpc({
  id: "c5b08e312a37de18e53540c3a57745e2cd2e614ca3e31a10e103a0d1ff0a920b",
  name: "checkEmailAvailableFn",
  filename: "src/lib/api/account.functions.ts"
}, (opts) => checkEmailAvailableFn.__executeServer(opts));
const checkEmailAvailableFn = createServerFn({
  method: "POST"
}).validator(emailInput).handler(checkEmailAvailableFn_createServerFn_handler, async ({
  data
}) => {
  if (!isDatabaseConfigured()) {
    return {
      available: true,
      conflict: null
    };
  }
  const found = await query("SELECT id FROM users WHERE lower(email) = $1 LIMIT 1", [data.email]);
  if ((found.rowCount ?? 0) > 0) {
    return {
      available: false,
      conflict: "exists"
    };
  }
  return {
    available: true,
    conflict: null
  };
});
const registerInput = objectType({
  email: stringType().transform((v) => normalizeEmail(v)).pipe(stringType().email()),
  password: stringType().min(6),
  businessName: stringType().min(1),
  ownerName: stringType().min(1),
  phone: stringType().optional().default(""),
  businessType: stringType().min(1),
  employees: numberType().int().min(1)
});
const registerAccountFn_createServerFn_handler = createServerRpc({
  id: "4a36f2d1bfd66242a88264b4575b60e5bfc3560f46d9e20607f2eb7b7d74c30a",
  name: "registerAccountFn",
  filename: "src/lib/api/account.functions.ts"
}, (opts) => registerAccountFn.__executeServer(opts));
const registerAccountFn = createServerFn({
  method: "POST"
}).validator(registerInput).handler(registerAccountFn_createServerFn_handler, async ({
  data
}) => {
  if (!isDatabaseConfigured()) {
    return {
      ok: false,
      error: "Database not configured."
    };
  }
  const existing = await query("SELECT id FROM users WHERE lower(email) = $1 LIMIT 1", [data.email]);
  if ((existing.rowCount ?? 0) > 0) {
    return {
      ok: false,
      error: EMAIL_ALREADY_EXISTS_ERROR
    };
  }
  const passwordHash = await hashPasswordServer(data.password);
  try {
    const user = await withTransaction(async (client) => {
      const inserted = await client.query(`INSERT INTO users (email, password_hash, role, status)
           VALUES ($1, $2, 'SME_OWNER', 'active')
           RETURNING id, email, password_hash, role, status, created_at`, [data.email, passwordHash]);
      const row = inserted.rows[0];
      await client.query(`INSERT INTO businesses (user_id, business_name, owner_name, phone, business_type, employees)
           VALUES ($1, $2, $3, $4, $5, $6)`, [row.id, data.businessName.trim(), data.ownerName.trim(), data.phone?.trim() || null, data.businessType, data.employees]);
      return row;
    });
    const session = await issueSession(user);
    return {
      ...session,
      profile: {
        businessName: data.businessName.trim(),
        ownerName: data.ownerName.trim(),
        email: data.email,
        phone: data.phone?.trim() || "",
        businessType: data.businessType,
        employees: data.employees
      }
    };
  } catch (error) {
    console.error("[auth] register failed:", error);
    return {
      ok: false,
      error: "Could not create account. Please try again."
    };
  }
});
const loginInput = objectType({
  email: stringType().transform((v) => normalizeEmail(v)).pipe(stringType().email()),
  password: stringType().min(1)
});
const loginAccountFn_createServerFn_handler = createServerRpc({
  id: "06de1968dc1a0e125ee62ba6428556b0a9554d4fbccdf60324f60f63b6756b07",
  name: "loginAccountFn",
  filename: "src/lib/api/account.functions.ts"
}, (opts) => loginAccountFn.__executeServer(opts));
const loginAccountFn = createServerFn({
  method: "POST"
}).validator(loginInput).handler(loginAccountFn_createServerFn_handler, async ({
  data
}) => {
  if (!isDatabaseConfigured()) {
    return {
      ok: false,
      error: "Database not configured."
    };
  }
  const found = await query(`SELECT id, email, password_hash, role, status, created_at
       FROM users WHERE lower(email) = $1 LIMIT 1`, [data.email]);
  const user = found.rows[0];
  if (!user) return {
    ok: false,
    error: "Invalid email or password."
  };
  if (user.status === "suspended") {
    return {
      ok: false,
      error: "Your account has been suspended. Please contact support."
    };
  }
  const valid = await verifyPasswordServer(data.password, user.password_hash);
  if (!valid) return {
    ok: false,
    error: "Invalid email or password."
  };
  const session = await issueSession(user);
  if (user.role === "SME_OWNER") {
    const biz = await query(`SELECT business_name, owner_name, phone, business_type, employees
         FROM businesses WHERE user_id = $1 LIMIT 1`, [user.id]);
    const profile = biz.rows[0];
    return {
      ...session,
      profile: profile ? {
        businessName: profile.business_name,
        ownerName: profile.owner_name,
        email: normalizeEmail(user.email),
        phone: profile.phone ?? "",
        businessType: profile.business_type,
        employees: profile.employees
      } : null
    };
  }
  return {
    ...session,
    profile: null
  };
});
const resetInput = objectType({
  email: stringType().transform((v) => normalizeEmail(v)).pipe(stringType().email()),
  newPassword: stringType().min(6)
});
const resetAccountPasswordFn_createServerFn_handler = createServerRpc({
  id: "bb59c875dd92178bbe25ad83a00d2e5dbe184c16c843f13754a8f8b001988b62",
  name: "resetAccountPasswordFn",
  filename: "src/lib/api/account.functions.ts"
}, (opts) => resetAccountPasswordFn.__executeServer(opts));
const resetAccountPasswordFn = createServerFn({
  method: "POST"
}).validator(resetInput).handler(resetAccountPasswordFn_createServerFn_handler, async ({
  data
}) => {
  if (!isDatabaseConfigured()) {
    return {
      ok: false,
      error: "Database not configured."
    };
  }
  const found = await query(`SELECT id, email, password_hash, role, status, created_at
       FROM users WHERE lower(email) = $1 LIMIT 1`, [data.email]);
  const user = found.rows[0];
  if (!user) return {
    ok: false,
    error: "No account found with that email."
  };
  const passwordHash = await hashPasswordServer(data.newPassword);
  await query(`UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`, [passwordHash, user.id]);
  return {
    ok: true,
    userId: user.id,
    email: normalizeEmail(user.email),
    role: user.role
  };
});
const changePasswordInput = objectType({
  userId: stringType().uuid(),
  currentPassword: stringType().min(1),
  newPassword: stringType().min(6)
});
const changeAccountPasswordFn_createServerFn_handler = createServerRpc({
  id: "d2907f0502872a9f5b8fd67efb414e58cb9ff6406c29750d5b6d32213f069e6c",
  name: "changeAccountPasswordFn",
  filename: "src/lib/api/account.functions.ts"
}, (opts) => changeAccountPasswordFn.__executeServer(opts));
const changeAccountPasswordFn = createServerFn({
  method: "POST"
}).validator(changePasswordInput).handler(changeAccountPasswordFn_createServerFn_handler, async ({
  data
}) => {
  if (!isDatabaseConfigured()) {
    return {
      ok: false,
      error: "Database not configured."
    };
  }
  const found = await query(`SELECT id, email, password_hash, role, status, created_at FROM users WHERE id = $1 LIMIT 1`, [data.userId]);
  const user = found.rows[0];
  if (!user) return {
    ok: false,
    error: "Account not found."
  };
  const valid = await verifyPasswordServer(data.currentPassword, user.password_hash);
  if (!valid) return {
    ok: false,
    error: "Current password is incorrect."
  };
  const passwordHash = await hashPasswordServer(data.newPassword);
  await query(`UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`, [passwordHash, user.id]);
  return {
    ok: true,
    userId: user.id,
    email: normalizeEmail(user.email),
    role: user.role
  };
});
const updateEmailInput = objectType({
  userId: stringType().uuid(),
  email: stringType().transform((v) => normalizeEmail(v)).pipe(stringType().email())
});
const updateAccountEmailFn_createServerFn_handler = createServerRpc({
  id: "95ea42531ae72f0a74f8253be52252bc00022e1996017828d7cdd7512efa2eb8",
  name: "updateAccountEmailFn",
  filename: "src/lib/api/account.functions.ts"
}, (opts) => updateAccountEmailFn.__executeServer(opts));
const updateAccountEmailFn = createServerFn({
  method: "POST"
}).validator(updateEmailInput).handler(updateAccountEmailFn_createServerFn_handler, async ({
  data
}) => {
  if (!isDatabaseConfigured()) {
    return {
      ok: false,
      error: "Database not configured."
    };
  }
  const found = await query(`SELECT id, email, password_hash, role, status, created_at FROM users WHERE id = $1 LIMIT 1`, [data.userId]);
  const user = found.rows[0];
  if (!user) return {
    ok: false,
    error: "Account not found."
  };
  const clash = await query(`SELECT id FROM users WHERE lower(email) = $1 AND id <> $2 LIMIT 1`, [data.email, data.userId]);
  if ((clash.rowCount ?? 0) > 0) {
    return {
      ok: false,
      error: "That email is already in use."
    };
  }
  await query(`UPDATE users SET email = $1, updated_at = NOW() WHERE id = $2`, [data.email, data.userId]);
  return {
    ok: true,
    userId: user.id,
    email: data.email,
    role: user.role
  };
});
const updateStatusInput = objectType({
  userId: stringType().uuid(),
  status: enumType(["active", "suspended"])
});
const updateAccountStatusFn_createServerFn_handler = createServerRpc({
  id: "9591f62ae6ff24aeef9b8412d8074a07565301e7c55713f02cc769a6d19a3da7",
  name: "updateAccountStatusFn",
  filename: "src/lib/api/account.functions.ts"
}, (opts) => updateAccountStatusFn.__executeServer(opts));
const updateAccountStatusFn = createServerFn({
  method: "POST"
}).validator(updateStatusInput).handler(updateAccountStatusFn_createServerFn_handler, async ({
  data
}) => {
  if (!isDatabaseConfigured()) {
    return {
      ok: false,
      error: "Database not configured."
    };
  }
  const found = await query(`SELECT id, email, password_hash, role, status, created_at FROM users WHERE id = $1 LIMIT 1`, [data.userId]);
  const user = found.rows[0];
  if (!user) return {
    ok: false,
    error: "Account not found."
  };
  if (user.role === "SUPER_ADMIN") {
    return {
      ok: false,
      error: "Cannot change super admin status."
    };
  }
  await query(`UPDATE users SET status = $1, updated_at = NOW() WHERE id = $2`, [data.status, data.userId]);
  return {
    ok: true,
    userId: user.id,
    email: normalizeEmail(user.email),
    role: user.role
  };
});
const listAccountsFn_createServerFn_handler = createServerRpc({
  id: "ca5596057431a8fb0ec5416c9c95bf3e1a9e41a38fd46323e50fdb772cb7a6c1",
  name: "listAccountsFn",
  filename: "src/lib/api/account.functions.ts"
}, (opts) => listAccountsFn.__executeServer(opts));
const listAccountsFn = createServerFn({
  method: "GET"
}).handler(listAccountsFn_createServerFn_handler, async () => {
  if (!isDatabaseConfigured()) return {
    accounts: []
  };
  const result = await query(`SELECT u.id, u.email, u.password_hash, u.role, u.status, u.created_at,
            b.business_name, b.owner_name, b.phone, b.business_type, b.employees
     FROM users u
     LEFT JOIN businesses b ON b.user_id = u.id
     ORDER BY u.created_at ASC`);
  return {
    accounts: result.rows.map((row) => ({
      id: row.id,
      email: normalizeEmail(row.email),
      role: row.role,
      status: row.status,
      createdAt: new Date(row.created_at).toISOString(),
      businessName: row.business_name ?? "",
      ownerName: row.owner_name ?? "",
      phone: row.phone ?? "",
      businessType: row.business_type ?? "",
      employees: row.employees ?? 0
    }))
  };
});
const getAccountByIdFn_createServerFn_handler = createServerRpc({
  id: "ae4d836b75db405fa7e212e24f298bedc15be81b0069838a96cb62ecc8853bc2",
  name: "getAccountByIdFn",
  filename: "src/lib/api/account.functions.ts"
}, (opts) => getAccountByIdFn.__executeServer(opts));
const getAccountByIdFn = createServerFn({
  method: "POST"
}).validator(objectType({
  userId: stringType().uuid()
})).handler(getAccountByIdFn_createServerFn_handler, async ({
  data
}) => {
  if (!isDatabaseConfigured()) return {
    account: null
  };
  const found = await query(`SELECT u.id, u.email, u.password_hash, u.role, u.status, u.created_at,
              b.business_name, b.owner_name, b.phone, b.business_type, b.employees
       FROM users u
       LEFT JOIN businesses b ON b.user_id = u.id
       WHERE u.id = $1
       LIMIT 1`, [data.userId]);
  const row = found.rows[0];
  if (!row) return {
    account: null
  };
  return {
    account: {
      id: row.id,
      email: normalizeEmail(row.email),
      role: row.role,
      status: row.status,
      createdAt: new Date(row.created_at).toISOString(),
      businessName: row.business_name ?? "",
      ownerName: row.owner_name ?? "",
      phone: row.phone ?? "",
      businessType: row.business_type ?? "",
      employees: row.employees ?? 0
    }
  };
});
export {
  changeAccountPasswordFn_createServerFn_handler,
  checkEmailAvailableFn_createServerFn_handler,
  getAccountByIdFn_createServerFn_handler,
  getAuthBackendStatusFn_createServerFn_handler,
  listAccountsFn_createServerFn_handler,
  loginAccountFn_createServerFn_handler,
  registerAccountFn_createServerFn_handler,
  resetAccountPasswordFn_createServerFn_handler,
  seedSuperAdminAccountFn_createServerFn_handler,
  updateAccountEmailFn_createServerFn_handler,
  updateAccountStatusFn_createServerFn_handler
};
