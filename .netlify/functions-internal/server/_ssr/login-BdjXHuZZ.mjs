import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useRouter, d as useRouterState, L as Link } from "../_libs/tanstack__react-router.mjs";
import { C as CsrfTokenField, L as Label } from "./label-vy6fOKey.mjs";
import { B as Button } from "./button-BjSzN4sD.mjs";
import { I as Input } from "./input-CtyJ1gXQ.mjs";
import { C as Card } from "./card-DbnvS79O.mjs";
import { consumePostLogoutLoginVisit, store, normalizeEmail } from "./router-BdVNv3tq.mjs";
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
function LoginPage() {
  const router = useRouter();
  const loginVisitKey = useRouterState({
    select: (s) => s.location.pathname === "/login" ? s.location.href : ""
  });
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [formKey, setFormKey] = reactExports.useState(0);
  reactExports.useEffect(() => {
    if (!loginVisitKey || !consumePostLogoutLoginVisit()) return;
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setFormKey((k) => k + 1);
  }, [loginVisitKey]);
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await store.authenticate(normalizeEmail(email), password);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Welcome back!");
      if (result.role === "SUPER_ADMIN") {
        router.navigate({
          to: "/admin/dashboard"
        });
      } else {
        router.navigate({
          to: "/app/dashboard"
        });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen grid lg:grid-cols-2 bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden lg:flex relative flex-col justify-between overflow-hidden p-10 bg-primary text-primary-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/images/login-brand-bg.png", alt: "", "aria-hidden": "true", className: "pointer-events-none absolute inset-0 h-full w-full object-cover" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/80 to-primary/90", "aria-hidden": "true" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "relative z-10 font-montserrat text-2xl font-bold", children: "Risk Sentinel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-semibold leading-tight", children: "Stay one step ahead of business risk." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 max-w-md opacity-80", children: "Monitor four risk categories in real time and get clear, prioritized actions when something needs your attention." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "relative z-10 text-sm text-primary-foreground/75", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Risk Sentinel"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-md p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-semibold tracking-tight", children: "Welcome back" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { method: "post", onSubmit: submit, className: "mt-6 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CsrfTokenField, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, autoComplete: "email" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", children: "Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PasswordInput, { id: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, autoComplete: "current-password", showPassword, onToggleVisibility: () => setShowPassword((v) => !v) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/forgot-password", className: "text-muted-foreground hover:text-foreground", children: "Forgot password?" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", disabled: loading, children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
          " Signing in…"
        ] }) : "Login" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-sm text-muted-foreground", children: [
          "No account?",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/register", className: "text-primary font-medium", children: "Register" })
        ] })
      ] }, formKey)
    ] }) })
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
  LoginPage as component
};
