import { cn } from "../../../lib/utils";
import { InputComponentProps } from "../../../types";

const DefaultInputComponent = ({
  value,
  onChange,
  onKeyDown,
  placeholder,
  disabled,
  borderColor,
  textColor,
  backgroundColor,
}: InputComponentProps) => (
  <input
    type='text'
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
    placeholder={placeholder || "Ask anything..."}
    disabled={disabled}
    className={cn(
      "bitte-flex-1 bitte-bg-transparent bitte-px-4 bitte-py-2 bitte-text-sm bitte-outline-none bitte-placeholder:text-muted-foreground bitte-disabled:cursor-not-allowed bitte-disabled:opacity-50"
    )}
    style={{
      color: textColor,
      backgroundColor,
    }}
  />
);

export default DefaultInputComponent;
