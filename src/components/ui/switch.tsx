import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "../../lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "bitte-peer bitte-inline-flex bitte-h-5 bitte-w-9 bitte-shrink-0 bitte-cursor-pointer bitte-items-center bitte-rounded-full bitte-border-2 bitte-border-transparent bitte-shadow-sm bitte-transition-colors focus-visible:bitte-outline-none focus-visible:bitte-ring-2 focus-visible:bitte-ring-ring focus-visible:bitte-ring-offset-2 focus-visible:bitte-ring-offset-background disabled:bitte-cursor-not-allowed disabled:bitte-opacity-50 data-[state=checked]:bitte-bg-primary data-[state=unchecked]:bitte-bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "bitte-pointer-events-none bitte-block bitte-h-4 bitte-w-4 bitte-rounded-full bitte-bg-background bitte-shadow-lg bitte-ring-0 bitte-transition-transform data-[state=checked]:bitte-translate-x-4 data-[state=unchecked]:bitte-translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
