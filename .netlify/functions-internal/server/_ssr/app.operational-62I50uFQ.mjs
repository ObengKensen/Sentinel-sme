import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { C as CsrfTokenField, L as Label } from "./label-vy6fOKey.mjs";
import { C as Card } from "./card-DbnvS79O.mjs";
import { I as Input } from "./input-CtyJ1gXQ.mjs";
import { B as Button } from "./button-BjSzN4sD.mjs";
import { R as RiskCard } from "./RiskCard-CiPG8awz.mjs";
import { useStore, operationalRisk, store } from "./router-BdVNv3tq.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { C as Cog } from "../_libs/lucide-react.mjs";
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
function parseStaffInput(value) {
  let hasInvalid = false;
  let result = "";
  for (const char of value) {
    if (char >= "0" && char <= "9") {
      result += char;
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
  const risk = operationalRisk(state);
  const latest = state.operational.at(-1);
  const [form, setForm] = reactExports.useState({
    staffPresent: "",
    staffRequired: "",
    equipment: latest?.equipment ?? "working",
    delivery: latest?.delivery ?? "on-schedule"
  });
  const updateField = (field, raw) => {
    const {
      value,
      hasInvalid
    } = parseStaffInput(raw);
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
    if (!form.staffPresent.trim() || !form.staffRequired.trim()) {
      toast.error("Please fill in all staff fields.");
      return;
    }
    const staffPresent = Number(form.staffPresent);
    const staffRequired = Number(form.staffRequired);
    if ([staffPresent, staffRequired].some((n) => Number.isNaN(n) || n < 0)) {
      toast.error("Please enter valid non-negative numbers.");
      return;
    }
    store.addOperational({
      staffPresent,
      staffRequired,
      equipment: form.equipment,
      delivery: form.delivery
    });
    toast.success("Operational status updated.");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(RiskCard, { title: "Operational Risk", icon: Cog, risk, hasData: state.operational.length > 0, emptyMessage: "Submit your operational check to see risk level" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Status, { label: "Staff", value: `${latest?.staffPresent ?? 0}/${latest?.staffRequired ?? 0}`, ok: (latest?.staffPresent ?? 0) >= (latest?.staffRequired ?? 0) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Status, { label: "Equipment", value: latest?.equipment ?? "—", ok: latest?.equipment === "working" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Status, { label: "Delivery", value: latest?.delivery ?? "—", ok: latest?.delivery === "on-schedule" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-semibold mb-1", children: "Submit operational status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground mb-5", children: "Medium risk: low staff, faulty equipment, or delayed delivery." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { method: "post", onSubmit: submit, className: "grid sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CsrfTokenField, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Staff Present", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "text", inputMode: "numeric", value: form.staffPresent, onChange: (e) => updateField("staffPresent", e.target.value) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Staff Required", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "text", inputMode: "numeric", value: form.staffRequired, onChange: (e) => updateField("staffRequired", e.target.value) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Equipment Status", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "h-9 px-3 rounded-md border bg-background text-sm", value: form.equipment, onChange: (e) => setForm({
            ...form,
            equipment: e.target.value
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "working", children: "Working" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "faulty", children: "Faulty" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Delivery Status", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "h-9 px-3 rounded-md border bg-background text-sm", value: form.delivery, onChange: (e) => setForm({
            ...form,
            delivery: e.target.value
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "on-schedule", children: "On schedule" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "delayed", children: "Delayed" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", children: "Submit" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-semibold mb-3", children: "History" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-sm text-muted-foreground border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2", children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Staff" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Equipment" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Delivery" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y text-center", children: [...state.operational].reverse().map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 text-left", children: e.date }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { children: [
              e.staffPresent,
              "/",
              e.staffRequired
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "capitalize", children: e.equipment }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "capitalize", children: e.delivery })
          ] }, e.id)) })
        ] })
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
function Status({
  label,
  value,
  ok
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-semibold", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-semibold mt-2 capitalize", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mt-3 inline-block text-xs font-semibold rounded-full px-2 py-1 ${ok ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"}`, children: ok ? "OK" : "Attention" })
  ] });
}
export {
  Page as component
};
