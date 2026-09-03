import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { C as Card } from "./card-DbnvS79O.mjs";
import { useAdminStore, severityColor } from "./router-BdVNv3tq.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import { W as Wallet, S as ShieldCheck, F as FileCheckCorner, C as Cog } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, B as BarChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, L as Legend, a as Bar } from "../_libs/recharts.mjs";
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
import "../_libs/lodash.mjs";
import "../_libs/react-smooth.mjs";
import "../_libs/prop-types.mjs";
import "../_libs/fast-equals.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/react-is.mjs";
import "../_libs/d3-shape.mjs";
import "../_libs/d3-path.mjs";
import "../_libs/victory-vendor.mjs";
import "../_libs/d3-scale.mjs";
import "../_libs/internmap.mjs";
import "../_libs/d3-array.mjs";
import "../_libs/d3-time-format.mjs";
import "../_libs/d3-time.mjs";
import "../_libs/d3-interpolate.mjs";
import "../_libs/d3-color.mjs";
import "../_libs/d3-format.mjs";
import "../_libs/recharts-scale.mjs";
import "../_libs/decimal.js-light.mjs";
import "../_libs/eventemitter3.mjs";
function SystemRiskMonitoring() {
  const {
    riskAggregation
  } = useAdminStore((d) => d);
  const categories = [{
    key: "financial",
    title: "Financial",
    icon: Wallet,
    color: "var(--color-chart-1)"
  }, {
    key: "cybersecurity",
    title: "Cybersecurity",
    icon: ShieldCheck,
    color: "var(--color-chart-2)"
  }, {
    key: "compliance",
    title: "Compliance",
    icon: FileCheckCorner,
    color: "var(--color-chart-3)"
  }, {
    key: "operational",
    title: "Operational",
    icon: Cog,
    color: "var(--color-chart-4)"
  }];
  const chartData = categories.map((c) => ({
    category: c.title,
    low: riskAggregation[c.key].low,
    medium: riskAggregation[c.key].medium,
    high: riskAggregation[c.key].high
  }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold", children: "System Risk Monitoring" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 xl:grid-cols-4 gap-4", children: categories.map((c) => {
      const stats = riskAggregation[c.key];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(c.icon, { className: "h-4 w-4 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: c.title })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-3xl font-semibold", children: [
          stats.avgScore,
          "%"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground mb-3", children: "Average risk score" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-xs font-semibold uppercase rounded-full px-2 py-1 ${severityColor.low}`, children: [
            "Low: ",
            stats.low
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-xs font-semibold uppercase rounded-full px-2 py-1 ${severityColor.medium}`, children: [
            "Med: ",
            stats.medium
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-xs font-semibold uppercase rounded-full px-2 py-1 ${severityColor.high}`, children: [
            "High: ",
            stats.high
          ] })
        ] })
      ] }, c.key);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-semibold mb-1", children: "Risk Level Distribution by Category" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground mb-4", children: "Number of SMEs at each risk level per category" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-80", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: chartData, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--color-border)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "category", stroke: "var(--color-muted-foreground)", fontSize: 12 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { allowDecimals: false, stroke: "var(--color-muted-foreground)", fontSize: 12 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
          background: "var(--color-card)",
          border: "1px solid var(--color-border)",
          borderRadius: 8
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "low", name: "Low", fill: "var(--color-chart-2)", radius: [4, 4, 0, 0], stackId: "a" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "medium", name: "Medium", fill: "var(--color-chart-3)", stackId: "a" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "high", name: "High", fill: "var(--color-chart-5)", radius: [4, 4, 0, 0], stackId: "a" })
      ] }) }) })
    ] })
  ] });
}
export {
  SystemRiskMonitoring as component
};
