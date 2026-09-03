import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockNavigate } from "@/test/utils";
import { routerState } from "@/test/mocks/tanstack-router-state";
import { toast } from "sonner";
import { Route } from "./login";
import {
  isAuthenticated,
  loginUser,
  registerUser,
  resetAuthModuleState,
  seedSuperAdmin,
  SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_PASSWORD,
} from "@/lib/auth";
import { isPostLogoutLoginVisit, store } from "@/lib/risk-store";

import React from "react";

// Route.options.component can be undefined in the route typing; assert it is a
// valid React component for the tests.
const LoginPage = Route.options.component as React.ComponentType<any>;
const runLoginBeforeLoad = () => (Route.options.beforeLoad as () => Promise<void>)();

describe("login beforeLoad", () => {
  beforeEach(() => {
    resetAuthModuleState();
    localStorage.clear();
  });

  it("redirects authenticated SME users to the app dashboard", async () => {
    await registerUser("authed@test.com", "password1");
    await expect(runLoginBeforeLoad()).rejects.toEqual({ to: "/app/dashboard" });
  });

  it("redirects authenticated super admin to the admin dashboard", async () => {
    await seedSuperAdmin();
    await loginUser(SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD);
    await expect(runLoginBeforeLoad()).rejects.toEqual({ to: "/admin/dashboard" });
  });

  it("clears session on post-logout visit without redirecting", async () => {
    await registerUser("post-logout@test.com", "password1");
    store.logout();
    expect(isPostLogoutLoginVisit()).toBe(true);
    await expect(runLoginBeforeLoad()).resolves.toBeUndefined();
    expect(isAuthenticated()).toBe(false);
    expect(isPostLogoutLoginVisit()).toBe(true);
  });
});

describe("LoginPage", () => {
  beforeEach(async () => {
    routerState.pathname = "/login";
    resetAuthModuleState();
    localStorage.clear();
    vi.mocked(toast.error).mockClear();
    vi.mocked(toast.success).mockClear();
    mockNavigate.mockClear();
    await registerUser("existing@test.com", "password1");
    resetAuthModuleState();
    localStorage.clear();
    await registerUser("existing@test.com", "password1");
  });

  it("renders login form", () => {
    render(<LoginPage />);
    expect(screen.getByRole("heading", { name: "Welcome back" })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  it("shows error on invalid credentials", async () => {
    const user = userEvent.setup({ delay: null });
    render(<LoginPage />);
    await user.type(screen.getByLabelText("Email"), "existing@test.com");
    await user.type(screen.getByLabelText("Password"), "wrongpass");
    await user.click(screen.getByRole("button", { name: "Login" }));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid email or password.");
    });
  });

  it("navigates to dashboard on successful login", async () => {
    const user = userEvent.setup({ delay: null });
    render(<LoginPage />);
    await user.type(screen.getByLabelText("Email"), "existing@test.com");
    await user.type(screen.getByLabelText("Password"), "password1");
    await user.click(screen.getByRole("button", { name: "Login" }));
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Welcome back!");
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/app/dashboard" });
    });
  });

  it("navigates to admin dashboard on super admin login", async () => {
    resetAuthModuleState();
    localStorage.clear();
    await seedSuperAdmin();
    const user = userEvent.setup({ delay: null });
    render(<LoginPage />);
    await user.type(screen.getByLabelText("Email"), SUPER_ADMIN_EMAIL);
    await user.type(screen.getByLabelText("Password"), SUPER_ADMIN_PASSWORD);
    await user.click(screen.getByRole("button", { name: "Login" }));
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Welcome back!");
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/admin/dashboard" });
    });
  });

  it("consumes post-logout visit flag on mount", async () => {
    await registerUser("form-reset@test.com", "password1");
    store.logout();
    routerState.pathname = "/login";
    render(<LoginPage />);
    expect(isPostLogoutLoginVisit()).toBe(false);
  });
});
