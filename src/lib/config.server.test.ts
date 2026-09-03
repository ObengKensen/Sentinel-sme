import { afterEach, describe, expect, it } from "vitest";

import { getJwtSecret } from "./config.server";

describe("getJwtSecret", () => {
  const originalEnv = process.env.NODE_ENV;
  const originalSecret = process.env.JWT_SECRET;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    if (originalSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = originalSecret;
  });

  it("uses the configured secret in development", () => {
    process.env.NODE_ENV = "development";
    process.env.JWT_SECRET = "local-dev-secret";
    expect(getJwtSecret()).toBe("local-dev-secret");
  });

  it("falls back to the dev placeholder when unset outside production", () => {
    process.env.NODE_ENV = "test";
    delete process.env.JWT_SECRET;
    expect(getJwtSecret()).toBe("dev-only-placeholder-replace-via-env");
  });

  it("throws in production when JWT_SECRET is missing", () => {
    process.env.NODE_ENV = "production";
    delete process.env.JWT_SECRET;
    expect(() => getJwtSecret()).toThrow(/JWT_SECRET must be set/);
  });

  it("throws in production when JWT_SECRET is still the example placeholder", () => {
    process.env.NODE_ENV = "production";
    process.env.JWT_SECRET = "change-me-in-production";
    expect(() => getJwtSecret()).toThrow(/JWT_SECRET must be set/);
  });

  it("accepts a real secret in production", () => {
    process.env.NODE_ENV = "production";
    process.env.JWT_SECRET = "prod-secret-value-not-a-placeholder";
    expect(getJwtSecret()).toBe("prod-secret-value-not-a-placeholder");
  });
});
