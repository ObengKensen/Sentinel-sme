const JWT_STORAGE_KEY = "srs:jwt:v1";
const LEGACY_SESSION_KEY = "srs:session:v1";
const JWT_TTL_MS = 30 * 24 * 60 * 60 * 1e3;
const JWT_REFRESH_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1e3;
function base64UrlDecode(input) {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - padded.length % 4);
  if (typeof atob === "function") {
    return atob(padded + pad);
  }
  return Buffer.from(padded + pad, "base64").toString("utf8");
}
function decodeJwtPayload(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    if (typeof payload.sub !== "string" || typeof payload.email !== "string" || payload.role !== "SME_OWNER" && payload.role !== "SUPER_ADMIN" || typeof payload.exp !== "number") {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
function claimsToSession(claims) {
  return {
    userId: claims.sub,
    email: claims.email,
    role: claims.role,
    expiresAt: claims.exp * 1e3
  };
}
function sessionFromToken(token) {
  const claims = decodeJwtPayload(token);
  if (!claims) return null;
  if (claims.exp * 1e3 <= Date.now()) return null;
  return claimsToSession(claims);
}
export {
  JWT_TTL_MS as J,
  LEGACY_SESSION_KEY as L,
  JWT_REFRESH_THRESHOLD_MS as a,
  JWT_STORAGE_KEY as b,
  sessionFromToken as s
};
