import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Wallet } from "lucide-react";
import { RiskCard } from "./RiskCard";

describe("RiskCard", () => {
  const risk = { level: "medium" as const, score: 55, label: "Medium Risk" };

  it("renders title and risk score when data exists", () => {
    render(<RiskCard title="Financial" icon={Wallet} risk={risk} hasData />);
    expect(screen.getByText("Financial")).toBeInTheDocument();
    expect(screen.getByText("Medium Risk")).toBeInTheDocument();
    expect(screen.getByText("55")).toBeInTheDocument();
    expect(screen.getByText("Risk Score")).toBeInTheDocument();
  });

  it("renders empty message when no data", () => {
    render(<RiskCard title="Financial" icon={Wallet} risk={risk} hasData={false} />);
    expect(
      screen.getByText("Submit your financial check to see risk level"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Risk Score")).not.toBeInTheDocument();
  });

  it("uses custom empty message", () => {
    render(
      <RiskCard
        title="Cyber"
        icon={Wallet}
        risk={risk}
        hasData={false}
        emptyMessage="Add cyber data first"
      />,
    );
    expect(screen.getByText("Add cyber data first")).toBeInTheDocument();
  });
});
