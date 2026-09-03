import { describe, expect, it, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ComponentType } from "react";
import { Route } from "./app.dashboard";
import { registerUser, resetAuthModuleState } from "@/lib/auth";
import { store } from "@/lib/risk-store";

const DashboardPage = Route.options.component as ComponentType;

if (!DashboardPage) {
  throw new Error("Dashboard route component is not defined");
}

describe("App Dashboard page", () => {
  beforeEach(async () => {
    resetAuthModuleState();
    localStorage.clear();
    await registerUser("dash@test.com", "password1");
    await store.authenticate("dash@test.com", "password1");
  });

  it("renders risk category cards", () => {
    render(<DashboardPage />);
    expect(screen.getByText("Financial Risk")).toBeInTheDocument();
    expect(screen.getByText("Cybersecurity Risk")).toBeInTheDocument();
    expect(screen.getByText("Compliance Risk")).toBeInTheDocument();
    expect(screen.getByText("Operational Risk")).toBeInTheDocument();
    expect(screen.getByText("Overall Risk")).toBeInTheDocument();
  });

  it("shows recommended actions section", () => {
    render(<DashboardPage />);
    expect(screen.getByText("Recommended actions")).toBeInTheDocument();
  });
});
