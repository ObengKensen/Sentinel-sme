/** localStorage key for the signed JWT (replaces legacy `srs:session:v1`). */
export const JWT_STORAGE_KEY = "srs:jwt:v1";
export const LEGACY_SESSION_KEY = "srs:session:v1";

export type UserRole = "SME_OWNER" | "SUPER_ADMIN";

/** Default access-token lifetime: 30 days. */
export const JWT_TTL_MS = 30 * 24 * 60 * 60 * 1000;

/** Refresh when less than 7 days remain. */
export const JWT_REFRESH_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000;

export type JwtClaims = {
  sub: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
};

export type AuthSession = {
  userId: string;
  email: string;
  role: UserRole;
  expiresAt: number;
};

function base64UrlDecode(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  if (typeof atob === "function") {
    return atob(padded + pad);
  }
  return Buffer.from(padded + pad, "base64").toString("utf8");
}

/** Decode JWT payload without signature verification (client-side UX only). */
export function decodeJwtPayload(token: string): JwtClaims | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(base64UrlDecode(parts[1]!)) as Partial<JwtClaims>;
    if (
      typeof payload.sub !== "string" ||
      typeof payload.email !== "string" ||
      (payload.role !== "SME_OWNER" && payload.role !== "SUPER_ADMIN") ||
      typeof payload.exp !== "number"
    ) {
      return null;
    }
    return payload as JwtClaims;
  } catch {
    return null;
  }
}

export function claimsToSession(claims: JwtClaims): AuthSession {
  return {
    userId: claims.sub,
    email: claims.email,
    role: claims.role,
    expiresAt: claims.exp * 1000,
  };
}

export function sessionFromToken(token: string): AuthSession | null {
  const claims = decodeJwtPayload(token);
  if (!claims) return null;
  if (claims.exp * 1000 <= Date.now()) return null;
  return claimsToSession(claims);
}
