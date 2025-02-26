import { ArrowDown } from "lucide-react";
import { ChatContainerComponentProps } from "../../../types";
import { Button } from "../../ui/button";

const DefaultChatContainer = ({
  children,
  style,
  isAtBottom,
  onScrollToBottom,
  textColor,
}: ChatContainerComponentProps) => (
  <div
    className='bitte-chat-main bitte-text-start bitte-flex-1 bitte-relative bitte-min-h-[360px] bitte-w-full bitte-overflow-hidden lg:bitte-rounded-md bitte-border-t bitte-border-b lg:bitte-border bitte-pl-6'
    style={{
      backgroundColor: style.backgroundColor,
      borderColor: style.borderColor,
    }}
  >
    {!isAtBottom && (
      <Button
        size='icon'
        variant='outline'
        className='bitte-absolute bitte-bottom-2 bitte-left-1/2 bitte--translate-x-1/2 hover:bitte-bg-inherit bitte-z-[99]'
        style={{
          backgroundColor: style.backgroundColor,
          borderRadius: "9999px",
        }}
        onClick={onScrollToBottom}
      >
        <ArrowDown
          className='bitte-h-4 bitte-w-4'
          style={{ color: textColor }}
        />
      </Button>
    )}
    {children}
  </div>
);

export default DefaultChatContainer;
