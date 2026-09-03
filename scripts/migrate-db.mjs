import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import pg from "pg";

const connectionString = process.env.DATABASE_URL?.trim();
if (!connectionString) {
  console.error("DATABASE_URL is required. Set it in your environment or .env file.");
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(__dirname, "../sql/schema.sql");
const sql = fs.readFileSync(schemaPath, "utf8");

const pool = new pg.Pool({
  connectionString,
  ssl: connectionString.includes("localhost") ? undefined : { rejectUnauthorized: false },
});

const client = await pool.connect();
try {
  await client.query("BEGIN");
  await client.query(sql);
  await client.query("COMMIT");
  console.log("[DB] Migration completed successfully.");
} catch (error) {
  await client.query("ROLLBACK");
  console.error("[DB] Migration failed:", error);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
