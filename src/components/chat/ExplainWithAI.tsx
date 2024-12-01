import { Transaction } from "@near-wallet-selector/core";
import { useCompletion } from "ai/react";
import { ChevronDown, Loader2, Wand2 } from "lucide-react";
import { explainSignRequest, SafeEncodedSignRequest } from "near-safe";
import { useState } from "react";

import { buildTxPrompt, formatTransactionActions } from "../../types/ai/utils/explain-tx";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

type ExplainWithAIProps = {
  evmData?: SafeEncodedSignRequest;
  transactions: Transaction[];
  variant?: "default" | "review";
};

export function ExplainWithAI({
  evmData,
  transactions,
  variant = "default",
}: ExplainWithAIProps) {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const { completion, isLoading, complete } = useCompletion({
    api: "https://wallet.bitte.ai/api/completion",
  });

  const toggleAccordion = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const handleExplain = async () => {
    const evmDetails = evmData ? await explainSignRequest(evmData) : "{}";

    const prompt = buildTxPrompt(
      formatTransactionActions(transactions),
      evmDetails
    );

    complete(prompt);
  };

  const explainButton = (
    <>
      <Button
        className="w-full border-purple-100 bg-purple-100-10 text-purple-100"
        variant="outline"
        onClick={handleExplain}
        disabled={isLoading || (!evmData && !transactions)}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Wand2 className="mr-2 h-4 w-4" />
        )}
        Explain Transaction
      </Button>
    </>
  );

  if (variant === "review") {
    return (
      <>
        {explainButton}
        {completion ? (
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <div
                className="flex cursor-pointer gap-0.5"
                onClick={toggleAccordion}
              >
                <span className="flex items-center justify-center rounded bg-shad-white-30 p-1 px-2 text-[14px] text-text-primary">
                  <code>Txn Explanation</code>
                </span>
                <div className="flex w-[30px] items-center justify-center rounded rounded-r-sm bg-shad-white-30 text-text-primary">
                  <ChevronDown
                    className={`${isOpen ? "rotate-180" : ""}`}
                    width={16}
                  />
                </div>
              </div>
            </div>

            {isOpen && (
              <div className="mt-2 w-full bg-shad-white-30 p-4 text-sm">
                <code>{completion}</code>
              </div>
            )}
          </div>
        ) : null}
      </>
    );
  }

  return (
    <Card className="">
      <CardContent className="p-4">
        {explainButton}
        {completion ? (
          <div className="mt-4 text-sm text-gray-700">{completion}</div>
        ) : null}
      </CardContent>
    </Card>
  );
}
