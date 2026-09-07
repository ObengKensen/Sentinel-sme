import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useStore, riskAtDate, severityColor, type Category, type Severity } from "@/lib/risk-store";

export const Route = createFileRoute("/app/history")({ component: Page });

type Row = { date: string; category: Category; summary: string; riskScore: number; riskLevel: Severity };

function Page() {
  const state = useStore((s) => s);
  const [cat, setCat] = useState<"all" | Category>("all");
  const [from, setFrom] = useState("");

  const rows: Row[] = useMemo(() => {
    const out: Row[] = [];
    state.financial.forEach((e) => {
      const risk = riskAtDate(state, e.date, "financial");
      out.push({ date: e.date, category: "financial", summary: `Income ₵${e.income.toLocaleString()} · Expenses ₵${e.expenses.toLocaleString()} · Outstanding ₵${e.outstanding.toLocaleString()}`, riskScore: risk.score, riskLevel: risk.level });
    });
    state.cyber.forEach((e) => {
      const risk = riskAtDate(state, e.date, "cybersecurity");
      out.push({ date: e.date, category: "cybersecurity", summary: `Password ${e.passwordUpdated ? "updated" : "not updated"} · Antivirus ${e.antivirusActive ? "active" : "inactive"} · ${e.suspicious ? "Suspicious activity" : "No suspicious activity"}`, riskScore: risk.score, riskLevel: risk.level });
    });
    state.compliance.forEach((e) => {
      const risk = riskAtDate(state, e.date, "compliance");
      out.push({ date: e.date, category: "compliance", summary: `Tax due ${e.taxDeadline} (${e.taxStatus}) · License expires ${e.licenseExpiry} (${e.licenseStatus})`, riskScore: risk.score, riskLevel: risk.level });
    });
    state.operational.forEach((e) => {
      const risk = riskAtDate(state, e.date, "operational");
      out.push({ date: e.date, category: "operational", summary: `Staff ${e.staffPresent}/${e.staffRequired} · Equipment ${e.equipment} · Delivery ${e.delivery}`, riskScore: risk.score, riskLevel: risk.level });
    });
    state.alerts.forEach((a) => {
      out.push({ date: a.date, category: a.category, summary: `[Alert] ${a.title} — ${a.action}`, riskScore: a.severity === "high" ? 90 : a.severity === "medium" ? 60 : 20, riskLevel: a.severity });
    });
    return out.sort((a, b) => b.date.localeCompare(a.date));
  }, [state]);

  const filtered = rows.filter((r) => {
    if (cat !== "all" && r.category !== cat) return false;
    if (from && r.date < from) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <label className="flex min-w-0 flex-col gap-1.5 text-sm text-muted-foreground">
          Category
          <select className="h-10 w-full px-3 rounded-md border bg-background text-sm text-foreground sm:w-auto" value={cat} onChange={(e) => setCat(e.target.value as any)}>
            <option value="all">All categories</option><option value="financial">Financial</option><option value="cybersecurity">Cybersecurity</option><option value="compliance">Compliance</option><option value="operational">Operational</option>
          </select>
        </label>
        <label className="flex min-w-0 w-full flex-col gap-1.5 text-sm text-muted-foreground sm:w-auto">
          From date
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="h-10 w-full min-w-0 sm:w-48" />
        </label>
      </Card>

      <div className="grid gap-3 md:hidden">
        {filtered.length === 0 ? (
          <Card className="p-10 text-center text-sm text-muted-foreground">No records.</Card>
        ) : (
          filtered.map((r, i) => (
            <Card key={`${r.date}-${r.category}-${i}`} className="p-4 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-full shrink-0 text-sm font-medium whitespace-nowrap tabular-nums sm:w-auto">
                  {r.date}
                </span>
                <span className="text-sm capitalize text-muted-foreground">{r.category}</span>
                <span className={`text-xs font-semibold uppercase rounded-full px-2 py-1 ${severityColor[r.riskLevel]}`}>
                  {r.riskScore}%
                </span>
              </div>
              <p className="text-sm text-muted-foreground break-words">{r.summary}</p>
            </Card>
          ))
        )}
      </div>

      <Card className="hidden p-0 overflow-hidden md:block">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-sm text-muted-foreground">
            <tr><th className="text-left p-3">Date</th><th className="text-left p-3">Category</th><th className="text-left p-3">Risk</th><th className="text-left p-3">Details</th></tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((r, i) => (
              <tr key={`${r.date}-${r.category}-${i}`}>
                <td className="p-3 whitespace-nowrap tabular-nums">{r.date}</td>
                <td className="p-3 capitalize">{r.category}</td>
                <td className="p-3">
                  <span className={`text-xs font-semibold uppercase rounded-full px-2 py-1 ${severityColor[r.riskLevel]}`}>
                    {r.riskScore}%
                  </span>
                </td>
                <td className="p-3 text-muted-foreground break-words">{r.summary}</td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={4} className="p-10 text-center text-sm text-muted-foreground">No records.</td></tr>}
          </tbody>
        </table>
        </div>
      </Card>
    </div>
  );
}
