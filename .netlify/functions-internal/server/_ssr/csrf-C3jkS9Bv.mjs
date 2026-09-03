import { getStartContext } from "./server-DpwYz346.mjs";
var getGlobalStartContext = () => {
  const context = getStartContext().contextAfterGlobalMiddlewares;
  if (!context) throw new Error(`Global context not set yet, you are calling getGlobalStartContext() before the global middlewares are applied.`);
  return context;
};
const CSRF_COOKIE_NAME = "csrfToken";
const CSRF_FIELD_NAME = "csrfToken";
const CSRF_META_NAME = "csrf-token";
function readMetaToken() {
  if (typeof document === "undefined") return "";
  return document.querySelector(`meta[name="${CSRF_META_NAME}"]`)?.getAttribute("content") ?? "";
}
function getCsrfToken() {
  if (typeof window === "undefined") {
    try {
      const fromContext = getGlobalStartContext()?.csrfToken;
      if (typeof fromContext === "string" && fromContext.length > 0) return fromContext;
    } catch {
    }
    return "";
  }
  return readMetaToken();
}
export {
  CSRF_META_NAME as C,
  getCsrfToken as a,
  CSRF_COOKIE_NAME as b,
  CSRF_FIELD_NAME as c,
  getGlobalStartContext as g
};
