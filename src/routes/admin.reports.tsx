import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Printer, FileSpreadsheet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminStore } from "@/lib/admin-store";
import { printReport } from "@/lib/print-report";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/reports")({ component: AdminReports });

type ReportType = "system" | "sme" | "risk" | "alert";

type ReportTable = {
  title: string;
  generatedAt: string;
  headers: string[];
  rows: string[][];
};

function escapeCsv(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

function reportHeading(type: ReportType) {
  switch (type) {
    case "system":
      return "System Report";
    case "sme":
      return "SME Report";
    case "risk":
      return "Risk Report";
    case "alert":
      return "Alert Report";
  }
}

function AdminReports() {
  const data = useAdminStore((d) => d);
  const [reportType, setReportType] = useState<ReportType>("system");

  const buildReport = (type: ReportType): ReportTable => {
    const { metrics, smes, riskAggregation } = data;
    const generatedAt = new Date().toLocaleString();
    const title = `SME Risk Sentinel — ${reportHeading(type)}`;

    if (type === "system") {
      return {
        title,
        generatedAt,
        headers: ["Metric", "Value"],
        rows: [
          ["Total SMEs", String(metrics.totalSmes)],
          ["Active SMEs", String(metrics.activeSmes)],
          ["Suspended SMEs", String(metrics.suspendedSmes)],
          ["High-Risk SMEs", String(metrics.highRiskSmes)],
          ["Total Alerts", String(metrics.totalAlerts)],
          ["Total Reports", String(metrics.totalReports)],
        ],
      };
    }

    if (type === "sme") {
      return {
        title,
        generatedAt,
        headers: ["Business", "Owner", "Email", "Type", "Risk", "Status", "Alerts"],
        rows: smes.map((s) => [
          s.businessName,
          s.ownerName,
          s.email,
          s.businessType,
          s.riskLabel,
          s.accountStatus,
          String(s.alertCount),
        ]),
      };
    }

    if (type === "risk") {
      return {
        title,
        generatedAt,
        headers: ["Category", "Avg Score", "Low", "Medium", "High"],
        rows: (
          [
            ["Financial", riskAggregation.financial],
            ["Cybersecurity", riskAggregation.cybersecurity],
            ["Compliance", riskAggregation.compliance],
            ["Operational", riskAggregation.operational],
          ] as const
        ).map(([name, stats]) => [
          name,
          String(stats.avgScore),
          String(stats.low),
          String(stats.medium),
          String(stats.high),
        ]),
      };
    }

    return {
      title,
      generatedAt,
      headers: ["Business", "Owner", "Active Alerts", "Total Alerts", "Risk Level"],
      rows: smes.map((s) => [
        s.businessName,
        s.ownerName,
        String(s.activeAlerts),
        String(s.alertCount),
        s.riskLabel,
      ]),
    };
  };

  const onPrint = () => printReport(`SME Risk Sentinel — ${reportHeading(reportType)}`);

  const onExportCsv = () => {
    const report = buildReport(reportType);
    const lines = [
      [report.title],
      [`Generated: ${report.generatedAt}`],
      [],
      report.headers,
      ...report.rows,
    ];
    const csv = lines.map((row) => row.map((cell) => escapeCsv(cell)).join(",")).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `admin-${reportType}-report-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded.");
  };

  const { metrics, smes, riskAggregation } = data;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        <div className="mr-auto">
          <h2 className="text-lg font-semibold">Admin Reports</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <Button variant="outline" onClick={onPrint}>
            <Printer className="h-4 w-4 mr-1" /> Print
          </Button>
          <Button variant="outline" onClick={onExportCsv}>
            <FileSpreadsheet className="h-4 w-4 mr-1" /> CSV
          </Button>
        </div>
      </div>

      <Tabs value={reportType} onValueChange={(v) => setReportType(v as ReportType)}>
        <TabsList className="print:hidden">
          <TabsTrigger value="system">System Reports</TabsTrigger>
          <TabsTrigger value="sme">SME Reports</TabsTrigger>
          <TabsTrigger value="risk">Risk Reports</TabsTrigger>
          <TabsTrigger value="alert">Alert Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="mt-4">
          <Card className="p-6">
            <div className="font-semibold mb-4">System Overview</div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <Stat label="Total SMEs" value={metrics.totalSmes} />
              <Stat label="Active SMEs" value={metrics.activeSmes} />
              <Stat label="Suspended SMEs" value={metrics.suspendedSmes} />
              <Stat label="High-Risk SMEs" value={metrics.highRiskSmes} />
              <Stat label="Total Alerts" value={metrics.totalAlerts} />
              <Stat label="Reports Generated" value={metrics.totalReports} />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="sme" className="mt-4">
          <Card className="p-6">
            <div className="font-semibold mb-4">SME Accounts ({smes.length})</div>
            {smes.length === 0 ? (
              <div className="text-sm text-muted-foreground">No SME accounts.</div>
            ) : (
              <ul className="text-sm space-y-2">
                {smes.map((s) => (
                  <li key={s.userId} className="flex justify-between border-b pb-2">
                    <span>
                      <strong>{s.businessName}</strong> — {s.ownerName}
                    </span>
                    <span className="text-muted-foreground">
                      {s.riskLabel} · {s.accountStatus}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="mt-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {(["financial", "cybersecurity", "compliance", "operational"] as const).map((key) => {
              const stats = riskAggregation[key];
              return (
                <Card key={key} className="p-5">
                  <div className="font-semibold capitalize mb-2">{key}</div>
                  <div className="text-2xl font-semibold">{stats.avgScore}%</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Low: {stats.low} · Medium: {stats.medium} · High: {stats.high}
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="alert" className="mt-4">
          <Card className="p-6">
            <div className="font-semibold mb-4">Alert Summary by SME</div>
            {smes.length === 0 ? (
              <div className="text-sm text-muted-foreground">No alerts recorded.</div>
            ) : (
              <ul className="text-sm space-y-2">
                {smes
                  .filter((s) => s.alertCount > 0)
                  .map((s) => (
                    <li key={s.userId} className="flex justify-between border-b pb-2">
                      <span>{s.businessName}</span>
                      <span className="text-muted-foreground">
                        {s.activeAlerts} active / {s.alertCount} total
                      </span>
                    </li>
                  ))}
              </ul>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border rounded-lg p-3">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}
