import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  UserCheck,
  UserX,
  AlertTriangle,
  Bell,
  FileBarChart2,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { Card } from "@/components/ui/card";
import { useAdminStore } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/dashboard")({ component: AdminDashboard });

const colors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
];

function AdminDashboard() {
  const { metrics, riskDistribution, registrationTrends, alertTrends, categoryDistribution } =
    useAdminStore((d) => d);

  const statCards = [
    { label: "Total SMEs Registered", value: metrics.totalSmes, icon: Building2 },
    { label: "Active SMEs", value: metrics.activeSmes, icon: UserCheck },
    { label: "Suspended SMEs", value: metrics.suspendedSmes, icon: UserX },
    { label: "High-Risk SMEs", value: metrics.highRiskSmes, icon: AlertTriangle },
    { label: "Total Alerts Generated", value: metrics.totalAlerts, icon: Bell },
    { label: "Total Reports Generated", value: metrics.totalReports, icon: FileBarChart2 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold">Platform Overview</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <Card key={card.label} className="p-5 flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <card.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-semibold">{card.value}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{card.label}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="text-lg font-semibold mb-1">Risk Distribution Across SMEs</div>
          <div className="text-sm text-muted-foreground mb-4">By overall risk level</div>
          <div className="h-72">
            {riskDistribution.some((d) => d.value > 0) ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    innerRadius={50}
                  >
                    {riskDistribution.map((_, i) => (
                      <Cell key={i} fill={colors[i % colors.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                No SME data yet
              </div>
            )}
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-lg font-semibold mb-1">Business Category Distribution</div>
          <div className="text-sm text-muted-foreground mb-4">SMEs by business type</div>
          <div className="h-72">
            {categoryDistribution.length > 0 ? (
              <ResponsiveContainer>
                <BarChart data={categoryDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={100}
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                    }}
                  />
                  <Bar dataKey="value" fill="var(--color-chart-2)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                No SME data yet
              </div>
            )}
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-lg font-semibold mb-1">Registration Trends</div>
          <div className="text-sm text-muted-foreground mb-4">New SME sign-ups per month</div>
          <div className="h-64">
            {registrationTrends.length > 0 ? (
              <ResponsiveContainer>
                <LineChart data={registrationTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis
                    allowDecimals={false}
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="var(--color-chart-1)"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                No registrations yet
              </div>
            )}
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-lg font-semibold mb-1">Alert Trends</div>
          <div className="text-sm text-muted-foreground mb-4">Alerts generated per month</div>
          <div className="h-64">
            {alertTrends.length > 0 ? (
              <ResponsiveContainer>
                <BarChart data={alertTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis
                    allowDecimals={false}
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                    }}
                  />
                  <Bar dataKey="count" fill="var(--color-chart-5)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                No alerts yet
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
