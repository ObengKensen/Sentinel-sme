import { describe, expect, it, beforeEach } from "vitest";
import { resetAllApplicationData, USERS_STORAGE_KEY } from "./reset-app-data";
import { registerUser, resetAuthModuleState, SUPER_ADMIN_EMAIL } from "./auth";

describe("reset-app-data", () => {
  beforeEach(() => {
    resetAuthModuleState();
    localStorage.clear();
  });

  it("wipes accounts and re-seeds super admin", async () => {
    await registerUser("wipe@test.com", "password1");
    expect(localStorage.getItem(USERS_STORAGE_KEY)).toBeTruthy();

    const result = await resetAllApplicationData();
    expect(result.superAdminReseeded).toBe(true);
    expect(result.removedAccounts).toBeGreaterThanOrEqual(1);
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) ?? "[]") as { email: string }[];
    expect(users.some((u) => u.email === SUPER_ADMIN_EMAIL)).toBe(true);
    expect(users.some((u) => u.email === "wipe@test.com")).toBe(false);
  });

  it("returns zero counts on server (no window)", async () => {
    const originalWindow = global.window;
    // @ts-expect-error simulate SSR
    delete global.window;
    const result = await resetAllApplicationData();
    expect(result.removedAccounts).toBe(0);
    global.window = originalWindow;
  });
});
