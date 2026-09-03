import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Wallet,
  ShieldCheck,
  FileCheck2,
  Cog,
  ShieldAlert,
  ArrowRight,
  Lightbulb,
  PlusCircle,
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
import { RiskCard } from "@/components/RiskCard";
import {
  cyberRisk,
  complianceRisk,
  financialRisk,
  operationalRisk,
  overallRisk,
  severityColor,
  alertStatusColor,
  getRecommendations,
  hasAnyRiskData,
  hasComplianceData,
  hasCyberData,
  hasFinancialData,
  hasOperationalData,
  useStore,
} from "@/lib/risk-store";

export const Route = createFileRoute("/app/dashboard")({ component: Dashboard });

function Dashboard() {
  const state = useStore((s) => s);
  const fin = financialRisk(state);
  const cyb = cyberRisk(state);
  const com = complianceRisk(state);
  const ops = operationalRisk(state);
  const all = overallRisk(state);

  const incomeExpense = state.financial.slice(-6).map((e) => ({
    month: new Date(e.date).toLocaleDateString(undefined, { month: "short" }),
    income: e.income,
    expenses: e.expenses,
  }));

  const distribution = [
    { name: "Financial", value: fin.score },
    { name: "Cybersecurity", value: cyb.score },
    { name: "Compliance", value: com.score },
    { name: "Operational", value: ops.score },
  ];
  const colors = [
    "var(--color-chart-1)",
    "var(--color-chart-2)",
    "var(--color-chart-3)",
    "var(--color-chart-4)",
  ];

  const trend = state.financial.slice(-6).map((e, i) => {
    const arr = state.financial.slice(0, state.financial.length - 5 + i);
    const cut = { ...state, financial: arr };
    return {
      month: new Date(e.date).toLocaleDateString(undefined, { month: "short" }),
      score: overallRisk(cut).score,
    };
  });

  const recent = [...state.alerts]
    .sort((a, b) => {
      const order = { active: 0, reviewed: 1, resolved: 2 };
      const statusDiff = order[a.status] - order[b.status];
      if (statusDiff !== 0) return statusDiff;
      return b.date.localeCompare(a.date);
    })
    .slice(0, 5);
  const activeAlertCount = state.alerts.filter((a) => a.status === "active").length;
  const highActiveCount = state.alerts.filter(
    (a) => a.status === "active" && a.severity === "high",
  ).length;
  const recommendations = getRecommendations(state);

  const quickActions = [
    { label: "Financial data", href: "/app/financial", icon: Wallet },
    { label: "Cyber check", href: "/app/cybersecurity", icon: ShieldCheck },
    { label: "Compliance", href: "/app/compliance", icon: FileCheck2 },
    { label: "Operations", href: "/app/operational", icon: Cog },
  ] as const;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3 xl:gap-4 [&>*]:min-w-0">
        <RiskCard
          title="Financial Risk"
          icon={Wallet}
          risk={fin}
          hasData={hasFinancialData(state)}
        />
        <RiskCard
          title="Cybersecurity Risk"
          icon={ShieldCheck}
          risk={cyb}
          hasData={hasCyberData(state)}
        />
        <RiskCard
          title="Compliance Risk"
          icon={FileCheck2}
          risk={com}
          hasData={hasComplianceData(state)}
        />
        <RiskCard
          title="Operational Risk"
          icon={Cog}
          risk={ops}
          hasData={hasOperationalData(state)}
        />
        <RiskCard
          title="Overall Risk"
          icon={ShieldAlert}
          risk={all}
          hasData={hasAnyRiskData(state)}
          emptyMessage="Submit monitoring data to see overall risk level"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-4 w-4 text-accent" />
            <div>
              <div className="text-xl font-semibold">Recommended actions</div>
            </div>
          </div>
          {recommendations.length === 0 ? (
            <div className="text-sm text-muted-foreground py-4 text-center">
              All clear — no urgent actions right now.
            </div>
          ) : (
            <div className="space-y-3">
              {recommendations.map((rec) => (
                <div key={rec.title} className="flex items-start gap-3 border rounded-lg p-3">
                  <span
                    className={`text-xs font-semibold uppercase rounded-full px-2 py-1 shrink-0 ${rec.priority >= 3 ? severityColor.high : rec.priority >= 2 ? severityColor.medium : severityColor.low}`}
                  >
                    {rec.priority >= 3 ? "High" : rec.priority >= 2 ? "Medium" : "Low"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{rec.title}</div>
                    <div className="text-sm text-muted-foreground mt-0.5">{rec.action}</div>
                  </div>
                  <Link
                    to={rec.href}
                    className="text-sm text-primary flex items-center gap-1 shrink-0"
                  >
                    Go <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <PlusCircle className="h-4 w-4 text-primary" />
            <div className="text-xl font-semibold">Quick submit</div>
          </div>
          <div className="grid gap-2">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                to={action.href}
                className="flex items-center gap-3 rounded-lg border p-3 text-sm hover:bg-muted/50 transition-colors"
              >
                <action.icon className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">{action.label}</span>
                <ArrowRight className="h-3.5 w-3.5 ml-auto text-muted-foreground" />
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xl font-semibold">Income vs Expenses</div>
              <div className="text-sm text-muted-foreground">Last six recorded periods</div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={incomeExpense}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                  }}
                />
                <Legend />
                <Bar dataKey="income" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expenses" fill="var(--color-chart-5)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-xl font-semibold mb-1">Risk Distribution</div>
          <div className="text-sm text-muted-foreground mb-2">By category score</div>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={distribution}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  innerRadius={50}
                >
                  {distribution.map((_, i) => (
                    <Cell key={i} fill={colors[i]} />
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
          </div>
        </Card>

        <Card className="p-5 lg:col-span-3">
          <div className="text-xl font-semibold mb-1">Monthly Risk Trend</div>
          <div className="text-sm text-muted-foreground mb-4">Overall risk score over time</div>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="var(--color-chart-1)"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xl font-semibold">Recent Alerts</div>
            <div className="text-sm text-muted-foreground">
              {activeAlertCount} active
              {highActiveCount > 0 ? ` · ${highActiveCount} high severity` : ""}
            </div>
          </div>
          <Link to="/app/alerts" className="text-sm text-primary flex items-center gap-1">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="text-sm text-muted-foreground py-6 text-center">
            No alerts yet. Submit monitoring data to generate alerts.
          </div>
        ) : (
          <div className="divide-y">
            {recent.map((a) => (
              <div key={a.id} className="py-3 flex items-start gap-4">
                <span
                  className={`text-xs font-semibold uppercase rounded-full px-2 py-1 ${severityColor[a.severity]}`}
                >
                  {a.severity}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{a.title}</div>
                  <div className="text-sm text-muted-foreground">{a.action}</div>
                  <div className="text-xs text-muted-foreground font-mono mt-1">{a.id}</div>
                </div>
                <div className="text-sm text-muted-foreground capitalize shrink-0">
                  {a.category}
                </div>
                <span
                  className={`text-xs font-semibold capitalize rounded-full px-2 py-1 shrink-0 ${alertStatusColor[a.status]}`}
                >
                  {a.status}
                </span>
                <div className="text-sm text-muted-foreground shrink-0">{a.date}</div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
