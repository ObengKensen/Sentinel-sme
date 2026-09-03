/**
 * HTTP security headers for Risk Sentinel.
 * Hardened for OWASP ZAP: nonce CSP (no unsafe-inline / unsafe-eval),
 * no-fallback directives, clickjacking, MIME sniffing, referrer leakage.
 */

export type SecurityHeaderRequestInfo = {
  /** Request host (e.g. localhost, 192.168.x.x). */
  hostname?: string;
  /** Request port (e.g. 8080). */
  port?: string;
  /** Per-request CSP nonce (base64). */
  nonce?: string;
};

function buildConnectSrc(info?: SecurityHeaderRequestInfo): string {
  const isDev = process.env.NODE_ENV !== "production";
  if (!isDev) return "connect-src 'self'";

  const hosts = new Set(["localhost", "127.0.0.1"]);
  const ports = new Set(["8080", "8081"]);

  if (info?.hostname) hosts.add(info.hostname);
  if (info?.port) ports.add(info.port);

  const origins = ["'self'"];
  for (const host of hosts) {
    for (const port of ports) {
      origins.push(`ws://${host}:${port}`, `wss://${host}:${port}`);
    }
  }
  return `connect-src ${origins.join(" ")}`;
}

function buildContentSecurityPolicy(info?: SecurityHeaderRequestInfo): string {
  const nonce = info?.nonce;
  const scriptSrc = nonce
    ? `script-src 'nonce-${nonce}' 'strict-dynamic'`
    : "script-src 'self'";
  const styleSrc = nonce
    ? `style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com`
    : "style-src 'self' https://fonts.googleapis.com";

  return [
    "default-src 'self'",
    scriptSrc,
    styleSrc,
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob:",
    buildConnectSrc(info),
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "frame-src 'none'",
  ].join("; ");
}

function requestInfoFromUrl(url: string | undefined): SecurityHeaderRequestInfo | undefined {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    return {
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === "https:" ? "443" : "80"),
    };
  } catch {
    return undefined;
  }
}

export function getSecurityHeaders(info?: SecurityHeaderRequestInfo): Record<string, string> {
  return {
    "Content-Security-Policy": buildContentSecurityPolicy(info),
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Cross-Origin-Opener-Policy": "same-origin",
  };
}

/** Apply hardening headers; keep an existing nonce CSP when already present. */
export function withSecurityHeaders(response: Response, request?: Request): Response {
  const headers = new Headers(response.headers);
  const info = requestInfoFromUrl(request?.url);
  const existingCsp = headers.get("Content-Security-Policy");
  for (const [key, value] of Object.entries(getSecurityHeaders(info))) {
    if (key === "Content-Security-Policy" && existingCsp) continue;
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
