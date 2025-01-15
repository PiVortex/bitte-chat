import * as React from "react";

import { cn } from "../../lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "bitte-flex bitte-h-10 bitte-w-full bitte-rounded-md bitte-border bitte-border-input bitte-bg-background bitte-px-3 bitte-py-2 bitte-text-base bitte-ring-offset-background bitte-file:border-0 bitte-file:bg-transparent bitte-file:text-sm bitte-file:font-medium bitte-file:text-foreground bitte-placeholder:text-muted-foreground bitte-focus-visible:outline-none bitte-focus-visible:ring-2 bitte-focus-visible:ring-ring bitte-focus-visible:ring-offset-2 bitte-disabled:cursor-not-allowed bitte-disabled:opacity-50 bitte-md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
