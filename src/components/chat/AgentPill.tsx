import { forwardRef } from "react";

interface AgentPillProps {
  name: string;
}

export const AgentPill = forwardRef<HTMLDivElement, AgentPillProps>(
  ({ name }, ref) => (
    <div
      ref={ref}
      className="w-fit rounded-full border border-dashed border-gray-40 px-2 py-1 text-xs font-semibold uppercase text-purple-100 absolute left-2 top-1/2 -translate-y-1/2"
    >
      {name}
    </div>
  )
);

AgentPill.displayName = "AgentPill";
