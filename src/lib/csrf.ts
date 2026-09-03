import { getGlobalStartContext } from "@tanstack/react-start";

export const CSRF_COOKIE_NAME = "csrfToken";
export const CSRF_FIELD_NAME = "csrfToken";
export const CSRF_META_NAME = "csrf-token";

function readMetaToken(): string {
  if (typeof document === "undefined") return "";
  return document.querySelector(`meta[name="${CSRF_META_NAME}"]`)?.getAttribute("content") ?? "";
}

/** CSRF token via SSR context or the document meta tag (HttpOnly cookie is not JS-readable). */
export function getCsrfToken(): string {
  if (typeof window === "undefined") {
    try {
      const fromContext = getGlobalStartContext()?.csrfToken;
      if (typeof fromContext === "string" && fromContext.length > 0) return fromContext;
    } catch {
      // Outside the request lifecycle.
    }
    return "";
  }
  return readMetaToken();
}
