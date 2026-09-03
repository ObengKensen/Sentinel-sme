import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { C as Card } from "./card-DbnvS79O.mjs";
import { B as Button } from "./button-BjSzN4sD.mjs";
import { I as Input } from "./input-CtyJ1gXQ.mjs";
import { useStore, severityColor, alertStatusColor, store } from "./router-BdVNv3tq.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
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
  const alerts = useStore((s) => s.alerts);
  const [statusFilter, setStatusFilter] = reactExports.useState("active");
  const [cat, setCat] = reactExports.useState("all");
  const [sev, setSev] = reactExports.useState("all");
  const [q, setQ] = reactExports.useState("");
  const activeCount = alerts.filter((a) => a.status === "active").length;
  const reviewedCount = alerts.filter((a) => a.status === "reviewed").length;
  const highCount = alerts.filter((a) => a.status === "active" && a.severity === "high").length;
  const mediumCount = alerts.filter((a) => a.status === "active" && a.severity === "medium").length;
  const resolveAll = () => {
    if (activeCount === 0) return;
    store.resolveAllActive();
    toast.success(`Resolved ${activeCount} alert${activeCount === 1 ? "" : "s"}.`);
  };
  const filtered = alerts.filter((a) => {
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    if (cat !== "all" && a.category !== cat) return false;
    if (sev !== "all" && a.severity !== sev) return false;
    if (q) {
      const haystack = `${a.id} ${a.title} ${a.action} ${a.category}`.toLowerCase();
      if (!haystack.includes(q.toLowerCase())) return false;
    }
    return true;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 xl:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-base font-semibold text-muted-foreground", children: "Active alerts" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-semibold mt-1", children: activeCount })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-base font-semibold text-muted-foreground", children: "Under review" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-semibold mt-1 text-warning", children: reviewedCount })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-base font-semibold text-muted-foreground", children: "High severity (active)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-semibold mt-1 text-destructive", children: highCount })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-base font-semibold text-muted-foreground", children: "Medium severity (active)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-semibold mt-1 text-warning", children: mediumCount })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 flex flex-wrap gap-3 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "h-9 px-3 rounded-md border bg-background text-sm", value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All statuses" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "active", children: "Active" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "reviewed", children: "Reviewed" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "resolved", children: "Resolved" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "h-9 px-3 rounded-md border bg-background text-sm", value: cat, onChange: (e) => setCat(e.target.value), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All categories" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "financial", children: "Financial" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "cybersecurity", children: "Cybersecurity" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "compliance", children: "Compliance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "operational", children: "Operational" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "h-9 px-3 rounded-md border bg-background text-sm", value: sev, onChange: (e) => setSev(e.target.value), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All severities" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "low", children: "Low" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "medium", children: "Medium" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "high", children: "High" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "max-w-xs", placeholder: "Search by ID, title, or recommendation…", value: q, onChange: (e) => setQ(e.target.value) }),
      activeCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "ml-auto", onClick: resolveAll, children: "Resolve all active" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-0 overflow-hidden", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-10 text-center text-sm text-muted-foreground", children: "No alerts match your filters." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm min-w-[960px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50 text-sm text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "Alert ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "Risk Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "Severity" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "Date Generated" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "Recommendation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-3", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y", children: filtered.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-mono text-sm text-muted-foreground", children: a.id }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium capitalize", children: a.category }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground mt-0.5", children: a.title })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs font-semibold uppercase rounded-full px-2 py-1 ${severityColor[a.severity]}`, children: a.severity }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-muted-foreground whitespace-nowrap", children: a.date }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-muted-foreground max-w-xs", children: a.action }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs font-semibold capitalize rounded-full px-2 py-1 ${alertStatusColor[a.status]}`, children: a.status }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
          a.status === "active" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => {
            store.markReviewed(a.id);
            toast.success("Alert reviewed.");
          }, children: "Reviewed" }),
          a.status !== "resolved" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => {
            store.markResolved(a.id);
            toast.success("Alert resolved.");
          }, children: "Resolved" })
        ] }) })
      ] }, a.id)) })
    ] }) }) })
  ] });
}
export {
  Page as component
};
