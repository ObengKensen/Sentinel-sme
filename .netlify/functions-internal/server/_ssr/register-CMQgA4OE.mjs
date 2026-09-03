import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useRouter, L as Link } from "../_libs/tanstack__react-router.mjs";
import { C as CsrfTokenField, L as Label } from "./label-vy6fOKey.mjs";
import { B as Button } from "./button-BjSzN4sD.mjs";
import { I as Input } from "./input-CtyJ1gXQ.mjs";
import { C as Card } from "./card-DbnvS79O.mjs";
import { A as Alert, a as AlertDescription } from "./alert-DZ6kwQYe.mjs";
import { EMAIL_ALREADY_EXISTS_ERROR, ORPHANED_PROFILE_ERROR, normalizeEmail, resolveEmailRegistrationConflict, store, adminStore } from "./router-BdVNv3tq.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { L as LoaderCircle, E as EyeOff, a as Eye } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./utils-B-5jxtHY.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./jwt.shared-gMsek6D_.mjs";
import "../_libs/zod.mjs";
const NAME_PATTERN = /^[A-Za-z\s'-]+$/;
const INVALID_BUSINESS_NAME_ERROR = "Business name can only contain letters, spaces, hyphens, and apostrophes (no numbers or special characters).";
const INVALID_OWNER_NAME_ERROR = "Owner name can only contain letters, spaces, hyphens, and apostrophes (no numbers or special characters).";
function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = reactExports.useState(false);
  const [formError, setFormError] = reactExports.useState(null);
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    businessType: "Retail",
    employees: 5,
    password: "",
    confirm: ""
  });
  const set = (k, v) => setForm((p) => ({
    ...p,
    [k]: v
  }));
  const submit = async (e) => {
    e.preventDefault();
    const businessName = form.businessName.trim();
    const ownerName = form.ownerName.trim();
    const email = form.email.trim();
    const employees = Number(form.employees);
    if (!businessName) {
      toast.error("Please enter your business name.");
      return;
    }
    if (!NAME_PATTERN.test(businessName)) {
      toast.error(INVALID_BUSINESS_NAME_ERROR);
      return;
    }
    if (!ownerName) {
      toast.error("Please enter the owner name.");
      return;
    }
    if (!NAME_PATTERN.test(ownerName)) {
      toast.error(INVALID_OWNER_NAME_ERROR);
      return;
    }
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    const normalizedEmail = normalizeEmail(email);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (Number.isNaN(employees) || !Number.isInteger(employees) || employees < 1) {
      toast.error("Please enter a valid number of employees (at least 1).");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    setFormError(null);
    const conflict = await resolveEmailRegistrationConflict(normalizedEmail);
    if (conflict === "exists") {
      setFormError(EMAIL_ALREADY_EXISTS_ERROR);
      return;
    }
    if (conflict === "orphaned") {
      setFormError(ORPHANED_PROFILE_ERROR);
      return;
    }
    setLoading(true);
    const result = await store.register({
      businessName,
      ownerName,
      email: normalizedEmail,
      phone: form.phone.trim(),
      businessType: form.businessType,
      employees
    }, form.password);
    setLoading(false);
    if (!result.ok) {
      if (result.error === EMAIL_ALREADY_EXISTS_ERROR || result.error === ORPHANED_PROFILE_ERROR) {
        setFormError(result.error);
      } else {
        toast.error(result.error);
      }
      return;
    }
    adminStore.refresh();
    toast.success("Account created. Welcome to Risk Sentinel!");
    router.navigate({
      to: "/app/dashboard"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center p-6 bg-secondary/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-2xl p-8 shadow-xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "font-montserrat text-2xl block mx-auto text-center font-bold mb-6", children: "Risk Sentinel" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-semibold tracking-tight", children: "Create your business account" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base text-muted-foreground mt-1", children: "Set up your SME profile to start monitoring risks." }),
    formError === EMAIL_ALREADY_EXISTS_ERROR && /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { variant: "destructive", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, { children: [
      "An account with this email already exists. Please",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "font-medium underline underline-offset-2", children: "sign in" }),
      " ",
      "instead."
    ] }) }),
    formError === ORPHANED_PROFILE_ERROR && /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { variant: "destructive", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, { children: [
      "An account with this email already exists but needs to be restored. Please use",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/forgot-password", className: "font-medium underline underline-offset-2", children: "Forgot password" }),
      " ",
      "to regain access — do not create a new account."
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { method: "post", onSubmit: submit, className: "mt-6 grid sm:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CsrfTokenField, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Business Name", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: form.businessName, onChange: (e) => set("businessName", e.target.value) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Owner Name", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: form.ownerName, onChange: (e) => set("ownerName", e.target.value) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", required: true, value: form.email, onChange: (e) => {
        set("email", e.target.value);
        if (formError) setFormError(null);
      }, autoComplete: "email" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Phone Number", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.phone, onChange: (e) => set("phone", e.target.value) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Business Type", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "h-9 px-3 rounded-md border bg-background text-sm w-full", value: form.businessType, onChange: (e) => set("businessType", e.target.value), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Retail" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Services" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Manufacturing" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Hospitality" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Technology" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Other" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Number of Employees", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: 1, required: true, value: form.employees, onChange: (e) => set("employees", Number(e.target.value)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Password", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PasswordInput, { required: true, minLength: 6, value: form.password, onChange: (e) => set("password", e.target.value), autoComplete: "new-password", showPassword, onToggleVisibility: () => setShowPassword((v) => !v) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Confirm Password", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PasswordInput, { required: true, minLength: 6, value: form.confirm, onChange: (e) => set("confirm", e.target.value), autoComplete: "new-password", showPassword, onToggleVisibility: () => setShowPassword((v) => !v) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2 mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", disabled: loading, children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
          " Creating account…"
        ] }) : "Create account" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-sm text-muted-foreground mt-3", children: [
          "Already have an account?",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-primary font-medium", children: "Login" })
        ] })
      ] })
    ] })
  ] }) });
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
function PasswordInput({
  showPassword,
  onToggleVisibility,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: showPassword ? "text" : "password", className: "pr-10", ...props }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", size: "icon", className: "absolute right-0 top-0 h-9 w-9 text-muted-foreground", onClick: onToggleVisibility, "aria-label": showPassword ? "Hide password" : "Show password", children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }) })
  ] });
}
export {
  RegisterPage as component
};
