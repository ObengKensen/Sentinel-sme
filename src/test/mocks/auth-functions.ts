import { vi } from "vitest";
import { decodeJwtPayload, type UserRole } from "@/lib/auth/jwt.shared";

export function createMockToken(claims: { userId: string; email: string; role: UserRole }) {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const payload = btoa(
    JSON.stringify({
      sub: claims.userId,
      email: claims.email,
      role: claims.role,
      iat: now,
      exp: now + 30 * 24 * 60 * 60,
    }),
  );
  return `${header}.${payload}.mock-signature`;
}

export const issueAuthTokenFn = vi.fn(
  async ({ data }: { data: { userId: string; email: string; role: UserRole } }) => ({
    token: createMockToken(data),
  }),
);

export const verifyAuthTokenFn = vi.fn(async ({ data }: { data: { token: string } }) => {
  const claims = decodeJwtPayload(data.token);
  if (!claims) return { ok: false as const };
  return {
    ok: true as const,
    userId: claims.sub,
    email: claims.email,
    role: claims.role,
    expiresAt: claims.exp * 1000,
  };
});
