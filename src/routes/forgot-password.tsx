import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { CsrfTokenField } from "@/components/CsrfTokenField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { store } from "@/lib/risk-store";
import { hydrateAuth, isAuthenticated, normalizeEmail } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  beforeLoad: async () => {
    await hydrateAuth();
    if (isAuthenticated()) throw redirect({ to: "/app/dashboard" });
  },
  head: () => ({ meta: [{ title: "Reset Password — Risk Sentinel" }] }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    const result = await store.resetPassword(normalizeEmail(email), password);
    setLoading(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    setDone(true);
    toast.success("Password updated. You can sign in now.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-secondary/40">
      <Card className="w-full max-w-md p-8">
        <Link to="/" className="font-montserrat text-2xl inline-block font-bold mb-6">
          Risk Sentinel
        </Link>

        {done ? (
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Password reset</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Your password has been updated successfully.
            </p>
            <Button asChild className="mt-6 w-full">
              <Link to="/login">Back to login</Link>
            </Button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Enter your account email and choose a new password.
            </p>
            <p className="text-sm text-muted-foreground mt-3 rounded-lg border bg-muted/40 px-3 py-2">
              Prototype mode: no email verification is sent. Enter the email tied to your account.
            </p>
            <form method="post" onSubmit={submit} className="mt-6 space-y-4">
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
                <Label htmlFor="password">New password</Label>
                <PasswordInput
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  showPassword={showPassword}
                  onToggleVisibility={() => setShowPassword((v) => !v)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm">Confirm new password</Label>
                <PasswordInput
                  id="confirm"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  showPassword={showConfirmPassword}
                  onToggleVisibility={() => setShowConfirmPassword((v) => !v)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Updating…
                  </>
                ) : (
                  "Update password"
                )}
              </Button>
            </form>
          </>
        )}

        <Link
          to="/login"
          className="mt-6 flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to login
        </Link>
      </Card>
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
