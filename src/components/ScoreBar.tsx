/** Progress bar without inline CSS (SVG attrs are CSP-safe). */
export function ScoreBar({
  score,
  level,
  className = "",
}: {
  score: number;
  level: "low" | "medium" | "high";
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const fill =
    level === "high" ? "var(--destructive)" : level === "medium" ? "var(--warning)" : "var(--success)";

  return (
    <svg
      className={`block h-2 w-full ${className}`}
      viewBox="0 0 100 8"
      preserveAspectRatio="none"
      role="img"
      aria-label={`Score ${clamped} percent`}
    >
      <rect x="0" y="0" width="100" height="8" rx="4" fill="var(--muted)" />
      <rect x="0" y="0" width={clamped} height="8" rx="4" fill={fill} />
    </svg>
  );
}
