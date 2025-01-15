import React from "react";
import { cn } from "../../lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("bitte-animate-pulse bitte-rounded-md bitte-bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
