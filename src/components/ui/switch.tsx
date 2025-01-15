import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "../../lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "bitte-peer bitte-inline-flex bitte-h-6 bitte-w-11 bitte-shrink-0 bitte-cursor-pointer bitte-items-center bitte-rounded-full bitte-border-2 bitte-border-transparent bitte-transition-colors bitte-focus-visible:outline-none bitte-focus-visible:ring-2 bitte-focus-visible:ring-ring bitte-focus-visible:ring-offset-2 bitte-focus-visible:ring-offset-background bitte-disabled:cursor-not-allowed bitte-disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "bitte-pointer-events-none bitte-block bitte-h-5 bitte-w-5 bitte-rounded-full bitte-bg-background bitte-shadow-lg bitte-ring-0 bitte-transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
