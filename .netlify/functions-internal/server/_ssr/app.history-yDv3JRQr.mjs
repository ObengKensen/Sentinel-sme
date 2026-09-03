import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { C as Card } from "./card-DbnvS79O.mjs";
import { I as Input } from "./input-CtyJ1gXQ.mjs";
import { useStore, riskAtDate, severityColor } from "./router-BdVNv3tq.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import "./utils-B-5jxtHY.mjs";
import "../_libs/clsx.mjs";
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
  const [cat, setCat] = reactExports.useState("all");
  const [from, setFrom] = reactExports.useState("");
  const rows = reactExports.useMemo(() => {
    const out = [];
    state.financial.forEach((e) => {
      const risk = riskAtDate(state, e.date, "financial");
      out.push({
        date: e.date,
        category: "financial",
        summary: `Income ₵${e.income.toLocaleString()} · Expenses ₵${e.expenses.toLocaleString()} · Outstanding ₵${e.outstanding.toLocaleString()}`,
        riskScore: risk.score,
        riskLevel: risk.level
      });
    });
    state.cyber.forEach((e) => {
      const risk = riskAtDate(state, e.date, "cybersecurity");
      out.push({
        date: e.date,
        category: "cybersecurity",
        summary: `Password ${e.passwordUpdated ? "updated" : "not updated"} · Antivirus ${e.antivirusActive ? "active" : "inactive"} · ${e.suspicious ? "Suspicious activity" : "No suspicious activity"}`,
        riskScore: risk.score,
        riskLevel: risk.level
      });
    });
    state.compliance.forEach((e) => {
      const risk = riskAtDate(state, e.date, "compliance");
      out.push({
        date: e.date,
        category: "compliance",
        summary: `Tax due ${e.taxDeadline} (${e.taxStatus}) · License expires ${e.licenseExpiry} (${e.licenseStatus})`,
        riskScore: risk.score,
        riskLevel: risk.level
      });
    });
    state.operational.forEach((e) => {
      const risk = riskAtDate(state, e.date, "operational");
      out.push({
        date: e.date,
        category: "operational",
        summary: `Staff ${e.staffPresent}/${e.staffRequired} · Equipment ${e.equipment} · Delivery ${e.delivery}`,
        riskScore: risk.score,
        riskLevel: risk.level
      });
    });
    state.alerts.forEach((a) => {
      out.push({
        date: a.date,
        category: a.category,
        summary: `[Alert] ${a.title} — ${a.action}`,
        riskScore: a.severity === "high" ? 90 : a.severity === "medium" ? 60 : 20,
        riskLevel: a.severity
      });
    });
    return out.sort((a, b) => b.date.localeCompare(a.date));
  }, [state]);
  const filtered = rows.filter((r) => {
    if (cat !== "all" && r.category !== cat) return false;
    if (from && r.date < from) return false;
    return true;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 flex flex-wrap gap-3 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "h-9 px-3 rounded-md border bg-background text-sm", value: cat, onChange: (e) => setCat(e.target.value), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All categories" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "financial", children: "Financial" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "cybersecurity", children: "Cybersecurity" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "compliance", children: "Compliance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "operational", children: "Operational" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: from, onChange: (e) => setFrom(e.target.value), className: "w-44" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-0 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50 text-sm text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "Category" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "Risk" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "Details" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y", children: [
        filtered.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 whitespace-nowrap", children: r.date }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 capitalize", children: r.category }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-xs font-semibold uppercase rounded-full px-2 py-1 ${severityColor[r.riskLevel]}`, children: [
            r.riskScore,
            "%"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-muted-foreground", children: r.summary })
        ] }, i)),
        filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 4, className: "p-10 text-center text-sm text-muted-foreground", children: "No records." }) })
      ] })
    ] }) })
  ] });
}
export {
  Page as component
};
