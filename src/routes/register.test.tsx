import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getFieldInput, mockNavigate } from "@/test/utils";
import { routerState } from "@/test/mocks/tanstack-router-state";
import { toast } from "sonner";
import React from "react";
import { Route } from "./register";
import { resetAuthModuleState, registerUser, clearSession } from "@/lib/auth";
import { resetStoreAfterDataWipe } from "@/lib/risk-store";

// Route.options.component can be undefined in tests; coerce to a React component type
const RegisterPage = (Route.options.component as React.ComponentType<any>) || (() => null);

describe("RegisterPage", () => {
  beforeEach(() => {
    routerState.pathname = "/register";
    resetAuthModuleState();
    resetStoreAfterDataWipe();
    localStorage.clear();
    vi.mocked(toast.error).mockClear();
    vi.mocked(toast.success).mockClear();
    mockNavigate.mockClear();
  });

  it("renders registration form", () => {
    render(<RegisterPage />);
    expect(
      screen.getByRole("heading", { name: "Create your business account" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Business Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("validates business name pattern", async () => {
    const user = userEvent.setup({ delay: null });
    render(<RegisterPage />);
    await user.type(getFieldInput("Business Name"), "Biz123");
    await user.type(getFieldInput("Owner Name"), "Jane Doe");
    await user.type(getFieldInput("Email"), "new@test.com");
    await user.type(getFieldInput("Password"), "password1");
    await user.type(getFieldInput("Confirm Password"), "password1");
    await user.click(screen.getByRole("button", { name: "Create account" }));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Business name can only contain letters, spaces, hyphens, and apostrophes (no numbers or special characters).",
      );
    });
  });

  it("rejects short passwords", async () => {
    const user = userEvent.setup({ delay: null });
    render(<RegisterPage />);
    await user.type(getFieldInput("Business Name"), "Acme Corp");
    await user.type(getFieldInput("Owner Name"), "Jane Doe");
    await user.type(getFieldInput("Email"), "short@test.com");
    await user.type(getFieldInput("Password"), "12345");
    await user.type(getFieldInput("Confirm Password"), "12345");
    await user.click(screen.getByRole("button", { name: "Create account" }));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Password must be at least 6 characters.");
    });
  });

  it("rejects mismatched passwords", async () => {
    const user = userEvent.setup({ delay: null });
    render(<RegisterPage />);
    await user.type(getFieldInput("Business Name"), "Acme Corp");
    await user.type(getFieldInput("Owner Name"), "Jane Doe");
    await user.type(getFieldInput("Email"), "mismatch@test.com");
    await user.type(getFieldInput("Password"), "password1");
    await user.type(getFieldInput("Confirm Password"), "password2");
    await user.click(screen.getByRole("button", { name: "Create account" }));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Passwords do not match.");
    });
  });

  it("shows error when email is already registered", async () => {
    await registerUser("taken@test.com", "password1");
    clearSession();

    const user = userEvent.setup({ delay: null });
    render(<RegisterPage />);
    await user.type(getFieldInput("Business Name"), "Acme Corp");
    await user.type(getFieldInput("Owner Name"), "Jane Doe");
    await user.type(getFieldInput("Email"), "taken@test.com");
    await user.type(getFieldInput("Password"), "password1");
    await user.type(getFieldInput("Confirm Password"), "password1");
    await user.click(screen.getByRole("button", { name: "Create account" }));
    await waitFor(() => {
      expect(screen.getByText(/An account with this email already exists/i)).toBeInTheDocument();
    });
  });

  it("shows orphaned profile recovery message for email without auth user", async () => {
    const userId = "orphan-register-user";
    localStorage.setItem(
      `srs:state:v1:${userId}`,
      JSON.stringify({
        profile: {
          businessName: "Orphan Co",
          ownerName: "Jane Doe",
          email: "orphan@test.com",
          phone: "",
          businessType: "Retail",
          employees: 5,
        },
        financial: [],
        cyber: [],
        compliance: [],
        operational: [],
        alerts: [],
      }),
    );

    const user = userEvent.setup({ delay: null });
    render(<RegisterPage />);
    await user.type(getFieldInput("Business Name"), "Orphan Co");
    await user.type(getFieldInput("Owner Name"), "Jane Doe");
    await user.type(getFieldInput("Email"), "orphan@test.com");
    await user.type(getFieldInput("Password"), "password1");
    await user.type(getFieldInput("Confirm Password"), "password1");
    await user.click(screen.getByRole("button", { name: "Create account" }));
    await waitFor(() => {
      expect(screen.getByText(/needs to be restored/i)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Forgot password" })).toHaveAttribute(
        "href",
        "/forgot-password",
      );
    });
  });

  it("creates account with valid data", async () => {
    const user = userEvent.setup({ delay: null });
    render(<RegisterPage />);
    await user.type(getFieldInput("Business Name"), "Acme Corp");
    await user.type(getFieldInput("Owner Name"), "Jane Doe");
    await user.type(getFieldInput("Email"), "newbiz@test.com");
    await user.type(getFieldInput("Password"), "password1");
    await user.type(getFieldInput("Confirm Password"), "password1");
    await user.click(screen.getByRole("button", { name: "Create account" }));
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Account created. Welcome to Risk Sentinel!");
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/app/dashboard" });
    });
  });
});
