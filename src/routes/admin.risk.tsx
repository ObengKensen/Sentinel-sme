import { createFileRoute } from "@tanstack/react-router";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Wallet, ShieldCheck, FileCheck2, Cog } from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";
import { severityColor } from "@/lib/risk-store";

export const Route = createFileRoute("/admin/risk")({ component: SystemRiskMonitoring });

function SystemRiskMonitoring() {
  const { riskAggregation } = useAdminStore((d) => d);

  const categories = [
    { key: "financial" as const, title: "Financial", icon: Wallet, color: "var(--color-chart-1)" },
    {
      key: "cybersecurity" as const,
      title: "Cybersecurity",
      icon: ShieldCheck,
      color: "var(--color-chart-2)",
    },
    {
      key: "compliance" as const,
      title: "Compliance",
      icon: FileCheck2,
      color: "var(--color-chart-3)",
    },
    { key: "operational" as const, title: "Operational", icon: Cog, color: "var(--color-chart-4)" },
  ];

  const chartData = categories.map((c) => ({
    category: c.title,
    low: riskAggregation[c.key].low,
    medium: riskAggregation[c.key].medium,
    high: riskAggregation[c.key].high,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold">System Risk Monitoring</h2>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {categories.map((c) => {
          const stats = riskAggregation[c.key];
          return (
            <Card key={c.key} className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <c.icon className="h-4 w-4 text-primary" />
                <div className="font-semibold">{c.title}</div>
              </div>
              <div className="text-3xl font-semibold">{stats.avgScore}%</div>
              <div className="text-sm text-muted-foreground mb-3">Average risk score</div>
              <div className="flex gap-2 flex-wrap">
                <span
                  className={`text-xs font-semibold uppercase rounded-full px-2 py-1 ${severityColor.low}`}
                >
                  Low: {stats.low}
                </span>
                <span
                  className={`text-xs font-semibold uppercase rounded-full px-2 py-1 ${severityColor.medium}`}
                >
                  Med: {stats.medium}
                </span>
                <span
                  className={`text-xs font-semibold uppercase rounded-full px-2 py-1 ${severityColor.high}`}
                >
                  High: {stats.high}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-5">
        <div className="text-lg font-semibold mb-1">Risk Level Distribution by Category</div>
        <div className="text-sm text-muted-foreground mb-4">
          Number of SMEs at each risk level per category
        </div>
        <div className="h-80">
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="category" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis allowDecimals={false} stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                }}
              />
              <Legend />
              <Bar
                dataKey="low"
                name="Low"
                fill="var(--color-chart-2)"
                radius={[4, 4, 0, 0]}
                stackId="a"
              />
              <Bar dataKey="medium" name="Medium" fill="var(--color-chart-3)" stackId="a" />
              <Bar
                dataKey="high"
                name="High"
                fill="var(--color-chart-5)"
                radius={[4, 4, 0, 0]}
                stackId="a"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
