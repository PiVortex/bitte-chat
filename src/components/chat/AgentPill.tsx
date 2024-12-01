import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";

interface AgentPillProps {
  name: string;
  isPositioned?: boolean;
  isMobile?: boolean;
}

export const AgentPill = forwardRef<HTMLDivElement, AgentPillProps>(
  ({ name, isPositioned, isMobile }, ref) => (
    <div
      ref={ref}
      className={cn(
        "w-fit rounded-full border border-dashed border-gray-40 px-2 py-1 text-xs font-semibold uppercase text-purple-100",
        isPositioned && !isMobile && "absolute left-2 top-1/2 -translate-y-1/2"
      )}
    >
      {name}
    </div>
  )
);

AgentPill.displayName = "AgentPill";
