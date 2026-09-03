import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { C as CsrfTokenField, L as Label } from "./label-vy6fOKey.mjs";
import { C as Card } from "./card-DbnvS79O.mjs";
import { I as Input } from "./input-CtyJ1gXQ.mjs";
import { B as Button } from "./button-BjSzN4sD.mjs";
import { R as RiskCard } from "./RiskCard-CiPG8awz.mjs";
import { useStore, financialRisk, hasFinancialData, store } from "./router-BdVNv3tq.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { W as Wallet } from "../_libs/lucide-react.mjs";
import "./csrf-C3jkS9Bv.mjs";
import "./server-DpwYz346.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./utils-B-5jxtHY.mjs";
import "../_libs/tailwind-merge.mjs";
import "./ScoreBar-B4WgMYtn.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./jwt.shared-gMsek6D_.mjs";
import "../_libs/zod.mjs";
function parseFinancialInput(value) {
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
  return {
    value: result,
    hasInvalid
  };
}
function Page() {
  const state = useStore((s) => s);
  const risk = financialRisk(state);
  const [form, setForm] = reactExports.useState({
    income: "",
    expenses: "",
    outstanding: ""
  });
  const updateField = (field, raw) => {
    const {
      value,
      hasInvalid
    } = parseFinancialInput(raw);
    if (hasInvalid) {
      toast.error("Please enter numbers only.");
    }
    setForm({
      ...form,
      [field]: value
    });
  };
  const submit = (e) => {
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
    store.addFinancial({
      income,
      expenses,
      outstanding
    });
    toast.success("Financial data submitted. Risk recalculated.");
  };
  const hasData = hasFinancialData(state);
  const latest = hasData ? state.financial.at(-1) : void 0;
  const profit = latest ? latest.income - latest.expenses : 0;
  const margin = latest && latest.income ? (profit / latest.income * 100).toFixed(1) : "0";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(RiskCard, { title: "Financial Risk", icon: Wallet, risk, hasData, emptyMessage: "Submit your financial check to see risk level" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-semibold", children: "Profit" }),
        hasData && latest ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-3xl font-semibold mt-2", children: [
            "₵",
            profit.toLocaleString()
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground mt-1", children: [
            "Margin: ",
            margin,
            "%"
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-snug mt-2", children: "Save your financial check to see profit and margin." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-semibold", children: "Outstanding payments" }),
        hasData && latest ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-3xl font-semibold mt-2", children: [
            "₵",
            latest.outstanding.toLocaleString()
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground mt-1", children: "Latest submission" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-snug mt-2", children: "Save your financial check to see outstanding payments." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-semibold mb-1", children: "Submit financial data" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground mb-5", children: "Flags risk if expenses exceed income, margin is low, or outstanding payments exceed 20%." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { method: "post", onSubmit: submit, className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CsrfTokenField, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Income (₵)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "text", inputMode: "decimal", value: form.income, onChange: (e) => updateField("income", e.target.value) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Expenses (₵)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "text", inputMode: "decimal", value: form.expenses, onChange: (e) => updateField("expenses", e.target.value) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Outstanding Payments (₵)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "text", inputMode: "decimal", value: form.outstanding, onChange: (e) => updateField("outstanding", e.target.value) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", children: "Submit" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-semibold mb-3", children: "Historical records" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-auto max-h-[420px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-sm text-muted-foreground border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2", children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right", children: "Income" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right", children: "Expenses" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right", children: "Outstanding" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y", children: [...state.financial].reverse().map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2", children: e.date }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "text-right", children: [
              "₵",
              e.income.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "text-right", children: [
              "₵",
              e.expenses.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "text-right", children: [
              "₵",
              e.outstanding.toLocaleString()
            ] })
          ] }, e.id)) })
        ] }) })
      ] })
    ] })
  ] });
}
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: label }),
    children
  ] });
}
export {
  Page as component
};
