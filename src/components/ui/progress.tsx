"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {
  const indicatorRef = React.useRef<HTMLDivElement>(null);
  const pct = Math.max(0, Math.min(100, value || 0));

  // Set transform via the CSSOM (not a style="" attribute) so CSP style-src stays strict.
  React.useLayoutEffect(() => {
    if (indicatorRef.current) {
      indicatorRef.current.style.transform = `translateX(-${100 - pct}%)`;
    }
  }, [pct]);

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        ref={indicatorRef}
        className="h-full w-full flex-1 bg-primary transition-all"
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
