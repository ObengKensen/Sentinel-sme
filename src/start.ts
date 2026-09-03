import { randomBytes } from "node:crypto";

import {
  createStart,
  createMiddleware,
  createCsrfMiddleware,
} from "@tanstack/react-start";
import { setCookie, setResponseHeaders } from "@tanstack/react-start/server";

import { CSRF_COOKIE_NAME } from "./lib/csrf";
import { renderErrorPage } from "./lib/error-page";
import { getSecurityHeaders, withSecurityHeaders } from "./lib/security-headers";

const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

const securityHeadersMiddleware = createMiddleware().server(async ({ next, request }) => {
  const nonce = randomBytes(16).toString("base64");
  const csrfToken = randomBytes(32).toString("hex");

  let hostname: string | undefined;
  let port: string | undefined;
  try {
    const url = new URL(request.url);
    hostname = url.hostname;
    port = url.port || (url.protocol === "https:" ? "443" : "80");
  } catch {
    // ignore malformed URL
  }

  // HttpOnly so scripts cannot read it (fixes ZAP Cookie No HttpOnly Flag).
  // Form fields use the twin value via SSR context / meta tag instead.
  // Do not set Domain — host-only cookies avoid "Loosely Scoped Cookie".
  setCookie(CSRF_COOKIE_NAME, csrfToken, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });

  setResponseHeaders(
    getSecurityHeaders({
      hostname,
      port,
      nonce,
    }),
  );

  return next({
    context: { nonce, csrfToken },
  });
});

const errorMiddleware = createMiddleware().server(async ({ next, request }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return withSecurityHeaders(
      new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      }),
      request,
    );
  }
});

export const startInstance = createStart(() => ({
  requestMiddleware: [securityHeadersMiddleware, csrfMiddleware, errorMiddleware],
}));
