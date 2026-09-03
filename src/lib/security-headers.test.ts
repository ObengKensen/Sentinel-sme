import { describe, expect, it } from "vitest";

import { getSecurityHeaders, withSecurityHeaders } from "./security-headers";

describe("security headers", () => {
  it("defines CSP directives that do not fall back to default-src", () => {
    const csp = getSecurityHeaders({ nonce: "testnonce" })["Content-Security-Policy"];
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'self'");
    expect(csp).toContain("form-action 'self'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("object-src 'none'");
  });

  it("uses nonces and contains no unsafe-inline or unsafe-eval", () => {
    const csp = getSecurityHeaders({ nonce: "abc123" })["Content-Security-Policy"];
    expect(csp).toContain("script-src 'nonce-abc123' 'strict-dynamic'");
    expect(csp).toContain("style-src 'self' 'nonce-abc123' https://fonts.googleapis.com");
    expect(csp).not.toContain("unsafe-eval");
    expect(csp).not.toContain("unsafe-inline");
  });

  it("does not use bare scheme wildcards in connect-src", () => {
    const csp = getSecurityHeaders({ hostname: "localhost", port: "8080", nonce: "n" })[
      "Content-Security-Policy"
    ];
    const connect = (csp.split(";").find((part) => part.trim().startsWith("connect-src")) ?? "")
      .trim()
      .split(/\s+/);
    expect(connect).toContain("ws://localhost:8080");
    expect(connect).not.toContain("ws:");
    expect(connect).not.toContain("wss:");
  });

  it("preserves an existing Content-Security-Policy when merging headers", () => {
    const secured = withSecurityHeaders(
      new Response("ok", {
        status: 200,
        headers: { "Content-Security-Policy": "default-src 'none'" },
      }),
      new Request("http://localhost:8080/"),
    );
    expect(secured.headers.get("Content-Security-Policy")).toBe("default-src 'none'");
    expect(secured.headers.get("X-Content-Type-Options")).toBe("nosniff");
  });
});
