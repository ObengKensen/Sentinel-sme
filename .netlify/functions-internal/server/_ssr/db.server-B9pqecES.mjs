import process from "node:process";
import { p as pg } from "../_libs/pg.mjs";
const { Pool } = pg;
let pool = null;
function getDatabaseUrl() {
  const url = process.env.DATABASE_URL?.trim();
  return url || void 0;
}
function isDatabaseConfigured() {
  return Boolean(getDatabaseUrl());
}
function getPool() {
  const connectionString = getDatabaseUrl();
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not configured. Set it in .env (local) or Vercel environment variables."
    );
  }
  if (!pool) {
    pool = new Pool({
      connectionString,
      // Serverless-friendly: keep the pool tiny.
      max: 5,
      ssl: connectionString.includes("localhost") ? void 0 : { rejectUnauthorized: false }
    });
    pool.on("error", (err) => {
      console.error("[DB] Unexpected pool error:", err.message);
    });
  }
  return pool;
}
async function query(text, params) {
  return getPool().query(text, params);
}
async function withTransaction(fn) {
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
export {
  isDatabaseConfigured as i,
  query as q,
  withTransaction as w
};
