import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { CsrfTokenField } from "@/components/CsrfTokenField";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { store, useStore } from "@/lib/risk-store";
import { toast } from "sonner";

export const Route = createFileRoute("/app/profile")({ component: Page });

function Page() {
  const profile = useStore((s) => s.profile);
  const [form, setForm] = useState(profile);
  const [saving, setSaving] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });
  const [changingPassword, setChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const save = async (e: React.FormEvent) => {
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

  const changePassword = async (e: React.FormEvent) => {
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
    setPasswordForm({ current: "", next: "", confirm: "" });
    toast.success("Password changed successfully.");
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="p-6 lg:col-span-1 flex flex-col items-center text-center">
        <div className="h-20 w-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-semibold">
          {profile.ownerName.split(" ").map((p) => p[0]).slice(0, 2).join("") || "?"}
        </div>
        <div className="mt-4 font-semibold text-lg">{profile.ownerName || "Your name"}</div>
        <div className="text-sm text-muted-foreground">{profile.businessName || "Your business"}</div>
        <div className="mt-4 text-sm text-muted-foreground space-y-1">
          <div>{profile.email}</div>
          <div>{profile.phone}</div>
        </div>
      </Card>

      <div className="lg:col-span-2 flex flex-col gap-6">
        <Card className="p-6">
          <div className="font-semibold mb-4">Business & account settings</div>
          <form method="post" onSubmit={save} className="grid sm:grid-cols-2 gap-4">
            <CsrfTokenField />
            <Field label="Business Name"><Input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} /></Field>
            <Field label="Owner Name"><Input value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} /></Field>
            <Field label="Email"><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
            <Field label="Phone"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
            <Field label="Business Type">
              <select className="h-9 px-3 rounded-md border bg-background text-sm w-full" value={form.businessType} onChange={(e) => setForm({ ...form, businessType: e.target.value })}>
                <option>Retail</option><option>Services</option><option>Manufacturing</option><option>Hospitality</option><option>Technology</option><option>Other</option>
              </select>
            </Field>
            <Field label="Employees"><Input type="number" value={form.employees} onChange={(e) => setForm({ ...form, employees: Number(e.target.value) })} /></Field>
            <div className="sm:col-span-2 flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving…</> : "Save changes"}
              </Button>
              <Button type="button" variant="outline" onClick={() => { store.reset(); toast.success("All risk data cleared."); }}>Clear risk data</Button>
            </div>
          </form>
        </Card>

        <Card className="p-6">
          <div className="font-semibold mb-1">Change password</div>
          <div className="text-sm text-muted-foreground mb-4">Update the password used to sign in to Risk Sentinel.</div>
          <form method="post" onSubmit={changePassword} className="grid sm:grid-cols-2 gap-4">
            <CsrfTokenField />
            <Field label="Current password">
              <PasswordInput
                value={passwordForm.current}
                onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                required
                autoComplete="current-password"
                showPassword={showCurrentPassword}
                onToggleVisibility={() => setShowCurrentPassword((v) => !v)}
              />
            </Field>
            <div className="hidden sm:block" />
            <Field label="New password">
              <PasswordInput
                value={passwordForm.next}
                onChange={(e) => setPasswordForm({ ...passwordForm, next: e.target.value })}
                required
                minLength={6}
                autoComplete="new-password"
                showPassword={showNewPassword}
                onToggleVisibility={() => setShowNewPassword((v) => !v)}
              />
            </Field>
            <Field label="Confirm new password">
              <PasswordInput
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                required
                minLength={6}
                autoComplete="new-password"
                showPassword={showConfirmPassword}
                onToggleVisibility={() => setShowConfirmPassword((v) => !v)}
              />
            </Field>
            <div className="sm:col-span-2">
              <Separator className="mb-4" />
              <Button type="submit" variant="secondary" disabled={changingPassword}>
                {changingPassword ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Updating…</> : "Update password"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="flex flex-col gap-1.5"><Label>{label}</Label>{children}</div>;
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
