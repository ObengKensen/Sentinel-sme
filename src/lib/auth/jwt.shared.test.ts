import { describe, expect, it } from "vitest";
import {
  claimsToSession,
  decodeJwtPayload,
  sessionFromToken,
  JWT_TTL_MS,
} from "./jwt.shared";
import { createMockToken } from "@/test/mocks/auth-functions";

describe("jwt.shared", () => {
  it("decodes a valid mock JWT payload", () => {
    const token = createMockToken({
      userId: "user-1",
      email: "user@test.com",
      role: "SME_OWNER",
    });
    const claims = decodeJwtPayload(token);
    expect(claims).not.toBeNull();
    expect(claims?.sub).toBe("user-1");
    expect(claims?.email).toBe("user@test.com");
    expect(claims?.role).toBe("SME_OWNER");
  });

  it("returns null for malformed tokens", () => {
    expect(decodeJwtPayload("not-a-jwt")).toBeNull();
    expect(decodeJwtPayload("a.b")).toBeNull();
  });

  it("converts claims to session", () => {
    const now = Math.floor(Date.now() / 1000);
    const session = claimsToSession({
      sub: "user-1",
      email: "user@test.com",
      role: "SME_OWNER",
      iat: now,
      exp: now + Math.floor(JWT_TTL_MS / 1000),
    });
    expect(session.userId).toBe("user-1");
    expect(session.expiresAt).toBeGreaterThan(Date.now());
  });

  it("sessionFromToken returns null for expired tokens", () => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(
      JSON.stringify({
        sub: "user-1",
        email: "user@test.com",
        role: "SME_OWNER",
        iat: 0,
        exp: 1,
      }),
    );
    const token = `${header}.${payload}.sig`;
    expect(sessionFromToken(token)).toBeNull();
  });

  it("sessionFromToken returns session for valid token", () => {
    const token = createMockToken({
      userId: "user-1",
      email: "user@test.com",
      role: "SUPER_ADMIN",
    });
    const session = sessionFromToken(token);
    expect(session?.role).toBe("SUPER_ADMIN");
  });

  it("decodeJwtPayload rejects invalid roles", () => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(
      JSON.stringify({
        sub: "user-1",
        email: "user@test.com",
        role: "ADMIN",
        exp: Math.floor(Date.now() / 1000) + 3600,
      }),
    );
    expect(decodeJwtPayload(`${header}.${payload}.sig`)).toBeNull();
  });

  it("claimsToSession maps exp to milliseconds", () => {
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const session = claimsToSession({
      sub: "user-1",
      email: "user@test.com",
      role: "SME_OWNER",
      iat: exp - 3600,
      exp,
    });
    expect(session.expiresAt).toBe(exp * 1000);
  });
});
