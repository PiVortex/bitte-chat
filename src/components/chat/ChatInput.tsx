import React, { useEffect, useRef, useState } from "react";

import { ArrowUp } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { AgentPill } from "./AgentPill";

interface SmartActionsInputProps {
  input: string;
  isLoading: boolean;
  agentName?: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  buttonColor?: string;
}

export const SmartActionsInput = ({
  input,
  isLoading,
  agentName,
  handleChange,
  handleSubmit,
  buttonColor,
}: SmartActionsInputProps) => {
  const agentNameRef = useRef<HTMLDivElement>(null);
  const [paddingLeft, setPaddingLeft] = useState<number>(16);
  const [previousAgentName, setPreviousAgentName] = useState("Select Agent");

  useEffect(() => {
    if (agentNameRef.current) {
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
      <div className="w-full relative">
        {agentName ? (
          <AgentPill name={agentName} ref={agentNameRef} />
        ) : (
          <div
            ref={agentNameRef}
            className="w-fit rounded-full border border-dashed border-gray-40 px-2 py-1 text-xs font-semibold uppercase text-gray-40 absolute left-2 top-1/2 -translate-y-1/2 text-opacity-0"
          >
            {previousAgentName}
          </div>
        )}
        <Input
          placeholder="Message Smart Actions"
          style={{
            paddingLeft: `${paddingLeft}px`,
          }}
          className="h-[42px] w-full"
          onChange={handleChange}
          value={input}
        />
      </div>
      <Button
        type="submit"
        disabled={!input || isLoading}
        className="h-[42px] lg:w-[42px] p-0 disabled:opacity-20 text-white"
        style={{ backgroundColor: buttonColor }}
      >
        <ArrowUp className="h-[16px] w-[16px] hidden lg:block" />
        <span className="lg:hidden">Send</span>
      </Button>
    </form>
  );
};
