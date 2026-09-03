import { createFileRoute } from "@tanstack/react-router";
import { Printer, FileSpreadsheet } from "lucide-react";
import { ScoreBar } from "@/components/ScoreBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { printReport } from "@/lib/print-report";
import { cyberRisk, complianceRisk, financialRisk, operationalRisk, overallRisk, useStore } from "@/lib/risk-store";

export const Route = createFileRoute("/app/reports")({ component: Page });

function Page() {
  const state = useStore((s) => s);
  const fin = financialRisk(state);
  const cyb = cyberRisk(state);
  const com = complianceRisk(state);
  const ops = operationalRisk(state);
  const all = overallRisk(state);

  const onPrint = () =>
    printReport(`Risk report — ${state.profile.businessName || "SME Risk Sentinel"}`);
  const onExportCsv = () => {
    const lines = [
      ["Category", "Score", "Level", "Label"].join(","),
      ["Financial", fin.score, fin.level, fin.label].join(","),
      ["Cybersecurity", cyb.score, cyb.level, cyb.label].join(","),
      ["Compliance", com.score, com.level, com.label].join(","),
      ["Operational", ops.score, ops.level, ops.label].join(","),
      ["Overall", all.score, all.level, all.label].join(","),
      "",
      ["Alert", "Category", "Severity", "Date", "Status", "Action"].join(","),
      ...state.alerts.map((a) =>
        [`"${a.title}"`, a.category, a.severity, a.date, a.status, `"${a.action.replace(/"/g, '""')}"`].join(","),
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `risk-report-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const fin6 = state.financial.slice(-6);
  const finTrend = fin6.length >= 2 ? (fin6.at(-1)!.income - fin6.at(-1)!.expenses) - (fin6[0].income - fin6[0].expenses) : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-2xl font-semibold mr-auto">Risk report — {state.profile.businessName}</h2>
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <Button variant="outline" onClick={onPrint}>
            <Printer className="h-4 w-4 mr-1" /> Print
          </Button>
          <Button variant="outline" onClick={onExportCsv}>
            <FileSpreadsheet className="h-4 w-4 mr-1" /> CSV
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="text-sm text-muted-foreground">Overall risk score</div>
        <div className="flex items-baseline gap-3 mt-1">
          <div className="text-5xl font-semibold">{all.score}%</div>
          <div className="text-sm uppercase tracking-wider">{all.label}</div>
        </div>
        <div className="mt-4">
          <ScoreBar score={all.score} level={all.level} />
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Section title="Financial trends">
          <Row label="Latest profit" value={`₵${fin6.at(-1) ? (fin6.at(-1)!.income - fin6.at(-1)!.expenses).toLocaleString() : 0}`} />
          <Row label="Profit movement (6 periods)" value={`${finTrend >= 0 ? "+" : ""}₵${finTrend.toLocaleString()}`} />
          <Row label="Risk level" value={fin.label} />
        </Section>
        <Section title="Compliance status">
          <Row label="Latest tax deadline" value={state.compliance.at(-1)?.taxDeadline ?? "—"} />
          <Row label="License expiry" value={state.compliance.at(-1)?.licenseExpiry ?? "—"} />
          <Row label="Risk level" value={com.label} />
        </Section>
        <Section title="Operational status">
          <Row label="Staffing" value={`${state.operational.at(-1)?.staffPresent ?? 0}/${state.operational.at(-1)?.staffRequired ?? 0}`} />
          <Row label="Equipment" value={state.operational.at(-1)?.equipment ?? "—"} />
          <Row label="Delivery" value={state.operational.at(-1)?.delivery ?? "—"} />
          <Row label="Risk level" value={ops.label} />
        </Section>
        <Section title="Cybersecurity">
          <Row label="Antivirus" value={state.cyber.at(-1)?.antivirusActive ? "Active" : "Inactive"} />
          <Row label="Passwords" value={state.cyber.at(-1)?.passwordUpdated ? "Updated" : "Outdated"} />
          <Row label="Suspicious activity" value={state.cyber.at(-1)?.suspicious ? "Yes" : "No"} />
          <Row label="Risk level" value={cyb.label} />
        </Section>
      </div>

      <Card className="p-6">
        <div className="font-semibold mb-3">Active alerts in this period</div>
        {state.alerts.filter((a) => a.status === "active").length === 0 ? (
          <div className="text-sm text-muted-foreground">No active alerts.</div>
        ) : (
          <ul className="text-sm space-y-2">
            {state.alerts.filter((a) => a.status === "active").map((a) => (
              <li key={a.id} className="flex justify-between gap-4 border-b pb-2">
                <span><strong className="capitalize">{a.category}:</strong> {a.title}</span>
                <span className="text-muted-foreground">{a.date}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="p-5">
      <div className="font-semibold mb-3">{title}</div>
      <div className="space-y-2 text-sm">{children}</div>
    </Card>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between border-b last:border-0 py-1.5"><span className="text-muted-foreground">{label}</span><span className="font-medium">{value}</span></div>;
}
