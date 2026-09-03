import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Cog } from "lucide-react";
import { CsrfTokenField } from "@/components/CsrfTokenField";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RiskCard } from "@/components/RiskCard";
import { operationalRisk, store, useStore } from "@/lib/risk-store";
import { toast } from "sonner";

export const Route = createFileRoute("/app/operational")({ component: Page });

function parseStaffInput(value: string): { value: string; hasInvalid: boolean } {
  let hasInvalid = false;
  let result = "";

  for (const char of value) {
    if (char >= "0" && char <= "9") {
      result += char;
    } else {
      hasInvalid = true;
    }
  }

  return { value: result, hasInvalid };
}

function Page() {
  const state = useStore((s) => s);
  const risk = operationalRisk(state);
  const latest = state.operational.at(-1);

  const [form, setForm] = useState({
    staffPresent: "",
    staffRequired: "",
    equipment: latest?.equipment ?? ("working" as "working" | "faulty"),
    delivery: latest?.delivery ?? ("on-schedule" as "on-schedule" | "delayed"),
  });

  const updateField = (field: "staffPresent" | "staffRequired", raw: string) => {
    const { value, hasInvalid } = parseStaffInput(raw);
    if (hasInvalid) {
      toast.error("Please enter numbers only.");
    }
    setForm({ ...form, [field]: value });
  };

  const submit = (e: React.FormEvent) => {
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
      delivery: form.delivery,
    });
    toast.success("Operational status updated.");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid md:grid-cols-4 gap-4">
        <RiskCard
          title="Operational Risk"
          icon={Cog}
          risk={risk}
          hasData={state.operational.length > 0}
          emptyMessage="Submit your operational check to see risk level"
        />
        <Status
          label="Staff"
          value={`${latest?.staffPresent ?? 0}/${latest?.staffRequired ?? 0}`}
          ok={(latest?.staffPresent ?? 0) >= (latest?.staffRequired ?? 0)}
        />
        <Status
          label="Equipment"
          value={latest?.equipment ?? "—"}
          ok={latest?.equipment === "working"}
        />
        <Status
          label="Delivery"
          value={latest?.delivery ?? "—"}
          ok={latest?.delivery === "on-schedule"}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="text-xl font-semibold mb-1">Submit operational status</div>
          <div className="text-sm text-muted-foreground mb-5">
            Medium risk: low staff, faulty equipment, or delayed delivery.
          </div>
          <form method="post" onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
            <CsrfTokenField />
            <Field label="Staff Present">
              <Input
                type="text"
                inputMode="numeric"
                value={form.staffPresent}
                onChange={(e) => updateField("staffPresent", e.target.value)}
              />
            </Field>
            <Field label="Staff Required">
              <Input
                type="text"
                inputMode="numeric"
                value={form.staffRequired}
                onChange={(e) => updateField("staffRequired", e.target.value)}
              />
            </Field>
            <Field label="Equipment Status">
              <select
                className="h-9 px-3 rounded-md border bg-background text-sm"
                value={form.equipment}
                onChange={(e) =>
                  setForm({ ...form, equipment: e.target.value as "working" | "faulty" })
                }
              >
                <option value="working">Working</option>
                <option value="faulty">Faulty</option>
              </select>
            </Field>
            <Field label="Delivery Status">
              <select
                className="h-9 px-3 rounded-md border bg-background text-sm"
                value={form.delivery}
                onChange={(e) =>
                  setForm({ ...form, delivery: e.target.value as "on-schedule" | "delayed" })
                }
              >
                <option value="on-schedule">On schedule</option>
                <option value="delayed">Delayed</option>
              </select>
            </Field>
            <div className="sm:col-span-2">
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </div>
          </form>
        </Card>

        <Card className="p-6">
          <div className="text-xl font-semibold mb-3">History</div>
          <table className="w-full text-sm">
            <thead className="text-sm text-muted-foreground border-b">
              <tr>
                <th className="text-left py-2">Date</th>
                <th>Staff</th>
                <th>Equipment</th>
                <th>Delivery</th>
              </tr>
            </thead>
            <tbody className="divide-y text-center">
              {[...state.operational].reverse().map((e) => (
                <tr key={e.id}>
                  <td className="py-2 text-left">{e.date}</td>
                  <td>
                    {e.staffPresent}/{e.staffRequired}
                  </td>
                  <td className="capitalize">{e.equipment}</td>
                  <td className="capitalize">{e.delivery}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
function Status({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <Card className="p-5">
      <div className="text-lg font-semibold">{label}</div>
      <div className="text-2xl font-semibold mt-2 capitalize">{value}</div>
      <div
        className={`mt-3 inline-block text-xs font-semibold rounded-full px-2 py-1 ${ok ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"}`}
      >
        {ok ? "OK" : "Attention"}
      </div>
    </Card>
  );
}
