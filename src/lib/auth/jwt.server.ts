import { createHmac, timingSafeEqual } from "node:crypto";

import type { UserRole } from "./jwt.shared";
import { JWT_TTL_MS, type JwtClaims } from "./jwt.shared";
import { getJwtSecret } from "../config.server";

function base64UrlEncode(input: string | Buffer): string {
  return Buffer.from(input).toString("base64url");
}

function signSegment(data: string, secret: string): string {
  return createHmac("sha256", secret).update(data).digest("base64url");
}

export async function signAuthToken(claims: {
  userId: string;
  email: string;
  role: UserRole;
}): Promise<string> {
  const secret = getJwtSecret();
  const now = Math.floor(Date.now() / 1000);
  const payload: JwtClaims = {
    sub: claims.userId,
    email: claims.email,
    role: claims.role,
    iat: now,
    exp: now + Math.floor(JWT_TTL_MS / 1000),
  };

  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64UrlEncode(JSON.stringify(payload));
  const unsigned = `${header}.${body}`;
  const signature = signSegment(unsigned, secret);
  return `${unsigned}.${signature}`;
}

export async function verifyAuthToken(token: string): Promise<JwtClaims | null> {
  try {
    const secret = getJwtSecret();
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;
    const unsigned = `${headerB64}.${payloadB64}`;
    const expected = signSegment(unsigned, secret);

    const a = Buffer.from(signatureB64 ?? "");
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

    const payload = JSON.parse(
      Buffer.from(payloadB64!.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"),
    ) as Partial<JwtClaims>;

    if (
      typeof payload.sub !== "string" ||
      typeof payload.email !== "string" ||
      (payload.role !== "SME_OWNER" && payload.role !== "SUPER_ADMIN") ||
      typeof payload.exp !== "number" ||
      typeof payload.iat !== "number"
    ) {
      return null;
    }

    if (payload.exp <= Math.floor(Date.now() / 1000)) return null;

    return payload as JwtClaims;
  } catch {
    return null;
  }
}
