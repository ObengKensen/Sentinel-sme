import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { signAuthToken } from "../auth/jwt.server";
import { hashPasswordServer, verifyPasswordServer } from "../auth/password.server";
import type { UserRole } from "../auth/jwt.shared";
import { isDatabaseConfigured, query, withTransaction } from "../db.server";
import {
  ensureFileAccountStore,
  fileCreateUser,
  fileFindUserByEmail,
  fileFindUserById,
  fileListUsers,
  fileUpdateUser,
  type FileUser,
} from "../local-account-store.server";

export const EMAIL_ALREADY_EXISTS_ERROR =
  "An account with this email already exists. Please sign in instead.";

const SUPER_ADMIN_EMAIL = "admin@smerisksentinel.com";
const SUPER_ADMIN_PASSWORD = "SuperAdmin2024!";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

type DbUser = {
  id: string;
  email: string;
  password_hash: string;
  role: UserRole;
  status: "active" | "suspended";
  created_at: Date | string;
};

type DbAccountRow = DbUser & {
  business_name: string | null;
  owner_name: string | null;
  phone: string | null;
  business_type: string | null;
  employees: number | null;
};

function profileFromFileUser(user: FileUser) {
  if (!user.profile) return null;
  return {
    businessName: user.profile.businessName,
    ownerName: user.profile.ownerName,
    email: normalizeEmail(user.email),
    phone: user.profile.phone,
    businessType: user.profile.businessType,
    employees: user.profile.employees,
  };
}

async function issueFileSession(user: FileUser) {
  const session = await issueSession({
    id: user.id,
    email: user.email,
    role: user.role,
    status: user.status,
    created_at: user.createdAt,
  });
  return { ...session, profile: profileFromFileUser(user) };
}

async function issueSession(user: Pick<DbUser, "id" | "email" | "role" | "status" | "created_at">) {
  const token = await signAuthToken({
    userId: user.id,
    email: normalizeEmail(user.email),
    role: user.role,
  });
  return {
    ok: true as const,
    token,
    userId: user.id,
    email: normalizeEmail(user.email),
    role: user.role,
    status: user.status,
    createdAt: new Date(user.created_at).toISOString(),
  };
}

export const getAuthBackendStatusFn = createServerFn({ method: "GET" }).handler(async () => {
  if (isDatabaseConfigured()) {
    try {
      await query("SELECT 1");
      return { available: true as const, mode: "postgres" as const };
    } catch (error) {
      console.error("[auth] database unavailable:", error);
      return { available: false as const, mode: "postgres" as const };
    }
  }
  try {
    await ensureFileAccountStore();
    return { available: true as const, mode: "shared-file" as const };
  } catch (error) {
    console.error("[auth] shared account store unavailable:", error);
    return { available: false as const, mode: "none" as const };
  }
});

export const seedSuperAdminAccountFn = createServerFn({ method: "POST" }).handler(async () => {
  if (!isDatabaseConfigured()) {
    if (await fileFindUserByEmail(SUPER_ADMIN_EMAIL)) {
      return { ok: true as const, seeded: false as const };
    }
    await fileCreateUser({
      email: SUPER_ADMIN_EMAIL,
      passwordHash: await hashPasswordServer(SUPER_ADMIN_PASSWORD),
      role: "SUPER_ADMIN",
      profile: null,
    });
    return { ok: true as const, seeded: true as const };
  }

  const existing = await query<DbUser>("SELECT id FROM users WHERE lower(email) = $1 LIMIT 1", [
    SUPER_ADMIN_EMAIL,
  ]);
  if ((existing.rowCount ?? 0) > 0) return { ok: true as const, seeded: false as const };

  const passwordHash = await hashPasswordServer(SUPER_ADMIN_PASSWORD);
  await query(
    `INSERT INTO users (email, password_hash, role, status)
     VALUES ($1, $2, 'SUPER_ADMIN', 'active')`,
    [SUPER_ADMIN_EMAIL, passwordHash],
  );
  return { ok: true as const, seeded: true as const };
});

const emailInput = z.object({
  email: z
    .string()
    .transform((v) => normalizeEmail(v))
    .pipe(z.string().email()),
});

export const checkEmailAvailableFn = createServerFn({ method: "POST" })
  .validator(emailInput)
  .handler(async ({ data }) => {
    if (!isDatabaseConfigured()) {
      const existing = await fileFindUserByEmail(data.email);
      if (existing) return { available: false as const, conflict: "exists" as const };
      return { available: true as const, conflict: null };
    }
    const found = await query("SELECT id FROM users WHERE lower(email) = $1 LIMIT 1", [data.email]);
    if ((found.rowCount ?? 0) > 0) {
      return { available: false as const, conflict: "exists" as const };
    }
    return { available: true as const, conflict: null };
  });

const registerInput = z.object({
  email: z
    .string()
    .transform((v) => normalizeEmail(v))
    .pipe(z.string().email()),
  password: z.string().min(6),
  businessName: z.string().min(1),
  ownerName: z.string().min(1),
  phone: z.string().optional().default(""),
  businessType: z.string().min(1),
  employees: z.number().int().min(1),
});

export const registerAccountFn = createServerFn({ method: "POST" })
  .validator(registerInput)
  .handler(async ({ data }) => {
    if (!isDatabaseConfigured()) {
      if (await fileFindUserByEmail(data.email)) {
        return { ok: false as const, error: EMAIL_ALREADY_EXISTS_ERROR };
      }
      try {
        const user = await fileCreateUser({
          email: data.email,
          passwordHash: await hashPasswordServer(data.password),
          role: "SME_OWNER",
          profile: {
            businessName: data.businessName.trim(),
            ownerName: data.ownerName.trim(),
            phone: data.phone?.trim() || "",
            businessType: data.businessType,
            employees: data.employees,
          },
        });
        return issueFileSession(user);
      } catch (error) {
        if (error instanceof Error && error.message === "EMAIL_EXISTS") {
          return { ok: false as const, error: EMAIL_ALREADY_EXISTS_ERROR };
        }
        console.error("[auth] register failed:", error);
        return { ok: false as const, error: "Could not create account. Please try again." };
      }
    }

    const existing = await query("SELECT id FROM users WHERE lower(email) = $1 LIMIT 1", [
      data.email,
    ]);
    if ((existing.rowCount ?? 0) > 0) {
      return { ok: false as const, error: EMAIL_ALREADY_EXISTS_ERROR };
    }

    const passwordHash = await hashPasswordServer(data.password);

    try {
      const user = await withTransaction(async (client) => {
        const inserted = await client.query<DbUser>(
          `INSERT INTO users (email, password_hash, role, status)
           VALUES ($1, $2, 'SME_OWNER', 'active')
           RETURNING id, email, password_hash, role, status, created_at`,
          [data.email, passwordHash],
        );
        const row = inserted.rows[0]!;
        await client.query(
          `INSERT INTO businesses (user_id, business_name, owner_name, phone, business_type, employees)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            row.id,
            data.businessName.trim(),
            data.ownerName.trim(),
            data.phone?.trim() || null,
            data.businessType,
            data.employees,
          ],
        );
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
          employees: data.employees,
        },
      };
    } catch (error) {
      console.error("[auth] register failed:", error);
      return { ok: false as const, error: "Could not create account. Please try again." };
    }
  });

const loginInput = z.object({
  email: z
    .string()
    .transform((v) => normalizeEmail(v))
    .pipe(z.string().email()),
  password: z.string().min(1),
});

export const loginAccountFn = createServerFn({ method: "POST" })
  .validator(loginInput)
  .handler(async ({ data }) => {
    if (!isDatabaseConfigured()) {
      const user = await fileFindUserByEmail(data.email);
      if (!user) return { ok: false as const, error: "Invalid email or password." };
      if (user.status === "suspended") {
        return {
          ok: false as const,
          error: "Your account has been suspended. Please contact support.",
        };
      }
      const valid = await verifyPasswordServer(data.password, user.passwordHash);
      if (!valid) return { ok: false as const, error: "Invalid email or password." };
      return issueFileSession(user);
    }

    const found = await query<DbUser>(
      `SELECT id, email, password_hash, role, status, created_at
       FROM users WHERE lower(email) = $1 LIMIT 1`,
      [data.email],
    );
    const user = found.rows[0];
    if (!user) return { ok: false as const, error: "Invalid email or password." };
    if (user.status === "suspended") {
      return {
        ok: false as const,
        error: "Your account has been suspended. Please contact support.",
      };
    }

    const valid = await verifyPasswordServer(data.password, user.password_hash);
    if (!valid) return { ok: false as const, error: "Invalid email or password." };

    const session = await issueSession(user);

    if (user.role === "SME_OWNER") {
      const biz = await query<{
        business_name: string;
        owner_name: string;
        phone: string | null;
        business_type: string;
        employees: number;
      }>(
        `SELECT business_name, owner_name, phone, business_type, employees
         FROM businesses WHERE user_id = $1 LIMIT 1`,
        [user.id],
      );
      const profile = biz.rows[0];
      return {
        ...session,
        profile: profile
          ? {
              businessName: profile.business_name,
              ownerName: profile.owner_name,
              email: normalizeEmail(user.email),
              phone: profile.phone ?? "",
              businessType: profile.business_type,
              employees: profile.employees,
            }
          : null,
      };
    }

    return { ...session, profile: null };
  });

const resetInput = z.object({
  email: z
    .string()
    .transform((v) => normalizeEmail(v))
    .pipe(z.string().email()),
  newPassword: z.string().min(6),
});

export const resetAccountPasswordFn = createServerFn({ method: "POST" })
  .validator(resetInput)
  .handler(async ({ data }) => {
    if (!isDatabaseConfigured()) {
      const user = await fileFindUserByEmail(data.email);
      if (!user) return { ok: false as const, error: "No account found with that email." };
      const updated = await fileUpdateUser(user.id, {
        passwordHash: await hashPasswordServer(data.newPassword),
      });
      if (!updated) return { ok: false as const, error: "No account found with that email." };
      return {
        ok: true as const,
        userId: updated.id,
        email: updated.email,
        role: updated.role,
      };
    }

    const found = await query<DbUser>(
      `SELECT id, email, password_hash, role, status, created_at
       FROM users WHERE lower(email) = $1 LIMIT 1`,
      [data.email],
    );
    const user = found.rows[0];
    if (!user) return { ok: false as const, error: "No account found with that email." };

    const passwordHash = await hashPasswordServer(data.newPassword);
    await query(`UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`, [
      passwordHash,
      user.id,
    ]);

    return {
      ok: true as const,
      userId: user.id,
      email: normalizeEmail(user.email),
      role: user.role,
    };
  });

const changePasswordInput = z.object({
  userId: z.string().uuid(),
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

export const changeAccountPasswordFn = createServerFn({ method: "POST" })
  .validator(changePasswordInput)
  .handler(async ({ data }) => {
    if (!isDatabaseConfigured()) {
      const user = await fileFindUserById(data.userId);
      if (!user) return { ok: false as const, error: "Account not found." };
      const valid = await verifyPasswordServer(data.currentPassword, user.passwordHash);
      if (!valid) return { ok: false as const, error: "Current password is incorrect." };
      const updated = await fileUpdateUser(user.id, {
        passwordHash: await hashPasswordServer(data.newPassword),
      });
      if (!updated) return { ok: false as const, error: "Account not found." };
      return {
        ok: true as const,
        userId: updated.id,
        email: updated.email,
        role: updated.role,
      };
    }

    const found = await query<DbUser>(
      `SELECT id, email, password_hash, role, status, created_at FROM users WHERE id = $1 LIMIT 1`,
      [data.userId],
    );
    const user = found.rows[0];
    if (!user) return { ok: false as const, error: "Account not found." };

    const valid = await verifyPasswordServer(data.currentPassword, user.password_hash);
    if (!valid) return { ok: false as const, error: "Current password is incorrect." };

    const passwordHash = await hashPasswordServer(data.newPassword);
    await query(`UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`, [
      passwordHash,
      user.id,
    ]);

    return {
      ok: true as const,
      userId: user.id,
      email: normalizeEmail(user.email),
      role: user.role,
    };
  });

const updateEmailInput = z.object({
  userId: z.string().uuid(),
  email: z
    .string()
    .transform((v) => normalizeEmail(v))
    .pipe(z.string().email()),
});

export const updateAccountEmailFn = createServerFn({ method: "POST" })
  .validator(updateEmailInput)
  .handler(async ({ data }) => {
    if (!isDatabaseConfigured()) {
      const user = await fileFindUserById(data.userId);
      if (!user) return { ok: false as const, error: "Account not found." };
      try {
        const updated = await fileUpdateUser(user.id, { email: data.email });
        if (!updated) return { ok: false as const, error: "Account not found." };
        return {
          ok: true as const,
          userId: updated.id,
          email: updated.email,
          role: updated.role,
        };
      } catch (error) {
        if (error instanceof Error && error.message === "EMAIL_EXISTS") {
          return { ok: false as const, error: "That email is already in use." };
        }
        throw error;
      }
    }

    const found = await query<DbUser>(
      `SELECT id, email, password_hash, role, status, created_at FROM users WHERE id = $1 LIMIT 1`,
      [data.userId],
    );
    const user = found.rows[0];
    if (!user) return { ok: false as const, error: "Account not found." };

    const clash = await query(`SELECT id FROM users WHERE lower(email) = $1 AND id <> $2 LIMIT 1`, [
      data.email,
      data.userId,
    ]);
    if ((clash.rowCount ?? 0) > 0) {
      return { ok: false as const, error: "That email is already in use." };
    }

    await query(`UPDATE users SET email = $1, updated_at = NOW() WHERE id = $2`, [
      data.email,
      data.userId,
    ]);

    return {
      ok: true as const,
      userId: user.id,
      email: data.email,
      role: user.role,
    };
  });

const updateStatusInput = z.object({
  userId: z.string().uuid(),
  status: z.enum(["active", "suspended"]),
});

export const updateAccountStatusFn = createServerFn({ method: "POST" })
  .validator(updateStatusInput)
  .handler(async ({ data }) => {
    if (!isDatabaseConfigured()) {
      const user = await fileFindUserById(data.userId);
      if (!user) return { ok: false as const, error: "Account not found." };
      if (user.role === "SUPER_ADMIN") {
        return { ok: false as const, error: "Cannot change super admin status." };
      }
      const updated = await fileUpdateUser(user.id, { status: data.status });
      if (!updated) return { ok: false as const, error: "Account not found." };
      return {
        ok: true as const,
        userId: updated.id,
        email: updated.email,
        role: updated.role,
      };
    }

    const found = await query<DbUser>(
      `SELECT id, email, password_hash, role, status, created_at FROM users WHERE id = $1 LIMIT 1`,
      [data.userId],
    );
    const user = found.rows[0];
    if (!user) return { ok: false as const, error: "Account not found." };
    if (user.role === "SUPER_ADMIN") {
      return { ok: false as const, error: "Cannot change super admin status." };
    }

    await query(`UPDATE users SET status = $1, updated_at = NOW() WHERE id = $2`, [
      data.status,
      data.userId,
    ]);

    return {
      ok: true as const,
      userId: user.id,
      email: normalizeEmail(user.email),
      role: user.role,
    };
  });

export const listAccountsFn = createServerFn({ method: "GET" }).handler(async () => {
  if (!isDatabaseConfigured()) {
    const users = await fileListUsers();
    return {
      accounts: users.map((user) => ({
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        businessName: user.profile?.businessName ?? "",
        ownerName: user.profile?.ownerName ?? "",
        phone: user.profile?.phone ?? "",
        businessType: user.profile?.businessType ?? "",
        employees: user.profile?.employees ?? 0,
      })),
    };
  }

  const result = await query<DbAccountRow>(
    `SELECT u.id, u.email, u.password_hash, u.role, u.status, u.created_at,
            b.business_name, b.owner_name, b.phone, b.business_type, b.employees
     FROM users u
     LEFT JOIN businesses b ON b.user_id = u.id
     ORDER BY u.created_at ASC`,
  );

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
      employees: row.employees ?? 0,
    })),
  };
});

export const getAccountByIdFn = createServerFn({ method: "POST" })
  .validator(z.object({ userId: z.string().uuid() }))
  .handler(async ({ data }) => {
    if (!isDatabaseConfigured()) {
      const user = await fileFindUserById(data.userId);
      if (!user) return { account: null };
      return {
        account: {
          id: user.id,
          email: user.email,
          role: user.role,
          status: user.status,
          createdAt: user.createdAt,
          businessName: user.profile?.businessName ?? "",
          ownerName: user.profile?.ownerName ?? "",
          phone: user.profile?.phone ?? "",
          businessType: user.profile?.businessType ?? "",
          employees: user.profile?.employees ?? 0,
        },
      };
    }

    const found = await query<DbAccountRow>(
      `SELECT u.id, u.email, u.password_hash, u.role, u.status, u.created_at,
              b.business_name, b.owner_name, b.phone, b.business_type, b.employees
       FROM users u
       LEFT JOIN businesses b ON b.user_id = u.id
       WHERE u.id = $1
       LIMIT 1`,
      [data.userId],
    );
    const row = found.rows[0];
    if (!row) return { account: null };

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
        employees: row.employees ?? 0,
      },
    };
  });
