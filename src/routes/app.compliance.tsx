import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, FileCheck2, Info } from "lucide-react";
import { CsrfTokenField } from "@/components/CsrfTokenField";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RiskCard } from "@/components/RiskCard";
import { complianceRisk, store, useStore, type ComplianceEntry } from "@/lib/risk-store";
import { toast } from "sonner";

export const Route = createFileRoute("/app/compliance")({ component: Page });

const daysUntil = (d: string) => Math.floor((new Date(d).getTime() - Date.now()) / 86400000);
const isValidDate = (d: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(d) && !Number.isNaN(new Date(d).getTime());

type Urgency = "overdue" | "due-soon" | "on-track";

type DeadlineGuidance = {
  label: string;
  date: string;
  status: string;
  days: number;
  urgency: Urgency;
  summary: string;
  actions: string[];
};

function urgencyOf(days: number): Urgency {
  if (days < 0) return "overdue";
  if (days <= 7) return "due-soon";
  return "on-track";
}

function getTaxGuidance(
  date: string,
  status: string,
  days: number,
): Omit<DeadlineGuidance, "label"> {
  const urgency = urgencyOf(days);
  if (urgency === "overdue") {
    return {
      date,
      status,
      days,
      urgency,
      summary: `Tax filing was due on ${date}. Current status: ${status}.`,
      actions: [
        "File outstanding tax submissions and contact a tax advisor.",
        "Confirm payment schedule for any penalties or interest.",
        'Update status to "Filed" once submissions are complete.',
      ],
    };
  }
  if (urgency === "due-soon") {
    return {
      date,
      status,
      days,
      urgency,
      summary: `Tax filing due in ${days} day${days === 1 ? "" : "s"} (${date}). Status: ${status}.`,
      actions: [
        "Prepare filing documents and confirm payment schedule.",
        "Gather receipts and financial records for the period.",
        "Set a calendar reminder 2 days before the deadline.",
      ],
    };
  }
  return {
    date,
    status,
    days,
    urgency,
    summary: `Next tax filing deadline: ${date}. Status: ${status}.`,
    actions: [
      "Review quarterly tax obligations and payment estimates.",
      "Maintain organized records ahead of filing season.",
      "Confirm filing method with your accountant or tax portal.",
    ],
  };
}

function getLicenseGuidance(
  date: string,
  status: string,
  days: number,
): Omit<DeadlineGuidance, "label"> {
  const urgency = urgencyOf(days);
  if (urgency === "overdue") {
    return {
      date,
      status,
      days,
      urgency,
      summary: `Business license expired on ${date}. Current status: ${status}.`,
      actions: [
        "Renew the license immediately to avoid operating illegally.",
        "Contact your local licensing authority for expedited renewal.",
        "Update status once renewal is confirmed.",
      ],
    };
  }
  if (urgency === "due-soon") {
    return {
      date,
      status,
      days,
      urgency,
      summary: `License renewal due in ${days} day${days === 1 ? "" : "s"} (${date}). Status: ${status}.`,
      actions: [
        "Submit renewal paperwork this week.",
        "Verify renewal fees and required supporting documents.",
        "Schedule any required inspections before expiry.",
      ],
    };
  }
  return {
    date,
    status,
    days,
    urgency,
    summary: `Business license valid until ${date}. Status: ${status}.`,
    actions: [
      "Review renewal requirements 30 days before expiry.",
      "Keep insurance and registration documents up to date.",
      "Confirm operating permits remain aligned with business activities.",
    ],
  };
}

function buildDeadlineGuidance(entry: ComplianceEntry): DeadlineGuidance[] {
  const taxDays = daysUntil(entry.taxDeadline);
  const licDays = daysUntil(entry.licenseExpiry);
  return [
    { label: "Tax filing", ...getTaxGuidance(entry.taxDeadline, entry.taxStatus, taxDays) },
    {
      label: "Business license renewal",
      ...getLicenseGuidance(entry.licenseExpiry, entry.licenseStatus, licDays),
    },
  ].sort((a, b) => a.days - b.days);
}

function Page() {
  const state = useStore((s) => s);
  const risk = complianceRisk(state);
  const latest = state.compliance.at(-1);

  const [showDeadlines, setShowDeadlines] = useState(state.compliance.length > 0);
  const [form, setForm] = useState({
    taxDeadline: "",
    taxStatus: latest?.taxStatus ?? "Pending",
    licenseExpiry: "",
    licenseStatus: latest?.licenseStatus ?? "Active",
  });

  const submit = (e: React.FormEvent) => {
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

  return (
    <div className="flex flex-col gap-6">
      <div className="grid md:grid-cols-3 gap-4">
        <RiskCard
          title="Compliance Risk"
          icon={FileCheck2}
          risk={risk}
          hasData={state.compliance.length > 0}
          emptyMessage="Submit your compliance check to see risk level"
        />
        <Countdown label="Tax deadline" days={taxDays} />
        <Countdown label="License expiry" days={licDays} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="text-xl font-semibold mb-1">Update compliance dates</div>
          <div className="text-sm text-muted-foreground mb-5">
            Within 7 days = warning. Passed = high risk.
          </div>
          <form method="post" onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
            <CsrfTokenField />
            <Field label="Tax Deadline">
              <DateInput
                value={form.taxDeadline}
                onChange={(e) => setForm({ ...form, taxDeadline: e.target.value })}
              />
            </Field>
            <Field label="Tax Status">
              <select
                className="h-9 px-3 rounded-md border bg-background text-sm"
                value={form.taxStatus}
                onChange={(e) => setForm({ ...form, taxStatus: e.target.value })}
              >
                <option>Pending</option>
                <option>Filed</option>
                <option>Overdue</option>
              </select>
            </Field>
            <Field label="License Expiry">
              <DateInput
                value={form.licenseExpiry}
                onChange={(e) => setForm({ ...form, licenseExpiry: e.target.value })}
              />
            </Field>
            <Field label="License Status">
              <select
                className="h-9 px-3 rounded-md border bg-background text-sm"
                value={form.licenseStatus}
                onChange={(e) => setForm({ ...form, licenseStatus: e.target.value })}
              >
                <option>Active</option>
                <option>Pending Renewal</option>
                <option>Expired</option>
              </select>
            </Field>
            <div className="sm:col-span-2">
              <Button type="submit" className="w-full">
                Save
              </Button>
            </div>
          </form>
        </Card>

        <Card className="p-6">
          <div className="text-xl font-semibold mb-1">Upcoming deadlines</div>
          <div className="text-sm text-muted-foreground mb-4">
            Guidance based on your saved compliance dates.
          </div>
          {!latest ? (
            <div className="text-sm text-muted-foreground py-6 text-center">
              Save your compliance check to see upcoming deadlines.
            </div>
          ) : (
            <>
              {mostUrgent?.urgency !== "on-track" && (
                <Alert
                  variant={mostUrgent?.urgency === "overdue" ? "destructive" : "default"}
                  className="mb-4"
                >
                  <Info className="h-4 w-4" />
                  <AlertTitle>
                    {mostUrgent?.urgency === "overdue" ? "Action required" : "Due soon"}
                  </AlertTitle>
                  <AlertDescription>{mostUrgent?.summary}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-4">
                {deadlines.map((item) => (
                  <DeadlineGuidance key={item.label} item={item} />
                ))}
              </div>
            </>
          )}
        </Card>
      </div>
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

function DateInput(props: React.ComponentProps<typeof Input>) {
  return (
    <div className="relative">
      <Input
        type="date"
        className="pr-9 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-9 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-moz-calendar-picker-indicator]:absolute [&::-moz-calendar-picker-indicator]:right-0 [&::-moz-calendar-picker-indicator]:h-full [&::-moz-calendar-picker-indicator]:w-9 [&::-moz-calendar-picker-indicator]:cursor-pointer [&::-moz-calendar-picker-indicator]:opacity-0"
        {...props}
      />
      <Calendar
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
    </div>
  );
}

function Countdown({ label, days }: { label: string; days: number }) {
  const tone = days < 0 ? "text-destructive" : days <= 7 ? "text-warning" : "text-success";
  return (
    <Card className="p-5">
      <div className="text-lg font-semibold">{label}</div>
      <div className={`text-3xl font-semibold mt-2 ${tone}`}>
        {days < 0 ? `${Math.abs(days)}d overdue` : `${days}d left`}
      </div>
    </Card>
  );
}

function DeadlineGuidance({ item }: { item: DeadlineGuidance }) {
  const badge =
    item.urgency === "overdue"
      ? "bg-destructive text-destructive-foreground"
      : item.urgency === "due-soon"
        ? "bg-warning text-warning-foreground"
        : "bg-success text-success-foreground";
  const badgeLabel =
    item.urgency === "overdue" ? "Overdue" : item.urgency === "due-soon" ? "Due soon" : "On track";

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold">{item.label}</div>
          <div className="text-sm text-muted-foreground mt-0.5">
            {item.date} · {item.status}
          </div>
        </div>
        <span className={`text-xs font-semibold rounded-full px-2 py-1 shrink-0 ${badge}`}>
          {badgeLabel}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">{item.summary}</p>
      <div>
        <div className="text-sm font-semibold mb-1.5">Recommended actions</div>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
          {item.actions.map((action) => (
            <li key={action}>{action}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
