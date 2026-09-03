import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { C as Card } from "./card-DbnvS79O.mjs";
import { R as RiskCard } from "./RiskCard-CiPG8awz.mjs";
import { useStore, financialRisk, cyberRisk, complianceRisk, operationalRisk, overallRisk, getRecommendations, hasFinancialData, hasCyberData, hasComplianceData, hasOperationalData, hasAnyRiskData, severityColor, alertStatusColor } from "./router-BdVNv3tq.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import { W as Wallet, S as ShieldCheck, F as FileCheckCorner, C as Cog, f as ShieldAlert, h as Lightbulb, g as ArrowRight, l as CirclePlus } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, B as BarChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, L as Legend, a as Bar, P as PieChart, b as Pie, c as Cell, d as LineChart, e as Line } from "../_libs/recharts.mjs";
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
import "./utils-B-5jxtHY.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "./ScoreBar-B4WgMYtn.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
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
function Dashboard() {
  const state = useStore((s) => s);
  const fin = financialRisk(state);
  const cyb = cyberRisk(state);
  const com = complianceRisk(state);
  const ops = operationalRisk(state);
  const all = overallRisk(state);
  const incomeExpense = state.financial.slice(-6).map((e) => ({
    month: new Date(e.date).toLocaleDateString(void 0, {
      month: "short"
    }),
    income: e.income,
    expenses: e.expenses
  }));
  const distribution = [{
    name: "Financial",
    value: fin.score
  }, {
    name: "Cybersecurity",
    value: cyb.score
  }, {
    name: "Compliance",
    value: com.score
  }, {
    name: "Operational",
    value: ops.score
  }];
  const colors = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)"];
  const trend = state.financial.slice(-6).map((e, i) => {
    const arr = state.financial.slice(0, state.financial.length - 5 + i);
    const cut = {
      ...state,
      financial: arr
    };
    return {
      month: new Date(e.date).toLocaleDateString(void 0, {
        month: "short"
      }),
      score: overallRisk(cut).score
    };
  });
  const recent = [...state.alerts].sort((a, b) => {
    const order = {
      active: 0,
      reviewed: 1,
      resolved: 2
    };
    const statusDiff = order[a.status] - order[b.status];
    if (statusDiff !== 0) return statusDiff;
    return b.date.localeCompare(a.date);
  }).slice(0, 5);
  const activeAlertCount = state.alerts.filter((a) => a.status === "active").length;
  const highActiveCount = state.alerts.filter((a) => a.status === "active" && a.severity === "high").length;
  const recommendations = getRecommendations(state);
  const quickActions = [{
    label: "Financial data",
    href: "/app/financial",
    icon: Wallet
  }, {
    label: "Cyber check",
    href: "/app/cybersecurity",
    icon: ShieldCheck
  }, {
    label: "Compliance",
    href: "/app/compliance",
    icon: FileCheckCorner
  }, {
    label: "Operations",
    href: "/app/operational",
    icon: Cog
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3 xl:gap-4 [&>*]:min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(RiskCard, { title: "Financial Risk", icon: Wallet, risk: fin, hasData: hasFinancialData(state) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(RiskCard, { title: "Cybersecurity Risk", icon: ShieldCheck, risk: cyb, hasData: hasCyberData(state) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(RiskCard, { title: "Compliance Risk", icon: FileCheckCorner, risk: com, hasData: hasComplianceData(state) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(RiskCard, { title: "Operational Risk", icon: Cog, risk: ops, hasData: hasOperationalData(state) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(RiskCard, { title: "Overall Risk", icon: ShieldAlert, risk: all, hasData: hasAnyRiskData(state), emptyMessage: "Submit monitoring data to see overall risk level" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { className: "h-4 w-4 text-accent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-semibold", children: "Recommended actions" }) })
        ] }),
        recommendations.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground py-4 text-center", children: "All clear — no urgent actions right now." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: recommendations.map((rec) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 border rounded-lg p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs font-semibold uppercase rounded-full px-2 py-1 shrink-0 ${rec.priority >= 3 ? severityColor.high : rec.priority >= 2 ? severityColor.medium : severityColor.low}`, children: rec.priority >= 3 ? "High" : rec.priority >= 2 ? "Medium" : "Low" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm", children: rec.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground mt-0.5", children: rec.action })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: rec.href, className: "text-sm text-primary flex items-center gap-1 shrink-0", children: [
            "Go ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3 w-3" })
          ] })
        ] }, rec.title)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "h-4 w-4 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-semibold", children: "Quick submit" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-2", children: quickActions.map((action) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: action.href, className: "flex items-center gap-3 rounded-lg border p-3 text-sm hover:bg-muted/50 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(action.icon, { className: "h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: action.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5 ml-auto text-muted-foreground" })
        ] }, action.href)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-semibold", children: "Income vs Expenses" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Last six recorded periods" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-72", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: incomeExpense, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--color-border)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "month", stroke: "var(--color-muted-foreground)", fontSize: 12 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { stroke: "var(--color-muted-foreground)", fontSize: 12 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
            background: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: 8
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "income", fill: "var(--color-chart-2)", radius: [6, 6, 0, 0] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "expenses", fill: "var(--color-chart-5)", radius: [6, 6, 0, 0] })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-semibold mb-1", children: "Risk Distribution" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground mb-2", children: "By category score" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-72", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pie, { data: distribution, dataKey: "value", nameKey: "name", outerRadius: 90, innerRadius: 50, children: distribution.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: colors[i] }, i)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
            background: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: 8
          } })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 lg:col-span-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-semibold mb-1", children: "Monthly Risk Trend" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground mb-4", children: "Overall risk score over time" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(LineChart, { data: trend, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--color-border)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "month", stroke: "var(--color-muted-foreground)", fontSize: 12 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { domain: [0, 100], stroke: "var(--color-muted-foreground)", fontSize: 12 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
            background: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: 8
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Line, { type: "monotone", dataKey: "score", stroke: "var(--color-chart-1)", strokeWidth: 3, dot: {
            r: 4
          } })
        ] }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-semibold", children: "Recent Alerts" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
            activeAlertCount,
            " active",
            highActiveCount > 0 ? ` · ${highActiveCount} high severity` : ""
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/alerts", className: "text-sm text-primary flex items-center gap-1", children: [
          "View all ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5" })
        ] })
      ] }),
      recent.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground py-6 text-center", children: "No alerts yet. Submit monitoring data to generate alerts." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y", children: recent.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-3 flex items-start gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs font-semibold uppercase rounded-full px-2 py-1 ${severityColor[a.severity]}`, children: a.severity }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm", children: a.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: a.action }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground font-mono mt-1", children: a.id })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground capitalize shrink-0", children: a.category }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs font-semibold capitalize rounded-full px-2 py-1 shrink-0 ${alertStatusColor[a.status]}`, children: a.status }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground shrink-0", children: a.date })
      ] }, a.id)) })
    ] })
  ] });
}
export {
  Dashboard as component
};
