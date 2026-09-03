import { createFileRoute, Link, redirect, useRouter, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { CsrfTokenField } from "@/components/CsrfTokenField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { consumePostLogoutLoginVisit, isPostLogoutLoginVisit, store } from "@/lib/risk-store";
import {
  clearSession,
  ensureSeeded,
  hydrateAuth,
  isAuthenticated,
  isSuperAdmin,
  normalizeEmail,
} from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    await ensureSeeded();
    if (isPostLogoutLoginVisit()) {
      clearSession();
      return;
    }
    await hydrateAuth();
    if (isAuthenticated()) {
      if (isSuperAdmin()) throw redirect({ to: "/admin/dashboard" });
      throw redirect({ to: "/app/dashboard" });
    }
  },
  head: () => ({ meta: [{ title: "Login — Risk Sentinel" }] }),
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  const loginVisitKey = useRouterState({
    select: (s) => (s.location.pathname === "/login" ? s.location.href : ""),
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (!loginVisitKey || !consumePostLogoutLoginVisit()) return;
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setFormKey((k) => k + 1);
  }, [loginVisitKey]);

  const submit = async (e: React.FormEvent) => {
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
        router.navigate({ to: "/admin/dashboard" });
      } else {
        router.navigate({ to: "/app/dashboard" });
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Login failed. Check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex relative flex-col justify-between overflow-hidden p-10 bg-primary text-primary-foreground">
        <img
          src="/images/login-brand-bg.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/80 to-primary/90"
          aria-hidden="true"
        />
        <Link to="/" className="relative z-10 font-montserrat text-2xl font-bold">
          Risk Sentinel
        </Link>
        <div className="relative z-10">
          <h2 className="text-3xl font-semibold leading-tight">
            Stay one step ahead of business risk.
          </h2>
          <p className="mt-3 max-w-md opacity-80">
            Monitor four risk categories in real time and get clear, prioritized actions when
            something needs your attention.
          </p>
        </div>
        <p className="relative z-10 text-sm text-primary-foreground/75">
          © {new Date().getFullYear()} Risk Sentinel
        </p>
      </div>
      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8">
          <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
          <form key={formKey} method="post" onSubmit={submit} className="mt-6 space-y-4">
            <CsrfTokenField />
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                showPassword={showPassword}
                onToggleVisibility={() => setShowPassword((v) => !v)}
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <Link to="/forgot-password" className="text-muted-foreground hover:text-foreground">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Signing in…
                </>
              ) : (
                "Login"
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              No account?{" "}
              <Link to="/register" className="text-primary font-medium">
                Register
              </Link>
            </p>
          </form>
        </Card>
      </div>
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
