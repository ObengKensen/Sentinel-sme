import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { C as Card } from "./card-DbnvS79O.mjs";
import { L as Label, C as CsrfTokenField } from "./label-vy6fOKey.mjs";
import { I as Input } from "./input-CtyJ1gXQ.mjs";
import { B as Button } from "./button-BjSzN4sD.mjs";
import { B as Badge } from "./badge-BiC2KLZH.mjs";
import { C as Checkbox$1, a as CheckboxIndicator } from "../_libs/radix-ui__react-checkbox.mjs";
import { c as cn } from "./utils-B-5jxtHY.mjs";
import { R as RiskCard } from "./RiskCard-CiPG8awz.mjs";
import { S as ScoreBar } from "./ScoreBar-B4WgMYtn.mjs";
import { useStore, cyberRisk, hasCyberData, CYBER_THREAT_OPTIONS, getThreatOption, severityColor, assessCyberThreats, store } from "./router-BdVNv3tq.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { S as ShieldCheck, f as ShieldAlert, m as CircleCheck, n as Check } from "../_libs/lucide-react.mjs";
import "./csrf-C3jkS9Bv.mjs";
import "./server-DpwYz346.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./jwt.shared-gMsek6D_.mjs";
import "../_libs/zod.mjs";
const Checkbox = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Checkbox$1,
  {
    ref,
    className: cn(
      "grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(CheckboxIndicator, { className: cn("grid place-content-center text-current"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) })
  }
));
Checkbox.displayName = Checkbox$1.displayName;
function Page() {
  const state = useStore((s) => s);
  const risk = cyberRisk(state);
  const hasData = hasCyberData(state);
  const latest = hasData ? state.cyber.at(-1) : void 0;
  const latestAssessment = latest?.assessment;
  const [step, setStep] = reactExports.useState("select");
  const [selected, setSelected] = reactExports.useState([]);
  const [otherDescription, setOtherDescription] = reactExports.useState("");
  const [answersByThreat, setAnswersByThreat] = reactExports.useState({});
  const [lastResult, setLastResult] = reactExports.useState(latestAssessment);
  const [detailId, setDetailId] = reactExports.useState(null);
  const activeThreats = reactExports.useMemo(() => {
    const assessment = lastResult ?? latestAssessment;
    return assessment?.threats.filter((t) => t.status === "active" || t.level !== "low") ?? [];
  }, [lastResult, latestAssessment]);
  const toggleThreat = (id, checked) => {
    setSelected((prev) => {
      if (checked) return prev.includes(id) ? prev : [...prev, id];
      return prev.filter((t) => t !== id);
    });
    if (!checked && id === "other") setOtherDescription("");
  };
  const setAnswer = (threatId, questionId, value) => {
    setAnswersByThreat((prev) => ({
      ...prev,
      [threatId]: {
        ...prev[threatId],
        [questionId]: value
      }
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
  const submitAssessment = (e) => {
    e.preventDefault();
    try {
      const assessment = assessCyberThreats({
        selectedThreats: selected,
        answersByThreat,
        otherDescription
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
  const levelDot = {
    high: "text-destructive",
    medium: "text-warning",
    low: "text-muted-foreground"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(RiskCard, { title: "Cybersecurity Risk", icon: ShieldCheck, risk, hasData, emptyMessage: "Complete a threat assessment to see risk level" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-semibold", children: "Assessment snapshot" }),
        hasData && latest ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-semibold mt-2", children: [
            risk.score,
            "/100"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground mt-1", children: [
            activeThreats.length,
            " active threat",
            activeThreats.length === 1 ? "" : "s",
            " · Last assessment: ",
            latest.date
          ] }),
          latestAssessment && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex flex-wrap gap-2", children: latestAssessment.threats.slice(0, 4).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "capitalize", children: t.threatName }, t.threatType)) })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-snug mt-2", children: "Select threats, answer the follow-up questions, then assess risk." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-semibold mb-2", children: "Active threats" }),
        activeThreats.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2 text-sm", children: activeThreats.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("text-base leading-none", levelDot[t.level]), children: "●" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: t.threatName }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
            "· ",
            t.label
          ] })
        ] }, t.threatType)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-snug", children: "No active threat findings yet." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-4 sm:p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StepPill, { active: step === "select", done: step !== "select", n: 1, label: "Select threats" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "→" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StepPill, { active: step === "questions", done: step === "result", n: 2, label: "Answer questions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "→" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StepPill, { active: step === "result", done: false, n: 3, label: "View actions" })
    ] }) }),
    step === "select" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-semibold mb-1", children: "Select cybersecurity threats" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-5", children: "Select the cybersecurity threats that apply to your business. You can choose one or multiple." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 xl:grid-cols-3 gap-3", children: CYBER_THREAT_OPTIONS.map((threat) => {
        const checked = selected.includes(threat.id);
        return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => toggleThreat(threat.id, !checked), className: cn("text-left rounded-lg border p-4 transition-colors", checked ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "hover:bg-muted/40"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked, onCheckedChange: (v) => toggleThreat(threat.id, v === true), onClick: (e) => e.stopPropagation(), className: "mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm", children: threat.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 leading-relaxed", children: threat.description })
          ] })
        ] }) }, threat.id);
      }) }),
      selected.includes("other") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 max-w-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "other-threat", children: "Please specify the cybersecurity threat" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "other-threat", className: "mt-2", value: otherDescription, onChange: (e) => setOtherDescription(e.target.value), placeholder: "Describe the threat" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex flex-wrap gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", onClick: continueToQuestions, children: "Continue to questions" }) })
    ] }),
    step === "questions" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-semibold mb-1", children: "Answer relevant questions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-5", children: "Questions are shown only for the threats you selected." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { method: "post", onSubmit: submitAssessment, className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CsrfTokenField, {}),
        selected.map((threatId) => {
          const option = getThreatOption(threatId);
          if (!option) return null;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border p-4 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: option.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: option.description })
            ] }),
            option.questions.map((q) => {
              const value = answersByThreat[threatId]?.[q.id];
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "mb-2 block text-sm", children: q.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 max-w-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setAnswer(threatId, q.id, true), className: cn("h-10 rounded-md text-sm border", value === true ? "bg-primary text-primary-foreground border-transparent" : "bg-background"), children: "Yes" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setAnswer(threatId, q.id, false), className: cn("h-10 rounded-md text-sm border", value === false ? "bg-secondary text-secondary-foreground border-transparent" : "bg-background"), children: "No" })
                ] })
              ] }, q.id);
            })
          ] }, threatId);
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => setStep("select"), children: "Back" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-4 w-4 mr-1" }),
            "Assess risk"
          ] })
        ] })
      ] })
    ] }),
    step === "result" && lastResult && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-5 w-5 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-semibold", children: "Cybersecurity Risk Assessment" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Threats identified" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium mt-1", children: lastResult.threats.map((t) => t.threatName).join(", ") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Risk score" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-4xl font-semibold", children: [
              lastResult.overallScore,
              "/100"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs font-semibold uppercase tracking-wide rounded-full px-2.5 py-1 ${severityColor[lastResult.overallLevel]}`, children: lastResult.overallLabel })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreBar, { score: lastResult.overallScore, level: lastResult.overallLevel }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold mb-1", children: "Reason" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: lastResult.overallReason })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-muted-foreground border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2", children: "Threat" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2", children: "Risk" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-2", children: "Score" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y", children: lastResult.threats.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2", children: t.threatName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2", children: t.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 text-right tabular-nums", children: t.score })
          ] }, t.threatType)) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: startNew, children: "New assessment" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-semibold mb-3", children: "Recommended actions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-4", children: lastResult.threats.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-sm mb-1", children: t.threatName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "list-disc pl-5 text-sm space-y-1 text-muted-foreground", children: t.recommendedActions.slice(0, 4).map((action) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: action }, action)) })
        ] }, t.threatType)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-semibold mb-3", children: "Assessment history" }),
      state.cyber.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No cybersecurity assessments yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-muted-foreground border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2", children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2", children: "Threat type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-2", children: "Score" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2", children: "Risk" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2", children: "Action" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y", children: [...state.cyber].reverse().map((entry) => {
          const assessment = entry.assessment;
          const threatLabel = assessment ? assessment.threats.map((t) => t.threatName).join(", ") : [!entry.passwordUpdated && "Passwords", !entry.antivirusActive && "Antivirus", entry.suspicious && "Suspicious activity"].filter(Boolean).join(", ") || "General check";
          const score = assessment?.overallScore ?? cyberRisk({
            ...state,
            cyber: [entry]
          }).score;
          const level = assessment?.overallLevel ?? cyberRisk({
            ...state,
            cyber: [entry]
          }).level;
          const status = assessment?.threats.some((t) => t.status === "active") ? "Active" : "Resolved";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 whitespace-nowrap", children: entry.date }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 max-w-[220px] truncate", title: threatLabel, children: threatLabel }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 text-right tabular-nums", children: score }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 capitalize", children: level }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2", children: assessment ? status : "Logged" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2", children: assessment ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => setDetailId(detailId === entry.id ? null : entry.id), children: detailId === entry.id ? "Hide" : "View" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" }) })
          ] }, entry.id);
        }) })
      ] }) }),
      detailId && (() => {
        const entry = state.cyber.find((c) => c.id === detailId);
        const assessment = entry?.assessment;
        if (!assessment) return null;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-lg border p-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold", children: [
            "Assessment details · ",
            entry.date
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: assessment.overallReason }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "text-sm space-y-2", children: assessment.threats.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "border-b pb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium", children: [
              t.threatName,
              " · ",
              t.label,
              " (",
              t.score,
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: t.reason })
          ] }, t.threatType)) })
        ] });
      })()
    ] })
  ] });
}
function StepPill({
  n,
  label,
  active,
  done
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("inline-flex items-center gap-2 rounded-full border px-3 py-1", active && "border-primary bg-primary/5 text-foreground", done && !active && "border-transparent bg-muted text-muted-foreground"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("h-5 w-5 rounded-full text-[11px] font-semibold flex items-center justify-center", active ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20"), children: n }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: label })
  ] });
}
export {
  Page as component
};
