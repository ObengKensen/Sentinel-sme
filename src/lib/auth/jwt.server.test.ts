import { describe, expect, it, vi, afterEach } from "vitest";
import { JWT_TTL_MS } from "./jwt.shared";
import { signAuthToken, verifyAuthToken } from "./jwt.server";

describe("jwt.server", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("signs and verifies a valid SME token round-trip", async () => {
    const token = await signAuthToken({
      userId: "user-1",
      email: "user@test.com",
      role: "SME_OWNER",
    });
    const claims = await verifyAuthToken(token);
    expect(claims).not.toBeNull();
    expect(claims?.sub).toBe("user-1");
    expect(claims?.email).toBe("user@test.com");
    expect(claims?.role).toBe("SME_OWNER");
    expect(claims?.exp).toBeGreaterThan(claims!.iat);
  });

  it("signs and verifies a super admin token", async () => {
    const token = await signAuthToken({
      userId: "admin-1",
      email: "admin@test.com",
      role: "SUPER_ADMIN",
    });
    const claims = await verifyAuthToken(token);
    expect(claims?.role).toBe("SUPER_ADMIN");
  });

  it("rejects tokens with invalid signatures", async () => {
    const token = await signAuthToken({
      userId: "user-1",
      email: "user@test.com",
      role: "SME_OWNER",
    });
    const tampered = `${token.slice(0, -4)}xxxx`;
    expect(await verifyAuthToken(tampered)).toBeNull();
  });

  it("rejects expired tokens", async () => {
    vi.useFakeTimers();
    const token = await signAuthToken({
      userId: "user-1",
      email: "user@test.com",
      role: "SME_OWNER",
    });
    vi.advanceTimersByTime(JWT_TTL_MS + 1000);
    expect(await verifyAuthToken(token)).toBeNull();
  });

  it("rejects malformed tokens", async () => {
    expect(await verifyAuthToken("not-a-jwt")).toBeNull();
    expect(await verifyAuthToken("a.b")).toBeNull();
    expect(await verifyAuthToken("")).toBeNull();
  });

  it("rejects tokens with invalid payload shape", async () => {
    const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
    const payload = Buffer.from(
      JSON.stringify({
        sub: "user-1",
        email: "user@test.com",
        role: "INVALID",
        iat: 1,
        exp: 9999999999,
      }),
    ).toString("base64url");
    const token = `${header}.${payload}.invalid-signature`;
    expect(await verifyAuthToken(token)).toBeNull();
  });
});
