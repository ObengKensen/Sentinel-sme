import { beforeEach, describe, expect, it, vi } from "vitest";

import { getAuthBackendStatusFn } from "@/lib/api/account.functions";
import { isRemoteAuthEnabled, resetRemoteAuthCache } from "./remote-auth";

describe("isRemoteAuthEnabled", () => {
  beforeEach(() => {
    resetRemoteAuthCache();
    vi.mocked(getAuthBackendStatusFn).mockReset();
  });

  it("does not cache a failed backend check", async () => {
    vi.mocked(getAuthBackendStatusFn)
      .mockResolvedValueOnce({ available: false, mode: "none" })
      .mockResolvedValueOnce({ available: true, mode: "shared-file" });

    expect(await isRemoteAuthEnabled()).toBe(false);
    expect(await isRemoteAuthEnabled()).toBe(true);
  });

  it("caches a successful backend check", async () => {
    vi.mocked(getAuthBackendStatusFn).mockResolvedValue({
      available: true,
      mode: "shared-file",
    });

    expect(await isRemoteAuthEnabled()).toBe(true);
    expect(await isRemoteAuthEnabled()).toBe(true);
    expect(getAuthBackendStatusFn).toHaveBeenCalledTimes(1);
  });
});