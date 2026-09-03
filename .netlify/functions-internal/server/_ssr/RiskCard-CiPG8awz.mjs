import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { S as ScoreBar } from "./ScoreBar-B4WgMYtn.mjs";
import { C as Card } from "./card-DbnvS79O.mjs";
import { severityColor } from "./router-BdVNv3tq.mjs";
function RiskCard({
  title,
  icon: Icon,
  risk,
  hasData = true,
  emptyMessage
}) {
  const placeholder = emptyMessage ?? `Submit your ${title.toLowerCase()} check to see risk level`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "@container min-w-0 overflow-hidden p-4 sm:p-5 flex flex-col gap-3 sm:gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 shrink-0 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "min-w-0 text-sm font-semibold leading-5 tracking-normal whitespace-nowrap", children: title })
      ] }),
      hasData && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: `self-start text-xs font-semibold uppercase tracking-wide rounded-full px-2.5 py-1 leading-tight whitespace-nowrap ${severityColor[risk.level]}`,
          children: risk.label
        }
      )
    ] }),
    hasData ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between gap-2 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[clamp(1.25rem,10cqw,1.875rem)] font-semibold tracking-tight tabular-nums leading-none", children: risk.score }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs sm:text-sm text-muted-foreground leading-tight whitespace-nowrap", children: "Risk Score" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreBar, { score: risk.score, level: risk.level })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-snug", children: placeholder })
  ] });
}
export {
  RiskCard as R
};
