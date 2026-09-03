import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { S as ScoreBar } from "./ScoreBar-B4WgMYtn.mjs";
import { C as Card } from "./card-DbnvS79O.mjs";
import { B as Button } from "./button-BjSzN4sD.mjs";
import { p as printReport } from "./print-report-DLyTNFF4.mjs";
import { useStore, financialRisk, cyberRisk, complianceRisk, operationalRisk, overallRisk } from "./router-BdVNv3tq.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import { j as Printer, k as FileSpreadsheet } from "../_libs/lucide-react.mjs";
import "./utils-B-5jxtHY.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "./csrf-C3jkS9Bv.mjs";
import "./server-DpwYz346.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./jwt.shared-gMsek6D_.mjs";
import "../_libs/zod.mjs";
function Page() {
  const state = useStore((s) => s);
  const fin = financialRisk(state);
  const cyb = cyberRisk(state);
  const com = complianceRisk(state);
  const ops = operationalRisk(state);
  const all = overallRisk(state);
  const onPrint = () => printReport(`Risk report — ${state.profile.businessName || "SME Risk Sentinel"}`);
  const onExportCsv = () => {
    const lines = [["Category", "Score", "Level", "Label"].join(","), ["Financial", fin.score, fin.level, fin.label].join(","), ["Cybersecurity", cyb.score, cyb.level, cyb.label].join(","), ["Compliance", com.score, com.level, com.label].join(","), ["Operational", ops.score, ops.level, ops.label].join(","), ["Overall", all.score, all.level, all.label].join(","), "", ["Alert", "Category", "Severity", "Date", "Status", "Action"].join(","), ...state.alerts.map((a2) => [`"${a2.title}"`, a2.category, a2.severity, a2.date, a2.status, `"${a2.action.replace(/"/g, '""')}"`].join(","))];
    const blob = new Blob([lines.join("\n")], {
      type: "text/csv"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `risk-report-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const fin6 = state.financial.slice(-6);
  const finTrend = fin6.length >= 2 ? fin6.at(-1).income - fin6.at(-1).expenses - (fin6[0].income - fin6[0].expenses) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-semibold mr-auto", children: [
        "Risk report — ",
        state.profile.businessName
      ] }),
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Overall risk score" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-3 mt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-5xl font-semibold", children: [
          all.score,
          "%"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm uppercase tracking-wider", children: all.label })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreBar, { score: all.score, level: all.level }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Financial trends", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Latest profit", value: `₵${fin6.at(-1) ? (fin6.at(-1).income - fin6.at(-1).expenses).toLocaleString() : 0}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Profit movement (6 periods)", value: `${finTrend >= 0 ? "+" : ""}₵${finTrend.toLocaleString()}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Risk level", value: fin.label })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Compliance status", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Latest tax deadline", value: state.compliance.at(-1)?.taxDeadline ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "License expiry", value: state.compliance.at(-1)?.licenseExpiry ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Risk level", value: com.label })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Operational status", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Staffing", value: `${state.operational.at(-1)?.staffPresent ?? 0}/${state.operational.at(-1)?.staffRequired ?? 0}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Equipment", value: state.operational.at(-1)?.equipment ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Delivery", value: state.operational.at(-1)?.delivery ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Risk level", value: ops.label })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Cybersecurity", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Antivirus", value: state.cyber.at(-1)?.antivirusActive ? "Active" : "Inactive" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Passwords", value: state.cyber.at(-1)?.passwordUpdated ? "Updated" : "Outdated" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Suspicious activity", value: state.cyber.at(-1)?.suspicious ? "Yes" : "No" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Risk level", value: cyb.label })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold mb-3", children: "Active alerts in this period" }),
      state.alerts.filter((a) => a.status === "active").length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "No active alerts." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "text-sm space-y-2", children: state.alerts.filter((a) => a.status === "active").map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex justify-between gap-4 border-b pb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "capitalize", children: [
            a.category,
            ":"
          ] }),
          " ",
          a.title
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: a.date })
      ] }, a.id)) })
    ] })
  ] });
}
function Section({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold mb-3", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 text-sm", children })
  ] });
}
function Row({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b last:border-0 py-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: value })
  ] });
}
export {
  Page as component
};
