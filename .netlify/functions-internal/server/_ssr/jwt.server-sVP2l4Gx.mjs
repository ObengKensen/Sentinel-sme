import { createHmac, timingSafeEqual } from "node:crypto";
import { J as JWT_TTL_MS } from "./jwt.shared-gMsek6D_.mjs";
import process from "node:process";
const DEV_JWT_SECRET = "dev-only-placeholder-replace-via-env";
const PLACEHOLDER_JWT_SECRETS = /* @__PURE__ */ new Set([
  DEV_JWT_SECRET,
  "change-me-in-production"
]);
function getJwtSecret() {
  const secret = process.env.JWT_SECRET?.trim();
  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction) {
    if (!secret || PLACEHOLDER_JWT_SECRETS.has(secret)) {
      throw new Error(
        "JWT_SECRET must be set to a strong unique value in production (e.g. Vercel project environment variables)."
      );
    }
    return secret;
  }
  return secret && !PLACEHOLDER_JWT_SECRETS.has(secret) ? secret : DEV_JWT_SECRET;
}
function base64UrlEncode(input) {
  return Buffer.from(input).toString("base64url");
}
function signSegment(data, secret) {
  return createHmac("sha256", secret).update(data).digest("base64url");
}
async function signAuthToken(claims) {
  const secret = getJwtSecret();
  const now = Math.floor(Date.now() / 1e3);
  const payload = {
    sub: claims.userId,
    email: claims.email,
    role: claims.role,
    iat: now,
    exp: now + Math.floor(JWT_TTL_MS / 1e3)
  };
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64UrlEncode(JSON.stringify(payload));
  const unsigned = `${header}.${body}`;
  const signature = signSegment(unsigned, secret);
  return `${unsigned}.${signature}`;
}
async function verifyAuthToken(token) {
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
      Buffer.from(payloadB64.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8")
    );
    if (typeof payload.sub !== "string" || typeof payload.email !== "string" || payload.role !== "SME_OWNER" && payload.role !== "SUPER_ADMIN" || typeof payload.exp !== "number" || typeof payload.iat !== "number") {
      return null;
    }
    if (payload.exp <= Math.floor(Date.now() / 1e3)) return null;
    return payload;
  } catch {
    return null;
  }
}
export {
  signAuthToken as s,
  verifyAuthToken as v
};
