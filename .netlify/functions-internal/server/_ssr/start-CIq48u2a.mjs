import { randomBytes } from "node:crypto";
import { createMiddleware, createCsrfMiddleware, setCookie, setResponseHeaders } from "./server-DpwYz346.mjs";
import { b as CSRF_COOKIE_NAME } from "./csrf-C3jkS9Bv.mjs";
import { getSecurityHeaders, withSecurityHeaders, renderErrorPage } from "./index.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
function dedupeSerializationAdapters(deduped, serializationAdapters) {
  for (let i = 0, len = serializationAdapters.length; i < len; i++) {
    const current = serializationAdapters[i];
    if (!deduped.has(current)) {
      deduped.add(current);
      if (current.extends) dedupeSerializationAdapters(deduped, current.extends);
    }
  }
}
var createStart = (getOptions) => {
  return {
    getOptions: async () => {
      const options = await getOptions();
      if (options.serializationAdapters) {
        const deduped = /* @__PURE__ */ new Set();
        dedupeSerializationAdapters(deduped, options.serializationAdapters);
        options.serializationAdapters = Array.from(deduped);
      }
      return options;
    },
    createMiddleware
  };
};
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn"
});
const securityHeadersMiddleware = createMiddleware().server(async ({ next, request }) => {
  const nonce = randomBytes(16).toString("base64");
  const csrfToken = randomBytes(32).toString("hex");
  let hostname;
  let port;
  try {
    const url = new URL(request.url);
    hostname = url.hostname;
    port = url.port || (url.protocol === "https:" ? "443" : "80");
  } catch {
  }
  setCookie(CSRF_COOKIE_NAME, csrfToken, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    secure: true
  });
  setResponseHeaders(
    getSecurityHeaders({
      nonce
    })
  );
  return next({
    context: { nonce, csrfToken }
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
        headers: { "content-type": "text/html; charset=utf-8" }
      }),
      request
    );
  }
});
const startInstance = createStart(() => ({
  requestMiddleware: [securityHeadersMiddleware, csrfMiddleware, errorMiddleware]
}));
export {
  startInstance
};
