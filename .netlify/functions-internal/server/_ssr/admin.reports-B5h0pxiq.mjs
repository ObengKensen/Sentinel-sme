import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { C as Card } from "./card-DbnvS79O.mjs";
import { B as Button } from "./button-BjSzN4sD.mjs";
import { R as Root2, L as List, T as Trigger, C as Content } from "../_libs/radix-ui__react-tabs.mjs";
import { c as cn } from "./utils-B-5jxtHY.mjs";
import { useAdminStore } from "./router-BdVNv3tq.mjs";
import { p as printReport } from "./print-report-DLyTNFF4.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { j as Printer, k as FileSpreadsheet } from "../_libs/lucide-react.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/isbot.mjs";
import "./csrf-C3jkS9Bv.mjs";
import "./server-DpwYz346.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./jwt.shared-gMsek6D_.mjs";
import "../_libs/zod.mjs";
const Tabs = Root2;
const TabsList = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  List,
  {
    ref,
    className: cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = List.displayName;
const TabsTrigger = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = Trigger.displayName;
const TabsContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = Content.displayName;
function escapeCsv(value) {
  return `"${value.replace(/"/g, '""')}"`;
}
function reportHeading(type) {
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
  const [reportType, setReportType] = reactExports.useState("system");
  const buildReport = (type) => {
    const {
      metrics: metrics2,
      smes: smes2,
      riskAggregation: riskAggregation2
    } = data;
    const generatedAt = (/* @__PURE__ */ new Date()).toLocaleString();
    const title = `SME Risk Sentinel — ${reportHeading(type)}`;
    if (type === "system") {
      return {
        title,
        generatedAt,
        headers: ["Metric", "Value"],
        rows: [["Total SMEs", String(metrics2.totalSmes)], ["Active SMEs", String(metrics2.activeSmes)], ["Suspended SMEs", String(metrics2.suspendedSmes)], ["High-Risk SMEs", String(metrics2.highRiskSmes)], ["Total Alerts", String(metrics2.totalAlerts)], ["Total Reports", String(metrics2.totalReports)]]
      };
    }
    if (type === "sme") {
      return {
        title,
        generatedAt,
        headers: ["Business", "Owner", "Email", "Type", "Risk", "Status", "Alerts"],
        rows: smes2.map((s) => [s.businessName, s.ownerName, s.email, s.businessType, s.riskLabel, s.accountStatus, String(s.alertCount)])
      };
    }
    if (type === "risk") {
      return {
        title,
        generatedAt,
        headers: ["Category", "Avg Score", "Low", "Medium", "High"],
        rows: [["Financial", riskAggregation2.financial], ["Cybersecurity", riskAggregation2.cybersecurity], ["Compliance", riskAggregation2.compliance], ["Operational", riskAggregation2.operational]].map(([name, stats]) => [name, String(stats.avgScore), String(stats.low), String(stats.medium), String(stats.high)])
      };
    }
    return {
      title,
      generatedAt,
      headers: ["Business", "Owner", "Active Alerts", "Total Alerts", "Risk Level"],
      rows: smes2.map((s) => [s.businessName, s.ownerName, String(s.activeAlerts), String(s.alertCount), s.riskLabel])
    };
  };
  const onPrint = () => printReport(`SME Risk Sentinel — ${reportHeading(reportType)}`);
  const onExportCsv = () => {
    const report = buildReport(reportType);
    const lines = [[report.title], [`Generated: ${report.generatedAt}`], [], report.headers, ...report.rows];
    const csv = lines.map((row) => row.map((cell) => escapeCsv(cell)).join(",")).join("\r\n");
    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8"
    });
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
  const {
    metrics,
    smes,
    riskAggregation
  } = data;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mr-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Admin Reports" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 print:hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: onPrint, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "h-4 w-4 mr-1" }),
          " Print"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: onExportCsv, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "h-4 w-4 mr-1" }),
          " CSV"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: reportType, onValueChange: (v) => setReportType(v), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "print:hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "system", children: "System Reports" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "sme", children: "SME Reports" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "risk", children: "Risk Reports" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "alert", children: "Alert Reports" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "system", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold mb-4", children: "System Overview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Total SMEs", value: metrics.totalSmes }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Active SMEs", value: metrics.activeSmes }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Suspended SMEs", value: metrics.suspendedSmes }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "High-Risk SMEs", value: metrics.highRiskSmes }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Total Alerts", value: metrics.totalAlerts }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Reports Generated", value: metrics.totalReports })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "sme", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold mb-4", children: [
          "SME Accounts (",
          smes.length,
          ")"
        ] }),
        smes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "No SME accounts." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "text-sm space-y-2", children: smes.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex justify-between border-b pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: s.businessName }),
            " — ",
            s.ownerName
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
            s.riskLabel,
            " · ",
            s.accountStatus
          ] })
        ] }, s.userId)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "risk", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 gap-4", children: ["financial", "cybersecurity", "compliance", "operational"].map((key) => {
        const stats = riskAggregation[key];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold capitalize mb-2", children: key }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-semibold", children: [
            stats.avgScore,
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground mt-1", children: [
            "Low: ",
            stats.low,
            " · Medium: ",
            stats.medium,
            " · High: ",
            stats.high
          ] })
        ] }, key);
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "alert", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold mb-4", children: "Alert Summary by SME" }),
        smes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "No alerts recorded." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "text-sm space-y-2", children: smes.filter((s) => s.alertCount > 0).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex justify-between border-b pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: s.businessName }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
            s.activeAlerts,
            " active / ",
            s.alertCount,
            " total"
          ] })
        ] }, s.userId)) })
      ] }) })
    ] })
  ] });
}
function Stat({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border rounded-lg p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-semibold", children: value })
  ] });
}
export {
  AdminReports as component
};
