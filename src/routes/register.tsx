import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { CsrfTokenField } from "@/components/CsrfTokenField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { adminStore } from "@/lib/admin-store";
import { store } from "@/lib/risk-store";
import {
  ensureSeeded,
  hydrateAuth,
  isAuthenticated,
  isSuperAdmin,
  normalizeEmail,
  resolveEmailRegistrationConflict,
  EMAIL_ALREADY_EXISTS_ERROR,
  ORPHANED_PROFILE_ERROR,
} from "@/lib/auth";
import { toast } from "sonner";

/** Letters, spaces, hyphens, and apostrophes only (e.g. O'Brien, Smith-Jones). */
const NAME_PATTERN = /^[A-Za-z\s'-]+$/;

const INVALID_BUSINESS_NAME_ERROR =
  "Business name can only contain letters, spaces, hyphens, and apostrophes (no numbers or special characters).";

const INVALID_OWNER_NAME_ERROR =
  "Owner name can only contain letters, spaces, hyphens, and apostrophes (no numbers or special characters).";

export const Route = createFileRoute("/register")({
  beforeLoad: async () => {
    await ensureSeeded();
    await hydrateAuth();
    if (isAuthenticated()) {
      if (isSuperAdmin()) throw redirect({ to: "/admin/dashboard" });
      throw redirect({ to: "/app/dashboard" });
    }
  },
  head: () => ({ meta: [{ title: "Register — Risk Sentinel" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    businessType: "Retail",
    employees: 5,
    password: "",
    confirm: "",
  });

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
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
    const result = await store.register(
      {
        businessName,
        ownerName,
        email: normalizedEmail,
        phone: form.phone.trim(),
        businessType: form.businessType,
        employees,
      },
      form.password,
    );
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
    router.navigate({ to: "/app/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-secondary/40">
      <Card className="w-full max-w-2xl p-8 shadow-xl">
        <Link to="/" className="font-montserrat text-2xl block mx-auto text-center font-bold mb-6">
          Risk Sentinel
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">Create your business account</h1>
        <p className="text-base text-muted-foreground mt-1">
          Set up your SME profile to start monitoring risks.
        </p>
        {formError === EMAIL_ALREADY_EXISTS_ERROR && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>
              An account with this email already exists. Please{" "}
              <Link to="/login" className="font-medium underline underline-offset-2">
                sign in
              </Link>{" "}
              instead.
            </AlertDescription>
          </Alert>
        )}
        {formError === ORPHANED_PROFILE_ERROR && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>
              An account with this email already exists but needs to be restored. Please use{" "}
              <Link to="/forgot-password" className="font-medium underline underline-offset-2">
                Forgot password
              </Link>{" "}
              to regain access — do not create a new account.
            </AlertDescription>
          </Alert>
        )}
        <form method="post" onSubmit={submit} className="mt-6 grid sm:grid-cols-2 gap-4">
          <CsrfTokenField />
          <Field label="Business Name">
            <Input
              required
              value={form.businessName}
              onChange={(e) => set("businessName", e.target.value)}
            />
          </Field>
          <Field label="Owner Name">
            <Input
              required
              value={form.ownerName}
              onChange={(e) => set("ownerName", e.target.value)}
            />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              required
              value={form.email}
              onChange={(e) => {
                set("email", e.target.value);
                if (formError) setFormError(null);
              }}
              autoComplete="email"
            />
          </Field>
          <Field label="Phone Number">
            <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </Field>
          <Field label="Business Type">
            <select
              className="h-9 px-3 rounded-md border bg-background text-sm w-full"
              value={form.businessType}
              onChange={(e) => set("businessType", e.target.value)}
            >
              <option>Retail</option>
              <option>Services</option>
              <option>Manufacturing</option>
              <option>Hospitality</option>
              <option>Technology</option>
              <option>Other</option>
            </select>
          </Field>
          <Field label="Number of Employees">
            <Input
              type="number"
              min={1}
              required
              value={form.employees}
              onChange={(e) => set("employees", Number(e.target.value))}
            />
          </Field>
          <Field label="Password">
            <PasswordInput
              required
              minLength={6}
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              autoComplete="new-password"
              showPassword={showPassword}
              onToggleVisibility={() => setShowPassword((v) => !v)}
            />
          </Field>
          <Field label="Confirm Password">
            <PasswordInput
              required
              minLength={6}
              value={form.confirm}
              onChange={(e) => set("confirm", e.target.value)}
              autoComplete="new-password"
              showPassword={showPassword}
              onToggleVisibility={() => setShowPassword((v) => !v)}
            />
          </Field>
          <div className="sm:col-span-2 mt-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating account…
                </>
              ) : (
                "Create account"
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground mt-3">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium">
                Login
              </Link>
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function PasswordInput({
  showPassword,
  onToggleVisibility,
  ...props
}: React.ComponentProps<typeof Input> & {
  showPassword: boolean;
  onToggleVisibility: () => void;
}) {
  return (
    <div className="relative">
      <Input type={showPassword ? "text" : "password"} className="pr-10" {...props} />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-9 w-9 text-muted-foreground"
        onClick={onToggleVisibility}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  );
}
