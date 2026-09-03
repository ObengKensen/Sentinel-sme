import { describe, expect, it } from "vitest";
import { renderErrorPage } from "./error-page";

describe("error-page", () => {
  it("renders HTML error page with title and actions", () => {
    const html = renderErrorPage();
    expect(html).toContain("<!doctype html>");
    expect(html).toContain("This page didn't load");
    expect(html).toContain("Try again");
    expect(html).toContain('href="/"');
  });
});
