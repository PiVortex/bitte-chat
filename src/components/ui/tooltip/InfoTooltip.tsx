import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";
import { TooltipProvider } from "../tooltip";

interface InfoTooltipProps {
  text: string;
  trigger: JSX.Element;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ text, trigger }) => {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger>{trigger}</TooltipTrigger>
        <TooltipContent>
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default InfoTooltip;
