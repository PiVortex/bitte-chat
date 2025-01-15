import * as React from "react"

import { cn } from "../../lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "bitte-flex bitte-h-9 bitte-w-full bitte-rounded-md bitte-border bitte-border-input bitte-bg-transparent bitte-px-3 bitte-py-1 bitte-text-base bitte-shadow-sm bitte-transition-colors file:bitte-border-0 file:bitte-bg-transparent file:bitte-text-sm file:bitte-font-medium file:bitte-text-foreground placeholder:bitte-text-muted-foreground focus-visible:bitte-outline-none focus-visible:bitte-ring-1 focus-visible:bitte-ring-ring disabled:bitte-cursor-not-allowed disabled:bitte-opacity-50 md:bitte-text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
