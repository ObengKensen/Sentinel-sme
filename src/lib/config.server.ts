import process from "node:process";

// Server-only config. The .server.ts suffix keeps Vite out of bundling
// this file into the client — values here never reach the browser.
//
// On Cloudflare Workers, env binds at REQUEST time. Module-scope reads
// (e.g. `const x = process.env.X`) resolve to undefined — always read
// process.env INSIDE a function or handler.
//
// When to use which env-access pattern:
//   - .server.ts module (this file): server-only helpers reused across
//     handlers. Wrap reads in a function so they run per-request.
//   - inline process.env inside a createServerFn handler: one-off reads
//     not reused elsewhere.
//   - import.meta.env.VITE_FOO: PUBLIC config readable on client and
//     server (analytics IDs, public URLs). Define in .env with the
//     VITE_ prefix. Do not place private credentials in VITE_ values.

const DEV_JWT_SECRET = "dev-only-placeholder-replace-via-env";
const PLACEHOLDER_JWT_SECRETS = new Set([
  DEV_JWT_SECRET,
  "change-me-in-production",
]);

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    if (!secret || PLACEHOLDER_JWT_SECRETS.has(secret)) {
      throw new Error(
        "JWT_SECRET must be set to a strong unique value in production (e.g. Vercel project environment variables).",
      );
    }
    return secret;
  }

  return secret && !PLACEHOLDER_JWT_SECRETS.has(secret) ? secret : DEV_JWT_SECRET;
}

export function getServerConfig() {
  return {
    nodeEnv: process.env.NODE_ENV,
    jwtSecretConfigured: Boolean(process.env.JWT_SECRET),
    databaseConfigured: Boolean(process.env.DATABASE_URL?.trim()),
    smtpConfigured: Boolean(
      process.env.SMTP_HOST &&
        process.env.SMTP_USER &&
        (process.env.SMTP_PASS ?? process.env.SMTP_PASSWORD) &&
        (process.env.SMTP_FROM ?? process.env.SMTP_USER),
    ),
  };
}
