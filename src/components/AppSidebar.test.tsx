import { describe, expect, it, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockNavigate, renderWithProviders, resetTestState } from "@/test/utils";
import { AppSidebar } from "./AppSidebar";
import { registerUser, resetAuthModuleState } from "@/lib/auth";
import { store } from "@/lib/risk-store";

describe("AppSidebar", () => {
  beforeEach(async () => {
    resetTestState();
    resetAuthModuleState();
    localStorage.clear();
    await registerUser("sidebar@test.com", "password1");
    await store.authenticate("sidebar@test.com", "password1");
    store.updateProfile({ businessName: "Sidebar Co" });
  });

  it("renders navigation links", () => {
    renderWithProviders(<AppSidebar />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Financial")).toBeInTheDocument();
    expect(screen.getByText("Alerts")).toBeInTheDocument();
    expect(screen.getByText("Sidebar Co")).toBeInTheDocument();
  });

  it("shows alert badge when active alerts exist", () => {
    store.addFinancial({ income: 100, expenses: 500, outstanding: 0 });
    renderWithProviders(<AppSidebar />);
    const badges = screen.getAllByText("1");
    expect(badges.length).toBeGreaterThan(0);
  });

  it("logout navigates to login", async () => {
    const user = userEvent.setup({ delay: null });
    renderWithProviders(<AppSidebar />);
    await user.click(screen.getByText("Logout"));
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/login" });
    expect(store.isAuthed()).toBe(false);
  });
});
