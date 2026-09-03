import { describe, expect, it, beforeEach } from "vitest";
import {
  normalizeEmail,
  hashPassword,
  verifyPassword,
  registerUser,
  loginUser,
  resetPassword,
  changePassword,
  getEmailRegistrationConflict,
  isEmailRegistered,
  getUserByEmail,
  getAllUsers,
  seedSuperAdmin,
  clearSession,
  getSession,
  isAuthenticated,
  resetAuthModuleState,
  SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_PASSWORD,
  EMAIL_ALREADY_EXISTS_ERROR,
} from "./auth";

describe("auth utilities", () => {
  beforeEach(() => {
    resetAuthModuleState();
    localStorage.clear();
  });

  describe("normalizeEmail", () => {
    it("trims and lowercases email", () => {
      expect(normalizeEmail("  User@Example.COM  ")).toBe("user@example.com");
    });
  });

  describe("hashPassword / verifyPassword", () => {
    it("hashes and verifies passwords with salt", async () => {
      const salt = "test-salt-uuid";
      const hash = await hashPassword("secret123", salt);
      expect(hash).toHaveLength(64);
      expect(await verifyPassword("secret123", salt, hash)).toBe(true);
      expect(await verifyPassword("wrong", salt, hash)).toBe(false);
    });
  });

  describe("registerUser", () => {
    it("registers a new SME owner", async () => {
      const result = await registerUser("owner@test.com", "password1");
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.role).toBe("SME_OWNER");
        expect(result.email).toBe("owner@test.com");
      }
      expect(getUserByEmail("owner@test.com")).toBeDefined();
      expect(isAuthenticated()).toBe(true);
    });

    it("rejects short passwords", async () => {
      const result = await registerUser("owner@test.com", "12345");
      expect(result).toEqual({ ok: false, error: "Password must be at least 6 characters." });
    });

    it("rejects duplicate email", async () => {
      await registerUser("dup@test.com", "password1");
      clearSession();
      const result = await registerUser("dup@test.com", "password2");
      expect(result).toEqual({ ok: false, error: EMAIL_ALREADY_EXISTS_ERROR });
    });
  });

  describe("loginUser", () => {
    it("logs in with valid credentials", async () => {
      await registerUser("login@test.com", "password1");
      clearSession();
      const result = await loginUser("login@test.com", "password1");
      expect(result.ok).toBe(true);
      expect(isAuthenticated()).toBe(true);
    });

    it("rejects invalid credentials", async () => {
      await registerUser("login@test.com", "password1");
      clearSession();
      const result = await loginUser("login@test.com", "wrongpass");
      expect(result).toEqual({ ok: false, error: "Invalid email or password." });
    });

    it("logs in super admin with seeded credentials", async () => {
      await seedSuperAdmin();
      clearSession();
      const result = await loginUser(SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD);
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.role).toBe("SUPER_ADMIN");
    });
  });

  describe("resetPassword", () => {
    it("resets password for existing user", async () => {
      await registerUser("reset@test.com", "oldpass1");
      clearSession();
      const result = await resetPassword("reset@test.com", "newpass1");
      expect(result.ok).toBe(true);
      const login = await loginUser("reset@test.com", "newpass1");
      expect(login.ok).toBe(true);
    });

    it("returns error for unknown email", async () => {
      const result = await resetPassword("nobody@test.com", "newpass1");
      expect(result).toEqual({ ok: false, error: "No account found with that email." });
    });
  });

  describe("changePassword", () => {
    it("changes password when current password is correct", async () => {
      const reg = await registerUser("change@test.com", "oldpass1");
      expect(reg.ok).toBe(true);
      if (!reg.ok) return;
      const result = await changePassword(reg.userId, "oldpass1", "newpass1");
      expect(result.ok).toBe(true);
      clearSession();
      const login = await loginUser("change@test.com", "newpass1");
      expect(login.ok).toBe(true);
    });
  });

  describe("email registration conflict", () => {
    it("detects existing email", async () => {
      await registerUser("exists@test.com", "password1");
      expect(getEmailRegistrationConflict("exists@test.com")).toBe("exists");
      expect(isEmailRegistered("exists@test.com")).toBe(true);
    });

    it("returns null for new email", () => {
      expect(getEmailRegistrationConflict("new@test.com")).toBeNull();
    });
  });

  describe("session management", () => {
    it("clears session on logout", async () => {
      await registerUser("session@test.com", "password1");
      expect(getSession()).not.toBeNull();
      clearSession();
      expect(getSession()).toBeNull();
      expect(isAuthenticated()).toBe(false);
    });
  });

  describe("seedSuperAdmin", () => {
    it("seeds super admin only once", async () => {
      await seedSuperAdmin();
      const countBefore = getAllUsers().length;
      await seedSuperAdmin();
      expect(getAllUsers().length).toBe(countBefore);
      expect(getUserByEmail(SUPER_ADMIN_EMAIL)?.role).toBe("SUPER_ADMIN");
    });
  });
});
