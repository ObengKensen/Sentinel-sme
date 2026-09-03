import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  fileCreateUser,
  fileFindUserByEmail,
  fileFindUserById,
  fileUpdateUser,
  setFileAccountStorePath,
} from "./local-account-store.server";

describe("local account store", () => {
  let dir: string;

  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), "srs-accounts-"));
    setFileAccountStorePath(path.join(dir, "accounts.json"));
  });

  afterEach(async () => {
    setFileAccountStorePath(null);
    await rm(dir, { recursive: true, force: true });
  });

  it("creates and finds a user by email", async () => {
    const created = await fileCreateUser({
      email: "Owner@Example.com",
      passwordHash: "hash",
      role: "SME_OWNER",
      profile: {
        businessName: "Acme",
        ownerName: "Ada",
        phone: "",
        businessType: "Retail",
        employees: 3,
      },
    });

    expect(created.email).toBe("owner@example.com");
    expect(created.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    await expect(fileFindUserByEmail("owner@example.com")).resolves.toMatchObject({
      id: created.id,
      email: "owner@example.com",
    });
    await expect(fileFindUserById(created.id)).resolves.toMatchObject({ id: created.id });
  });

  it("rejects a duplicate email", async () => {
    await fileCreateUser({
      email: "dup@test.com",
      passwordHash: "hash",
      role: "SME_OWNER",
    });
    await expect(
      fileCreateUser({
        email: "dup@test.com",
        passwordHash: "other",
        role: "SME_OWNER",
      }),
    ).rejects.toThrow("EMAIL_EXISTS");
  });

  it("updates a stored password hash", async () => {
    const created = await fileCreateUser({
      email: "change@test.com",
      passwordHash: "old",
      role: "SME_OWNER",
    });
    const updated = await fileUpdateUser(created.id, { passwordHash: "new" });
    expect(updated?.passwordHash).toBe("new");
  });
});