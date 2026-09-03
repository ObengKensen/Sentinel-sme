import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { C as CsrfTokenField, L as Label } from "./label-vy6fOKey.mjs";
import { C as Card } from "./card-DbnvS79O.mjs";
import { I as Input } from "./input-CtyJ1gXQ.mjs";
import { B as Button } from "./button-BjSzN4sD.mjs";
import { S as Separator } from "./separator-BxhEne_V.mjs";
import { useStore, store } from "./router-BdVNv3tq.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { L as LoaderCircle, E as EyeOff, a as Eye } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-separator.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./jwt.shared-gMsek6D_.mjs";
import "../_libs/zod.mjs";
function AdminProfile() {
  const profile = useStore((s) => s.profile);
  const [form, setForm] = reactExports.useState({
    ownerName: profile.ownerName,
    email: profile.email,
    phone: profile.phone
  });
  const [saving, setSaving] = reactExports.useState(false);
  const [passwordForm, setPasswordForm] = reactExports.useState({
    current: "",
    next: "",
    confirm: ""
  });
  const [changingPassword, setChangingPassword] = reactExports.useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = reactExports.useState(false);
  const [showNewPassword, setShowNewPassword] = reactExports.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = reactExports.useState(false);
  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const result = await store.updateProfile(form);
    setSaving(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Profile updated.");
  };
  const changePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.next.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      toast.error("New passwords do not match.");
      return;
    }
    setChangingPassword(true);
    const result = await store.changePassword(passwordForm.current, passwordForm.next);
    setChangingPassword(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setPasswordForm({
      current: "",
      next: "",
      confirm: ""
    });
    toast.success("Password changed successfully.");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 lg:col-span-1 flex flex-col items-center text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-semibold", children: "SA" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 font-semibold text-lg", children: form.ownerName }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Super Administrator" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 text-sm text-muted-foreground space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: form.email }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: form.phone || "—" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 flex flex-col gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold mb-4", children: "Admin profile settings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { method: "post", onSubmit: save, className: "grid sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CsrfTokenField, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Display Name", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.ownerName, onChange: (e) => setForm({
            ...form,
            ownerName: e.target.value
          }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", value: form.email, onChange: (e) => setForm({
            ...form,
            email: e.target.value
          }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Phone", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.phone, onChange: (e) => setForm({
            ...form,
            phone: e.target.value
          }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: saving, children: saving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
            " Saving…"
          ] }) : "Save changes" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold mb-1", children: "Change password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground mb-4", children: "Update the password used to sign in to the admin portal." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { method: "post", onSubmit: changePassword, className: "grid sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CsrfTokenField, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Current password", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PasswordInput, { value: passwordForm.current, onChange: (e) => setPasswordForm({
            ...passwordForm,
            current: e.target.value
          }), required: true, autoComplete: "current-password", showPassword: showCurrentPassword, onToggleVisibility: () => setShowCurrentPassword((v) => !v) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden sm:block" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "New password", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PasswordInput, { value: passwordForm.next, onChange: (e) => setPasswordForm({
            ...passwordForm,
            next: e.target.value
          }), required: true, minLength: 6, autoComplete: "new-password", showPassword: showNewPassword, onToggleVisibility: () => setShowNewPassword((v) => !v) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Confirm new password", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PasswordInput, { value: passwordForm.confirm, onChange: (e) => setPasswordForm({
            ...passwordForm,
            confirm: e.target.value
          }), required: true, minLength: 6, autoComplete: "new-password", showPassword: showConfirmPassword, onToggleVisibility: () => setShowConfirmPassword((v) => !v) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "mb-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", variant: "secondary", disabled: changingPassword, children: changingPassword ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
              " Updating…"
            ] }) : "Update password" })
          ] })
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
  AdminProfile as component
};
