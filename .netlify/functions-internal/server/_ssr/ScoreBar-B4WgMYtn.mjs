import { j as jsxRuntimeExports } from "../_libs/react.mjs";
function ScoreBar({
  score,
  level,
  className = ""
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const fill = level === "high" ? "var(--destructive)" : level === "medium" ? "var(--warning)" : "var(--success)";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      className: `block h-2 w-full ${className}`,
      viewBox: "0 0 100 8",
      preserveAspectRatio: "none",
      role: "img",
      "aria-label": `Score ${clamped} percent`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0", y: "0", width: "100", height: "8", rx: "4", fill: "var(--muted)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0", y: "0", width: clamped, height: "8", rx: "4", fill })
      ]
    }
  );
}
export {
  ScoreBar as S
};
