import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ShieldCheck, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CsrfTokenField } from "@/components/CsrfTokenField";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RiskCard } from "@/components/RiskCard";
import { ScoreBar } from "@/components/ScoreBar";
import {
  assessCyberThreats,
  CYBER_THREAT_OPTIONS,
  getThreatOption,
  type CyberThreatType,
} from "@/lib/cyber-threats";
import {
  cyberRisk,
  hasCyberData,
  severityColor,
  store,
  useStore,
  type Severity,
} from "@/lib/risk-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/cybersecurity")({ component: Page });

type Step = "select" | "questions" | "result";

function Page() {
  const state = useStore((s) => s);
  const risk = cyberRisk(state);
  const hasData = hasCyberData(state);
  const latest = hasData ? state.cyber.at(-1) : undefined;
  const latestAssessment = latest?.assessment;

  const [step, setStep] = useState<Step>("select");
  const [selected, setSelected] = useState<CyberThreatType[]>([]);
  const [otherDescription, setOtherDescription] = useState("");
  const [answersByThreat, setAnswersByThreat] = useState<
    Record<string, Record<string, boolean>>
  >({});
  const [lastResult, setLastResult] = useState(latestAssessment);
  const [detailId, setDetailId] = useState<string | null>(null);

  const activeThreats = useMemo(() => {
    const assessment = lastResult ?? latestAssessment;
    return assessment?.threats.filter((t) => t.status === "active" || t.level !== "low") ?? [];
  }, [lastResult, latestAssessment]);

  const toggleThreat = (id: CyberThreatType, checked: boolean) => {
    setSelected((prev) => {
      if (checked) return prev.includes(id) ? prev : [...prev, id];
      return prev.filter((t) => t !== id);
    });
    if (!checked && id === "other") setOtherDescription("");
  };

  const setAnswer = (threatId: CyberThreatType, questionId: string, value: boolean) => {
    setAnswersByThreat((prev) => ({
      ...prev,
      [threatId]: { ...prev[threatId], [questionId]: value },
    }));
  };

  const continueToQuestions = () => {
    if (selected.length === 0) {
      toast.error("Select at least one cybersecurity threat.");
      return;
    }
    if (selected.includes("other") && !otherDescription.trim()) {
      toast.error("Please specify the cybersecurity threat for Other.");
      return;
    }
    setStep("questions");
  };

  const submitAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const assessment = assessCyberThreats({
        selectedThreats: selected,
        answersByThreat,
        otherDescription,
      });
      store.addCyberAssessment(assessment);
      setLastResult(assessment);
      setStep("result");
      toast.success("Cybersecurity assessment completed.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not complete assessment.");
    }
  };

  const startNew = () => {
    setSelected([]);
    setOtherDescription("");
    setAnswersByThreat({});
    setStep("select");
  };

  const levelDot: Record<Severity, string> = {
    high: "text-destructive",
    medium: "text-warning",
    low: "text-muted-foreground",
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid md:grid-cols-3 gap-4">
        <RiskCard
          title="Cybersecurity Risk"
          icon={ShieldCheck}
          risk={risk}
          hasData={hasData}
          emptyMessage="Complete a threat assessment to see risk level"
        />
        <Card className="p-5">
          <div className="text-lg font-semibold">Assessment snapshot</div>
          {hasData && latest ? (
            <>
              <div className="text-2xl font-semibold mt-2">{risk.score}/100</div>
              <div className="text-sm text-muted-foreground mt-1">
                {activeThreats.length} active threat{activeThreats.length === 1 ? "" : "s"} · Last
                assessment: {latest.date}
              </div>
              {latestAssessment && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {latestAssessment.threats.slice(0, 4).map((t) => (
                    <Badge key={t.threatType} variant="outline" className="capitalize">
                      {t.threatName}
                    </Badge>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground leading-snug mt-2">
              Select threats, answer the follow-up questions, then assess risk.
            </p>
          )}
        </Card>
        <Card className="p-5">
          <div className="text-lg font-semibold mb-2">Active threats</div>
          {activeThreats.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {activeThreats.map((t) => (
                <li key={t.threatType} className="flex items-center gap-2">
                  <span className={cn("text-base leading-none", levelDot[t.level])}>●</span>
                  <span className="font-medium">{t.threatName}</span>
                  <span className="text-muted-foreground">· {t.label}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground leading-snug">
              No active threat findings yet.
            </p>
          )}
        </Card>
      </div>

      <Card className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <StepPill active={step === "select"} done={step !== "select"} n={1} label="Select threats" />
          <span className="text-muted-foreground">→</span>
          <StepPill
            active={step === "questions"}
            done={step === "result"}
            n={2}
            label="Answer questions"
          />
          <span className="text-muted-foreground">→</span>
          <StepPill active={step === "result"} done={false} n={3} label="View actions" />
        </div>
      </Card>

      {step === "select" && (
        <Card className="p-6">
          <div className="text-xl font-semibold mb-1">Select cybersecurity threats</div>
          <p className="text-sm text-muted-foreground mb-5">
            Select the cybersecurity threats that apply to your business. You can choose one or
            multiple.
          </p>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {CYBER_THREAT_OPTIONS.map((threat) => {
              const checked = selected.includes(threat.id);
              return (
                <button
                  key={threat.id}
                  type="button"
                  onClick={() => toggleThreat(threat.id, !checked)}
                  className={cn(
                    "text-left rounded-lg border p-4 transition-colors",
                    checked
                      ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                      : "hover:bg-muted/40",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(v) => toggleThreat(threat.id, v === true)}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-0.5"
                    />
                    <div>
                      <div className="font-semibold text-sm">{threat.name}</div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {threat.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {selected.includes("other") && (
            <div className="mt-5 max-w-xl">
              <Label htmlFor="other-threat">Please specify the cybersecurity threat</Label>
              <Input
                id="other-threat"
                className="mt-2"
                value={otherDescription}
                onChange={(e) => setOtherDescription(e.target.value)}
                placeholder="Describe the threat"
              />
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            <Button type="button" onClick={continueToQuestions}>
              Continue to questions
            </Button>
          </div>
        </Card>
      )}

      {step === "questions" && (
        <Card className="p-6">
          <div className="text-xl font-semibold mb-1">Answer relevant questions</div>
          <p className="text-sm text-muted-foreground mb-5">
            Questions are shown only for the threats you selected.
          </p>
          <form method="post" onSubmit={submitAssessment} className="space-y-6">
            <CsrfTokenField />
            {selected.map((threatId) => {
              const option = getThreatOption(threatId);
              if (!option) return null;
              return (
                <div key={threatId} className="rounded-lg border p-4 space-y-4">
                  <div>
                    <div className="font-semibold">{option.name}</div>
                    <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                  </div>
                  {option.questions.map((q) => {
                    const value = answersByThreat[threatId]?.[q.id];
                    return (
                      <div key={q.id}>
                        <Label className="mb-2 block text-sm">{q.label}</Label>
                        <div className="grid grid-cols-2 gap-2 max-w-sm">
                          <button
                            type="button"
                            onClick={() => setAnswer(threatId, q.id, true)}
                            className={cn(
                              "h-10 rounded-md text-sm border",
                              value === true
                                ? "bg-primary text-primary-foreground border-transparent"
                                : "bg-background",
                            )}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => setAnswer(threatId, q.id, false)}
                            className={cn(
                              "h-10 rounded-md text-sm border",
                              value === false
                                ? "bg-secondary text-secondary-foreground border-transparent"
                                : "bg-background",
                            )}
                          >
                            No
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={() => setStep("select")}>
                Back
              </Button>
              <Button type="submit">
                <ShieldAlert className="h-4 w-4 mr-1" />
                Assess risk
              </Button>
            </div>
          </form>
        </Card>
      )}

      {step === "result" && lastResult && (
        <div className="grid lg:grid-cols-2 gap-4">
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <div className="text-xl font-semibold">Cybersecurity Risk Assessment</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Threats identified</div>
              <div className="font-medium mt-1">
                {lastResult.threats.map((t) => t.threatName).join(", ")}
              </div>
            </div>
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="text-sm text-muted-foreground">Risk score</div>
                <div className="text-4xl font-semibold">{lastResult.overallScore}/100</div>
              </div>
              <span
                className={`text-xs font-semibold uppercase tracking-wide rounded-full px-2.5 py-1 ${severityColor[lastResult.overallLevel]}`}
              >
                {lastResult.overallLabel}
              </span>
            </div>
            <ScoreBar score={lastResult.overallScore} level={lastResult.overallLevel} />
            <div>
              <div className="text-sm font-semibold mb-1">Reason</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {lastResult.overallReason}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-muted-foreground border-b">
                  <tr>
                    <th className="text-left py-2">Threat</th>
                    <th className="text-left py-2">Risk</th>
                    <th className="text-right py-2">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {lastResult.threats.map((t) => (
                    <tr key={t.threatType}>
                      <td className="py-2">{t.threatName}</td>
                      <td className="py-2">{t.label}</td>
                      <td className="py-2 text-right tabular-nums">{t.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button type="button" variant="outline" onClick={startNew}>
              New assessment
            </Button>
          </Card>

          <Card className="p-6">
            <div className="text-xl font-semibold mb-3">Recommended actions</div>
            <ul className="space-y-4">
              {lastResult.threats.map((t) => (
                <li key={t.threatType}>
                  <div className="font-medium text-sm mb-1">{t.threatName}</div>
                  <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                    {t.recommendedActions.slice(0, 4).map((action) => (
                      <li key={action}>{action}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      <Card className="p-6">
        <div className="text-xl font-semibold mb-3">Assessment history</div>
        {state.cyber.length === 0 ? (
          <p className="text-sm text-muted-foreground">No cybersecurity assessments yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-muted-foreground border-b">
                <tr>
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Threat type</th>
                  <th className="text-right py-2">Score</th>
                  <th className="text-left py-2">Risk</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[...state.cyber].reverse().map((entry) => {
                  const assessment = entry.assessment;
                  const threatLabel = assessment
                    ? assessment.threats.map((t) => t.threatName).join(", ")
                    : [
                        !entry.passwordUpdated && "Passwords",
                        !entry.antivirusActive && "Antivirus",
                        entry.suspicious && "Suspicious activity",
                      ]
                        .filter(Boolean)
                        .join(", ") || "General check";
                  const score = assessment?.overallScore ?? cyberRisk({ ...state, cyber: [entry] }).score;
                  const level = assessment?.overallLevel ?? cyberRisk({ ...state, cyber: [entry] }).level;
                  const status =
                    assessment?.threats.some((t) => t.status === "active") ? "Active" : "Resolved";
                  return (
                    <tr key={entry.id}>
                      <td className="py-2 whitespace-nowrap">{entry.date}</td>
                      <td className="py-2 max-w-[220px] truncate" title={threatLabel}>
                        {threatLabel}
                      </td>
                      <td className="py-2 text-right tabular-nums">{score}</td>
                      <td className="py-2 capitalize">{level}</td>
                      <td className="py-2">{assessment ? status : "Logged"}</td>
                      <td className="py-2">
                        {assessment ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setDetailId(detailId === entry.id ? null : entry.id)}
                          >
                            {detailId === entry.id ? "Hide" : "View"}
                          </Button>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {detailId &&
          (() => {
            const entry = state.cyber.find((c) => c.id === detailId);
            const assessment = entry?.assessment;
            if (!assessment) return null;
            return (
              <div className="mt-4 rounded-lg border p-4 space-y-3">
                <div className="font-semibold">Assessment details · {entry.date}</div>
                <p className="text-sm text-muted-foreground">{assessment.overallReason}</p>
                <ul className="text-sm space-y-2">
                  {assessment.threats.map((t) => (
                    <li key={t.threatType} className="border-b pb-2">
                      <div className="font-medium">
                        {t.threatName} · {t.label} ({t.score})
                      </div>
                      <div className="text-muted-foreground">{t.reason}</div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })()}
      </Card>
    </div>
  );
}

function StepPill({
  n,
  label,
  active,
  done,
}: {
  n: number;
  label: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1",
        active && "border-primary bg-primary/5 text-foreground",
        done && !active && "border-transparent bg-muted text-muted-foreground",
      )}
    >
      <span
        className={cn(
          "h-5 w-5 rounded-full text-[11px] font-semibold flex items-center justify-center",
          active ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20",
        )}
      >
        {n}
      </span>
      <span className="font-medium">{label}</span>
    </div>
  );
}
