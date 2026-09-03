import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Wallet } from "lucide-react";
import { CsrfTokenField } from "@/components/CsrfTokenField";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RiskCard } from "@/components/RiskCard";
import { financialRisk, hasFinancialData, store, useStore } from "@/lib/risk-store";
import { toast } from "sonner";

export const Route = createFileRoute("/app/financial")({ component: Page });

function parseFinancialInput(value: string): { value: string; hasInvalid: boolean } {
  let hasInvalid = false;
  let hasDecimal = false;
  let result = "";

  for (const char of value) {
    if (char >= "0" && char <= "9") {
      result += char;
    } else if (char === "." && !hasDecimal) {
      result += char;
      hasDecimal = true;
    } else {
      hasInvalid = true;
    }
  }

  return { value: result, hasInvalid };
}

function Page() {
  const state = useStore((s) => s);
  const risk = financialRisk(state);
  const [form, setForm] = useState({ income: "", expenses: "", outstanding: "" });

  const updateField = (field: "income" | "expenses" | "outstanding", raw: string) => {
    const { value, hasInvalid } = parseFinancialInput(raw);
    if (hasInvalid) {
      toast.error("Please enter numbers only.");
    }
    setForm({ ...form, [field]: value });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.income.trim() || !form.expenses.trim() || !form.outstanding.trim()) {
      toast.error("Please fill in all financial fields.");
      return;
    }
    const income = Number(form.income);
    const expenses = Number(form.expenses);
    const outstanding = Number(form.outstanding);
    if ([income, expenses, outstanding].some((n) => Number.isNaN(n) || n < 0)) {
      toast.error("Please enter valid non-negative numbers.");
      return;
    }
    store.addFinancial({ income, expenses, outstanding });
    toast.success("Financial data submitted. Risk recalculated.");
  };

  const hasData = hasFinancialData(state);
  const latest = hasData ? state.financial.at(-1) : undefined;
  const profit = latest ? latest.income - latest.expenses : 0;
  const margin = latest && latest.income ? ((profit / latest.income) * 100).toFixed(1) : "0";

  return (
    <div className="flex flex-col gap-6">
      <div className="grid md:grid-cols-3 gap-4">
        <RiskCard
          title="Financial Risk"
          icon={Wallet}
          risk={risk}
          hasData={hasData}
          emptyMessage="Submit your financial check to see risk level"
        />
        <Card className="p-5">
          <div className="text-lg font-semibold">Profit</div>
          {hasData && latest ? (
            <>
              <div className="text-3xl font-semibold mt-2">₵{profit.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground mt-1">Margin: {margin}%</div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground leading-snug mt-2">
              Save your financial check to see profit and margin.
            </p>
          )}
        </Card>
        <Card className="p-5">
          <div className="text-lg font-semibold">Outstanding payments</div>
          {hasData && latest ? (
            <>
              <div className="text-3xl font-semibold mt-2">
                ₵{latest.outstanding.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Latest submission</div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground leading-snug mt-2">
              Save your financial check to see outstanding payments.
            </p>
          )}
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="text-xl font-semibold mb-1">Submit financial data</div>
          <div className="text-sm text-muted-foreground mb-5">
            Flags risk if expenses exceed income, margin is low, or outstanding payments exceed 20%.
          </div>
          <form method="post" onSubmit={submit} className="space-y-4">
            <CsrfTokenField />
            <Field label="Income (₵)">
              <Input
                type="text"
                inputMode="decimal"
                value={form.income}
                onChange={(e) => updateField("income", e.target.value)}
              />
            </Field>
            <Field label="Expenses (₵)">
              <Input
                type="text"
                inputMode="decimal"
                value={form.expenses}
                onChange={(e) => updateField("expenses", e.target.value)}
              />
            </Field>
            <Field label="Outstanding Payments (₵)">
              <Input
                type="text"
                inputMode="decimal"
                value={form.outstanding}
                onChange={(e) => updateField("outstanding", e.target.value)}
              />
            </Field>
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Card>

        <Card className="p-6">
          <div className="text-xl font-semibold mb-3">Historical records</div>
          <div className="overflow-auto max-h-[420px]">
            <table className="w-full text-sm">
              <thead className="text-sm text-muted-foreground border-b">
                <tr>
                  <th className="text-left py-2">Date</th>
                  <th className="text-right">Income</th>
                  <th className="text-right">Expenses</th>
                  <th className="text-right">Outstanding</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[...state.financial].reverse().map((e) => (
                  <tr key={e.id}>
                    <td className="py-2">{e.date}</td>
                    <td className="text-right">₵{e.income.toLocaleString()}</td>
                    <td className="text-right">₵{e.expenses.toLocaleString()}</td>
                    <td className="text-right">₵{e.outstanding.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
