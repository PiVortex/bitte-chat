import * as React from "react";
import { cn } from "../../lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, style, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "bitte-flex bitte-min-h-[80px] bitte-w-full bitte-rounded-md bitte-border bitte-border-input bitte-bg-background bitte-px-3 bitte-py-2 bitte-text-base bitte-ring-offset-background focus-visible:bitte-outline-none focus-visible:bitte-ring-2 focus-visible:bitte-ring-ring focus-visible:bitte-ring-offset-2 disabled:bitte-cursor-not-allowed disabled:bitte-opacity-50",
          className
        )}
        ref={ref}
        style={style}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
