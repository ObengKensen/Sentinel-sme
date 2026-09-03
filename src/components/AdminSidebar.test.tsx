import { describe, expect, it, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockNavigate, renderWithProviders, resetTestState } from "@/test/utils";
import { routerState } from "@/test/mocks/tanstack-router-state";
import { AdminSidebar } from "./AdminSidebar";
import { seedSuperAdmin, loginUser, resetAuthModuleState } from "@/lib/auth";
import { store } from "@/lib/risk-store";

describe("AdminSidebar", () => {
  beforeEach(async () => {
    resetTestState();
    resetAuthModuleState();
    routerState.pathname = "/admin/dashboard";
    localStorage.clear();
    await seedSuperAdmin();
    await loginUser("admin@smerisksentinel.com", "SuperAdmin2024!");
    await store.authenticate("admin@smerisksentinel.com", "SuperAdmin2024!");
  });

  it("renders admin navigation links", () => {
    renderWithProviders(<AdminSidebar />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("SME Management")).toBeInTheDocument();
    expect(screen.getByText("Risk Monitoring")).toBeInTheDocument();
    expect(screen.getByText("Super Admin")).toBeInTheDocument();
  });

  it("logout navigates to login", async () => {
    const user = userEvent.setup({ delay: null });
    renderWithProviders(<AdminSidebar />);
    await user.click(screen.getByText("Logout"));
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/login" });
  });
});
