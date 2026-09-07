import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import pg from "pg";

const { Pool } = pg;

let pool: pg.Pool | null = null;
let poolConnectionKey: string | undefined;

export type ParsedDatabaseUrl = {
  connectionString: string;
  user: string;
  password: string;
  host: string;
  port: number;
  database: string;
  ssl: boolean;
};

function stripQuotes(value: string) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

function readEnvFileDatabaseUrl(): string | undefined {
  try {
    const contents = readFileSync(path.resolve(process.cwd(), ".env"), "utf8");
    for (const rawLine of contents.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const assignment = line.replace(/^export\s+/, "");
      const eq = assignment.indexOf("=");
      if (eq <= 0) continue;
      const key = assignment.slice(0, eq).trim();
      if (key !== "DATABASE_URL") continue;
      const value = stripQuotes(assignment.slice(eq + 1).trim());
      return value || undefined;
    }
  } catch {
    return undefined;
  }
  return undefined;
}

/**
 * Parse a Postgres URL using the last `@` as the host delimiter so passwords
 * containing `@` or `$` are not truncated. Vite's dotenv-expand will otherwise
 * eat `$…` sequences in unquoted `.env` values.
 */
export function parsePostgresConnectionString(connectionString: string): ParsedDatabaseUrl {
  const trimmed = connectionString.trim();
  const match = trimmed.match(/^(postgres(?:ql)?):\/\/(.+)$/i);
  if (!match) {
    throw new Error("DATABASE_URL must be a postgres:// or postgresql:// connection string.");
  }

  const rest = match[2] ?? "";
  const at = rest.lastIndexOf("@");
  if (at < 0) {
    throw new Error("DATABASE_URL is missing a host.");
  }

  const userinfo = rest.slice(0, at);
  const hostpart = rest.slice(at + 1);
  const colon = userinfo.indexOf(":");
  const user = decodeURIComponent(colon >= 0 ? userinfo.slice(0, colon) : userinfo);
  const password = decodeURIComponent(colon >= 0 ? userinfo.slice(colon + 1) : "");

  const [hostAndPort, ...dbParts] = hostpart.split("/");
  const queryIndex = (hostAndPort ?? "").indexOf("?");
  const hostPort = queryIndex >= 0 ? hostAndPort.slice(0, queryIndex) : hostAndPort;
  const [host, portValue] = (hostPort ?? "").split(":");
  const dbAndQuery = dbParts.join("/");
  const dbName = dbAndQuery.split("?")[0] || "postgres";

  if (!host) {
    throw new Error("DATABASE_URL is missing a host.");
  }

  const ssl = host !== "localhost" && host !== "127.0.0.1";
  const encoded = `${match[1]}://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${hostpart}`;

  return {
    connectionString: encoded,
    user,
    password,
    host,
    port: Number(portValue || 5432),
    database: decodeURIComponent(dbName),
    ssl,
  };
}

export function getDatabaseUrl(): string | undefined {
  // Prefer the on-disk .env value so Vite/dotenv-expand cannot rewrite `$` in the password.
  const fromFile = readEnvFileDatabaseUrl();
  const url = fromFile || process.env.DATABASE_URL?.trim();
  return url || undefined;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(getDatabaseUrl());
}

export function getPool(): pg.Pool {
  const raw = getDatabaseUrl();
  if (!raw) {
    throw new Error(
      "DATABASE_URL is not configured. Set it in .env (local) or Vercel environment variables.",
    );
  }

  const parsed = parsePostgresConnectionString(raw);
  if (!pool || poolConnectionKey !== parsed.connectionString) {
    if (pool) {
      void pool.end().catch(() => undefined);
    }
    poolConnectionKey = parsed.connectionString;
    pool = new Pool({
      user: parsed.user,
      password: parsed.password,
      host: parsed.host,
      port: parsed.port,
      database: parsed.database,
      max: 5,
      ssl: parsed.ssl ? { rejectUnauthorized: false } : undefined,
    });
    pool.on("error", (err) => {
      console.error("[DB] Unexpected pool error:", err.message);
    });
  }
  return pool;
}

export async function query<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<pg.QueryResult<T>> {
  return getPool().query<T>(text, params);
}

export async function withTransaction<T>(fn: (client: pg.PoolClient) => Promise<T>): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
