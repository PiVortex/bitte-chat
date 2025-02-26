import { SendHorizontal } from "lucide-react";
import { cn } from "../../../lib/utils";
import { SendButtonComponentProps } from "../../../types";

const DefaultSendButton = ({
  onClick,
  disabled,
  buttonColor,
  textColor,
}: SendButtonComponentProps) => (
  <button
    type='submit'
    disabled={disabled}
    className={cn(
      "bitte-inline-flex bitte-items-center bitte-justify-center bitte-rounded-md bitte-text-sm bitte-font-medium bitte-ring-offset-background bitte-transition-colors focus-visible:bitte-outline-none focus-visible:bitte-ring-2 focus-visible:bitte-ring-ring focus-visible:bitte-ring-offset-2 bitte-disabled:pointer-events-none bitte-disabled:opacity-50 bitte-h-10 bitte-px-4 bitte-py-2"
    )}
    style={{
      backgroundColor: buttonColor,
      color: textColor,
    }}
  >
    <SendHorizontal className='bitte-h-4 bitte-w-4' />
  </button>
);

export default DefaultSendButton;
