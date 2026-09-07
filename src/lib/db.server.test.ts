import { describe, expect, it } from "vitest";

import { parsePostgresConnectionString } from "./db.server";

describe("parsePostgresConnectionString", () => {
  it("keeps $ and @ inside the password", () => {
    const parsed = parsePostgresConnectionString(
      "postgresql://postgres.project:p$x@ss@aws-1-eu-west-1.pooler.supabase.com:6543/postgres",
    );

    expect(parsed.user).toBe("postgres.project");
    expect(parsed.password).toBe("p$x@ss");
    expect(parsed.host).toBe("aws-1-eu-west-1.pooler.supabase.com");
    expect(parsed.port).toBe(6543);
    expect(parsed.database).toBe("postgres");
    expect(parsed.ssl).toBe(true);
    expect(parsed.connectionString).toContain("%24");
    expect(parsed.connectionString).toContain("%40");
  });

  it("disables SSL for localhost", () => {
    const parsed = parsePostgresConnectionString("postgres://app:secret@localhost:5432/appdb");
    expect(parsed.ssl).toBe(false);
    expect(parsed.database).toBe("appdb");
  });
});
