import { ScoreBar } from "@/components/ScoreBar";
import { Card } from "@/components/ui/card";
import { severityColor, type Risk } from "@/lib/risk-store";
import type { LucideIcon } from "lucide-react";

export function RiskCard({
  title,
  icon: Icon,
  risk,
  hasData = true,
  emptyMessage,
}: {
  title: string;
  icon: LucideIcon;
  risk: Risk;
  hasData?: boolean;
  emptyMessage?: string;
}) {
  const placeholder = emptyMessage ?? `Submit your ${title.toLowerCase()} check to see risk level`;

  return (
    <Card className="@container min-w-0 overflow-hidden p-4 sm:p-5 flex flex-col gap-3 sm:gap-4">
      <div className="flex flex-col gap-2 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="min-w-0 text-sm font-semibold leading-5 tracking-normal whitespace-nowrap">
            {title}
          </span>
        </div>
        {hasData && (
          <span
            className={`self-start text-xs font-semibold uppercase tracking-wide rounded-full px-2.5 py-1 leading-tight whitespace-nowrap ${severityColor[risk.level]}`}
          >
            {risk.label}
          </span>
        )}
      </div>
      {hasData ? (
        <>
          <div className="flex items-end justify-between gap-2 min-w-0">
            <div className="text-[clamp(1.25rem,10cqw,1.875rem)] font-semibold tracking-tight tabular-nums leading-none">
              {risk.score}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground leading-tight whitespace-nowrap">
              Risk Score
            </div>
          </div>
          <ScoreBar score={risk.score} level={risk.level} />
        </>
      ) : (
        <p className="text-sm text-muted-foreground leading-snug">{placeholder}</p>
      )}
    </Card>
  );
}
