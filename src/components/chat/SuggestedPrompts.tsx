import { RefreshCcw } from "lucide-react";
import React, { useMemo, useState } from "react";

import { useWindowSize } from "../../hooks/useWindowSize";
import { SUGGESTED_PROMPTS } from "../../lib/constants";
import { Button } from "../ui/button";
import { formatName } from "../../lib/utils";

type SuggestedPromptsProps = React.HTMLAttributes<HTMLDivElement> & {
  handleClick: (message: string) => void;
};

export const SuggestedPrompts = ({ handleClick }: SuggestedPromptsProps) => {
  const [refresh, setRefresh] = useState(0);

  const { width } = useWindowSize();

  const adjustedPromptCount = useMemo(() => {
    if (width) {
      if (width <= 767) return 1;
      if (width <= 1023) return 2;
    }

    return 3;
  }, [width]);

  const randomPrompts = useMemo(
    () =>
      SUGGESTED_PROMPTS.sort(() => 0.5 - Math.random()).slice(
        0,
        adjustedPromptCount
      ),
    [adjustedPromptCount, refresh]
  );

  return (
    <div className="flex items-center gap-4">
      <div className="disable-scrollbars flex flex-1 gap-4 overflow-x-auto whitespace-nowrap md:items-center">
        {randomPrompts.map(({ title, subtitle, prompt }, index) => (
          <div
            key={index}
            className="group h-full w-full min-w-[100px] cursor-pointer overflow-hidden rounded-md bg-shad-white-30 p-4 text-sm transition-all duration-500 hover:bg-card-list-hover lg:bg-background"
            onClick={() => {
              handleClick(prompt);
            }}
          >
            <p className="font-medium text-shad-slate-5 transition-all duration-500 group-hover:text-gray-800">
              {formatName(title, 24)}
            </p>
            <p className="text-text-secondary transition-all duration-500 group-hover:text-gray-800">
              {formatName(subtitle, 24)}
            </p>
          </div>
        ))}
      </div>
      <div className="shrink-0">
        <Button
          size="icon"
          className="bg-shad-white-30 lg:bg-background"
          variant="secondary"
          onClick={() => setRefresh((prev) => prev + 1)}
        >
          <RefreshCcw size={16} />
        </Button>
      </div>
    </div>
  );
};
