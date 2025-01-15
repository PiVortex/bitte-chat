import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";
import { cn } from "../../lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "bitte-z-50 bitte-overflow-hidden bitte-rounded-md bitte-border bitte-bg-popover bitte-px-3 bitte-py-1.5 bitte-text-sm bitte-text-popover-foreground bitte-shadow-md bitte-animate-in bitte-fade-in-0 bitte-zoom-in-95 data-[state=closed]:bitte-animate-out data-[state=closed]:bitte-fade-out-0 data-[state=closed]:bitte-zoom-out-95 data-[side=bottom]:bitte-slide-in-from-top-2 data-[side=left]:bitte-slide-in-from-right-2 data-[side=right]:bitte-slide-in-from-left-2 data-[side=top]:bitte-slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
