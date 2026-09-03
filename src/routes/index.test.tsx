import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Route } from "./index";

const LandingPage = Route.options.component;

describe("Landing page", () => {
  it("renders hero and navigation", () => {
    render(<LandingPage />);
    expect(screen.getByText(/Stay Ahead of Business Risks/)).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Login" }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("link", { name: "Get started" })).toBeInTheDocument();
  });

  it("renders feature sections", () => {
    render(<LandingPage />);
    expect(screen.getByText("Financial Monitoring")).toBeInTheDocument();
    expect(screen.getByText("Cybersecurity Monitoring")).toBeInTheDocument();
  });
});
