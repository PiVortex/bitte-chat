import React, { useEffect, useRef, useState } from "react";

import { ArrowUp } from "lucide-react";

import { AgentPill } from "./AgentPill";
import { cn } from "../../lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { LoadingButton } from "../ui/LoadingButton";

interface SmartActionsInputProps {
  input: string;
  isLoading: boolean;
  agentName?: string;
  isMobile?: boolean;
  isDefault?: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  openAgentSelector: () => void;
}

export const SmartActionsInput = ({
  input,
  isLoading,
  agentName,
  isMobile,
  isDefault,
  handleChange,
  handleSubmit,
  openAgentSelector,
}: SmartActionsInputProps) => {
  const agentNameRef = useRef<HTMLDivElement>(null);
  const [paddingLeft, setPaddingLeft] = useState<number>(16);
  const [previousAgentName, setPreviousAgentName] = useState("Select Agent");

  useEffect(() => {
    if (agentNameRef.current && !isMobile) {
      setPaddingLeft(agentNameRef.current.offsetWidth + 16);
    } else {
      setPaddingLeft(16);
    }
  }, [agentName]);

  useEffect(() => {
    if (agentName && agentName !== previousAgentName) {
      setPreviousAgentName(agentName);
    }
  }, [agentName]);

  return (
    <form
      className={
        "relative mb-0 flex w-full items-center justify-center gap-4 max-lg:flex-wrap"
      }
      onSubmit={handleSubmit}
    >
      <div className="w-full">
        {agentName ? (
          <AgentPill
            name={agentName}
            ref={agentNameRef}
            isMobile={isMobile}
            isPositioned
          />
        ) : (
          <div
            ref={agentNameRef}
            className={cn(
              "w-fit rounded-full border border-dashed border-gray-40 px-2 py-1 text-xs font-semibold uppercase text-gray-40",
              !isMobile &&
                "absolute left-2 top-1/2 -translate-y-1/2 text-opacity-0"
            )}
          >
            {previousAgentName}
          </div>
        )}
        <Input
          placeholder="Message Smart Actions"
          style={{
            paddingLeft: isMobile ? "16px" : `${paddingLeft}px`,
          }}
          className="mt-2 h-[42px] w-full lg:mt-0"
          onChange={handleChange}
          value={input}
        />
      </div>
      {isMobile ? (
        <div className="flex w-full gap-4">
          <Button
            variant="outline"
            className="w-full"
            type="button"
            onClick={openAgentSelector}
          >
            Agents
          </Button>

          {isLoading && isDefault ? (
            <LoadingButton className="w-full" />
          ) : (
            <Button
              className="w-full disabled:opacity-20"
              type="submit"
              disabled={!input || isLoading}
            >
              Send
            </Button>
          )}
        </div>
      ) : (
        <Button
          type="submit"
          disabled={!input || isLoading}
          className="h-[42px] w-[42px] bg-gray-800 p-0 disabled:opacity-20"
        >
          <ArrowUp className="h-[16px] w-[16px] text-white" />
        </Button>
      )}
    </form>
  );
};
