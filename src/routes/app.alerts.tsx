import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  alertStatusColor,
  severityColor,
  store,
  useStore,
  type AlertStatus,
  type Category,
  type Severity,
} from "@/lib/risk-store";
import { toast } from "sonner";

export const Route = createFileRoute("/app/alerts")({ component: Page });

type StatusFilter = "all" | AlertStatus;

function Page() {
  const alerts = useStore((s) => s.alerts);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("active");
  const [cat, setCat] = useState<"all" | Category>("all");
  const [sev, setSev] = useState<"all" | Severity>("all");
  const [q, setQ] = useState("");

  const activeCount = alerts.filter((a) => a.status === "active").length;
  const reviewedCount = alerts.filter((a) => a.status === "reviewed").length;
  const highCount = alerts.filter((a) => a.status === "active" && a.severity === "high").length;
  const mediumCount = alerts.filter((a) => a.status === "active" && a.severity === "medium").length;

  const resolveAll = () => {
    if (activeCount === 0) return;
    store.resolveAllActive();
    toast.success(`Resolved ${activeCount} alert${activeCount === 1 ? "" : "s"}.`);
  };

  const filtered = alerts.filter((a) => {
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    if (cat !== "all" && a.category !== cat) return false;
    if (sev !== "all" && a.severity !== sev) return false;
    if (q) {
      const haystack = `${a.id} ${a.title} ${a.action} ${a.category}`.toLowerCase();
      if (!haystack.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-base font-semibold text-muted-foreground">Active alerts</div>
          <div className="text-3xl font-semibold mt-1">{activeCount}</div>
        </Card>
        <Card className="p-4">
          <div className="text-base font-semibold text-muted-foreground">Under review</div>
          <div className="text-3xl font-semibold mt-1 text-warning">{reviewedCount}</div>
        </Card>
        <Card className="p-4">
          <div className="text-base font-semibold text-muted-foreground">
            High severity (active)
          </div>
          <div className="text-3xl font-semibold mt-1 text-destructive">{highCount}</div>
        </Card>
        <Card className="p-4">
          <div className="text-base font-semibold text-muted-foreground">
            Medium severity (active)
          </div>
          <div className="text-3xl font-semibold mt-1 text-warning">{mediumCount}</div>
        </Card>
      </div>

      <Card className="p-4 flex flex-wrap gap-3 items-center">
        <select
          className="h-9 px-3 rounded-md border bg-background text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="reviewed">Reviewed</option>
          <option value="resolved">Resolved</option>
        </select>
        <select
          className="h-9 px-3 rounded-md border bg-background text-sm"
          value={cat}
          onChange={(e) => setCat(e.target.value as "all" | Category)}
        >
          <option value="all">All categories</option>
          <option value="financial">Financial</option>
          <option value="cybersecurity">Cybersecurity</option>
          <option value="compliance">Compliance</option>
          <option value="operational">Operational</option>
        </select>
        <select
          className="h-9 px-3 rounded-md border bg-background text-sm"
          value={sev}
          onChange={(e) => setSev(e.target.value as "all" | Severity)}
        >
          <option value="all">All severities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <Input
          className="max-w-xs"
          placeholder="Search by ID, title, or recommendation…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {activeCount > 0 && (
          <Button variant="outline" className="ml-auto" onClick={resolveAll}>
            Resolve all active
          </Button>
        )}
      </Card>

      <Card className="p-0 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No alerts match your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[960px]">
              <thead className="bg-muted/50 text-sm text-muted-foreground">
                <tr>
                  <th className="text-left p-3">Alert ID</th>
                  <th className="text-left p-3">Risk Type</th>
                  <th className="text-left p-3">Severity</th>
                  <th className="text-left p-3">Date Generated</th>
                  <th className="text-left p-3">Recommendation</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((a) => (
                  <tr key={a.id}>
                    <td className="p-3 font-mono text-sm text-muted-foreground">{a.id}</td>
                    <td className="p-3">
                      <div className="font-medium capitalize">{a.category}</div>
                      <div className="text-sm text-muted-foreground mt-0.5">{a.title}</div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-xs font-semibold uppercase rounded-full px-2 py-1 ${severityColor[a.severity]}`}
                      >
                        {a.severity}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground whitespace-nowrap">{a.date}</td>
                    <td className="p-3 text-muted-foreground max-w-xs">{a.action}</td>
                    <td className="p-3">
                      <span
                        className={`text-xs font-semibold capitalize rounded-full px-2 py-1 ${alertStatusColor[a.status]}`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-2">
                        {a.status === "active" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              store.markReviewed(a.id);
                              toast.success("Alert reviewed.");
                            }}
                          >
                            Reviewed
                          </Button>
                        )}
                        {a.status !== "resolved" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              store.markResolved(a.id);
                              toast.success("Alert resolved.");
                            }}
                          >
                            Resolved
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
