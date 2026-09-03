import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, Ban, CheckCircle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { adminStore, useAdminStore, type SmeRecord } from "@/lib/admin-store";
import { severityColor } from "@/lib/risk-store";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/smes")({ component: SmeManagement });

function SmeManagement() {
  const smes = useAdminStore((d) => d.smes);
  const [selected, setSelected] = useState<SmeRecord | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const suspend = async (userId: string) => {
    setLoading(userId);
    const result = await adminStore.suspendSme(userId);
    setLoading(null);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Account suspended.");
    setSelected(null);
  };

  const reactivate = async (userId: string) => {
    setLoading(userId);
    const result = await adminStore.reactivateSme(userId);
    setLoading(null);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Account reactivated.");
    setSelected(null);
  };

  const details = selected ? adminStore.getSmeDetails(selected.userId) : null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">SME Management</h2>
      </div>

      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead>Owner Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Business Type</TableHead>
              <TableHead>Risk Status</TableHead>
              <TableHead>Account Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {smes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No SME accounts registered yet.
                </TableCell>
              </TableRow>
            ) : (
              smes.map((sme) => (
                <TableRow key={sme.userId}>
                  <TableCell className="font-medium">{sme.businessName}</TableCell>
                  <TableCell>{sme.ownerName}</TableCell>
                  <TableCell>{sme.email}</TableCell>
                  <TableCell>{sme.businessType}</TableCell>
                  <TableCell>
                    <span
                      className={`text-xs font-semibold uppercase rounded-full px-2 py-1 ${severityColor[sme.riskLevel]}`}
                    >
                      {sme.riskLevel}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={sme.accountStatus === "active" ? "default" : "destructive"}>
                      {sme.accountStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setSelected(sme)}>
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                      {sme.accountStatus === "active" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          disabled={loading === sme.userId}
                          onClick={() => suspend(sme.userId)}
                        >
                          {loading === sme.userId ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Ban className="h-4 w-4 mr-1" /> Suspend
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={loading === sme.userId}
                          onClick={() => reactivate(sme.userId)}
                        >
                          {loading === sme.userId ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" /> Reactivate
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected?.businessName}</DialogTitle>
            <DialogDescription>SME account details and risk summary</DialogDescription>
          </DialogHeader>
          {selected && details && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <Detail label="Owner" value={selected.ownerName} />
                <Detail label="Email" value={selected.email} />
                <Detail label="Business Type" value={selected.businessType} />
                <Detail
                  label="Registered"
                  value={new Date(selected.createdAt).toLocaleDateString()}
                />
                <Detail
                  label="Risk Score"
                  value={`${selected.overallScore}% (${selected.riskLabel})`}
                />
                <Detail
                  label="Alerts"
                  value={`${selected.activeAlerts} active / ${selected.alertCount} total`}
                />
                <Detail label="Account Status" value={selected.accountStatus} />
                <Detail label="Monitoring Data" value={selected.hasMonitoringData ? "Yes" : "No"} />
              </div>
              {details.state && (
                <div className="border rounded-lg p-3 space-y-1">
                  <div className="font-medium mb-2">Data entries</div>
                  <div className="text-muted-foreground">
                    Financial: {details.state.financial.length}
                  </div>
                  <div className="text-muted-foreground">
                    Cybersecurity: {details.state.cyber.length}
                  </div>
                  <div className="text-muted-foreground">
                    Compliance: {details.state.compliance.length}
                  </div>
                  <div className="text-muted-foreground">
                    Operational: {details.state.operational.length}
                  </div>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                {selected.accountStatus === "active" ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={loading === selected.userId}
                    onClick={() => suspend(selected.userId)}
                  >
                    Suspend Account
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    disabled={loading === selected.userId}
                    onClick={() => reactivate(selected.userId)}
                  >
                    Reactivate Account
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
