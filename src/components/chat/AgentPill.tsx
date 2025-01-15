import { forwardRef } from "react";

interface AgentPillProps {
  name: string;
}

export const AgentPill = forwardRef<HTMLDivElement, AgentPillProps>(
  ({ name }, ref) => (
    <div
      ref={ref}
      className='w-fit rounded-full border border-dashed border-gray-40 px-2 py-1 text-xs font-semibold uppercase text-purple-100 mb-2 lg:mb-0 lg:text-opacity-0 lg:absolute lg:left-2 lg:top-1/2 lg:-translate-y-1/2'
    >
      {name}
    </div>
  )
);

AgentPill.displayName = "AgentPill";
