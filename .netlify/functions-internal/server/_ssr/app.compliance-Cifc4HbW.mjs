import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { C as CsrfTokenField, L as Label } from "./label-vy6fOKey.mjs";
import { C as Card } from "./card-DbnvS79O.mjs";
import { I as Input } from "./input-CtyJ1gXQ.mjs";
import { B as Button } from "./button-BjSzN4sD.mjs";
import { A as Alert, b as AlertTitle, a as AlertDescription } from "./alert-DZ6kwQYe.mjs";
import { R as RiskCard } from "./RiskCard-CiPG8awz.mjs";
import { useStore, complianceRisk, store } from "./router-BdVNv3tq.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { F as FileCheckCorner, I as Info, o as Calendar } from "../_libs/lucide-react.mjs";
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
const daysUntil = (d) => Math.floor((new Date(d).getTime() - Date.now()) / 864e5);
const isValidDate = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d) && !Number.isNaN(new Date(d).getTime());
function urgencyOf(days) {
  if (days < 0) return "overdue";
  if (days <= 7) return "due-soon";
  return "on-track";
}
function getTaxGuidance(date, status, days) {
  const urgency = urgencyOf(days);
  if (urgency === "overdue") {
    return {
      date,
      status,
      days,
      urgency,
      summary: `Tax filing was due on ${date}. Current status: ${status}.`,
      actions: ["File outstanding tax submissions and contact a tax advisor.", "Confirm payment schedule for any penalties or interest.", 'Update status to "Filed" once submissions are complete.']
    };
  }
  if (urgency === "due-soon") {
    return {
      date,
      status,
      days,
      urgency,
      summary: `Tax filing due in ${days} day${days === 1 ? "" : "s"} (${date}). Status: ${status}.`,
      actions: ["Prepare filing documents and confirm payment schedule.", "Gather receipts and financial records for the period.", "Set a calendar reminder 2 days before the deadline."]
    };
  }
  return {
    date,
    status,
    days,
    urgency,
    summary: `Next tax filing deadline: ${date}. Status: ${status}.`,
    actions: ["Review quarterly tax obligations and payment estimates.", "Maintain organized records ahead of filing season.", "Confirm filing method with your accountant or tax portal."]
  };
}
function getLicenseGuidance(date, status, days) {
  const urgency = urgencyOf(days);
  if (urgency === "overdue") {
    return {
      date,
      status,
      days,
      urgency,
      summary: `Business license expired on ${date}. Current status: ${status}.`,
      actions: ["Renew the license immediately to avoid operating illegally.", "Contact your local licensing authority for expedited renewal.", "Update status once renewal is confirmed."]
    };
  }
  if (urgency === "due-soon") {
    return {
      date,
      status,
      days,
      urgency,
      summary: `License renewal due in ${days} day${days === 1 ? "" : "s"} (${date}). Status: ${status}.`,
      actions: ["Submit renewal paperwork this week.", "Verify renewal fees and required supporting documents.", "Schedule any required inspections before expiry."]
    };
  }
  return {
    date,
    status,
    days,
    urgency,
    summary: `Business license valid until ${date}. Status: ${status}.`,
    actions: ["Review renewal requirements 30 days before expiry.", "Keep insurance and registration documents up to date.", "Confirm operating permits remain aligned with business activities."]
  };
}
function buildDeadlineGuidance(entry) {
  const taxDays = daysUntil(entry.taxDeadline);
  const licDays = daysUntil(entry.licenseExpiry);
  return [{
    label: "Tax filing",
    ...getTaxGuidance(entry.taxDeadline, entry.taxStatus, taxDays)
  }, {
    label: "Business license renewal",
    ...getLicenseGuidance(entry.licenseExpiry, entry.licenseStatus, licDays)
  }].sort((a, b) => a.days - b.days);
}
function Page() {
  const state = useStore((s) => s);
  const risk = complianceRisk(state);
  const latest = state.compliance.at(-1);
  const [showDeadlines, setShowDeadlines] = reactExports.useState(state.compliance.length > 0);
  const [form, setForm] = reactExports.useState({
    taxDeadline: "",
    taxStatus: latest?.taxStatus ?? "Pending",
    licenseExpiry: "",
    licenseStatus: latest?.licenseStatus ?? "Active"
  });
  const submit = (e) => {
    e.preventDefault();
    if (!form.taxDeadline.trim() || !form.licenseExpiry.trim()) {
      toast.error("Please fill in all compliance date fields.");
      return;
    }
    if (!isValidDate(form.taxDeadline) || !isValidDate(form.licenseExpiry)) {
      toast.error("Please enter valid dates.");
      return;
    }
    store.addCompliance(form);
    setShowDeadlines(true);
    toast.success("Compliance record updated.");
  };
  const taxDays = latest ? daysUntil(latest.taxDeadline) : 0;
  const licDays = latest ? daysUntil(latest.licenseExpiry) : 0;
  const deadlines = latest ? buildDeadlineGuidance(latest) : [];
  const mostUrgent = deadlines[0];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(RiskCard, { title: "Compliance Risk", icon: FileCheckCorner, risk, hasData: state.compliance.length > 0, emptyMessage: "Submit your compliance check to see risk level" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Countdown, { label: "Tax deadline", days: taxDays }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Countdown, { label: "License expiry", days: licDays })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-semibold mb-1", children: "Update compliance dates" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground mb-5", children: "Within 7 days = warning. Passed = high risk." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { method: "post", onSubmit: submit, className: "grid sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CsrfTokenField, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Tax Deadline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DateInput, { value: form.taxDeadline, onChange: (e) => setForm({
            ...form,
            taxDeadline: e.target.value
          }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Tax Status", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "h-9 px-3 rounded-md border bg-background text-sm", value: form.taxStatus, onChange: (e) => setForm({
            ...form,
            taxStatus: e.target.value
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Pending" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Filed" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Overdue" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "License Expiry", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DateInput, { value: form.licenseExpiry, onChange: (e) => setForm({
            ...form,
            licenseExpiry: e.target.value
          }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "License Status", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "h-9 px-3 rounded-md border bg-background text-sm", value: form.licenseStatus, onChange: (e) => setForm({
            ...form,
            licenseStatus: e.target.value
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Active" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Pending Renewal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Expired" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", children: "Save" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-semibold mb-1", children: "Upcoming deadlines" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground mb-4", children: "Guidance based on your saved compliance dates." }),
        !latest ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground py-6 text-center", children: "Save your compliance check to see upcoming deadlines." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          mostUrgent?.urgency !== "on-track" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { variant: mostUrgent?.urgency === "overdue" ? "destructive" : "default", className: "mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTitle, { children: mostUrgent?.urgency === "overdue" ? "Action required" : "Due soon" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: mostUrgent?.summary })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: deadlines.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(DeadlineGuidance, { item }, item.label)) })
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
function DateInput(props) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", className: "pr-9 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-9 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-moz-calendar-picker-indicator]:absolute [&::-moz-calendar-picker-indicator]:right-0 [&::-moz-calendar-picker-indicator]:h-full [&::-moz-calendar-picker-indicator]:w-9 [&::-moz-calendar-picker-indicator]:cursor-pointer [&::-moz-calendar-picker-indicator]:opacity-0", ...props }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground", "aria-hidden": true })
  ] });
}
function Countdown({
  label,
  days
}) {
  const tone = days < 0 ? "text-destructive" : days <= 7 ? "text-warning" : "text-success";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-semibold", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-3xl font-semibold mt-2 ${tone}`, children: days < 0 ? `${Math.abs(days)}d overdue` : `${days}d left` })
  ] });
}
function DeadlineGuidance({
  item
}) {
  const badge = item.urgency === "overdue" ? "bg-destructive text-destructive-foreground" : item.urgency === "due-soon" ? "bg-warning text-warning-foreground" : "bg-success text-success-foreground";
  const badgeLabel = item.urgency === "overdue" ? "Overdue" : item.urgency === "due-soon" ? "Due soon" : "On track";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border rounded-lg p-4 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-semibold", children: item.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground mt-0.5", children: [
          item.date,
          " · ",
          item.status
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs font-semibold rounded-full px-2 py-1 shrink-0 ${badge}`, children: badgeLabel })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: item.summary }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold mb-1.5", children: "Recommended actions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "text-sm text-muted-foreground space-y-1 list-disc pl-4", children: item.actions.map((action) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: action }, action)) })
    ] })
  ] });
}
export {
  Page as component
};
