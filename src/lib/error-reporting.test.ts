import { describe, expect, it, vi } from "vitest";
import { reportError } from "./error-reporting";

describe("error-reporting", () => {
  it("logs errors to console in browser", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    reportError(new Error("test"), { page: "login" });
    expect(spy).toHaveBeenCalledWith(expect.any(Error), { page: "login" });
    spy.mockRestore();
  });
});
