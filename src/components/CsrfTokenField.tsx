import { CSRF_FIELD_NAME, getCsrfToken } from "@/lib/csrf";

/** Hidden anti-CSRF field recognized by OWASP ZAP (`csrfToken`). */
export function CsrfTokenField() {
  const token = getCsrfToken();
  if (!token) return null;
  return <input type="hidden" name={CSRF_FIELD_NAME} id={CSRF_FIELD_NAME} value={token} />;
}
