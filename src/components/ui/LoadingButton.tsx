import { Loader2 } from "lucide-react";
import React from "react";
import { Button } from "./button";

export const LoadingButton = ({ className }: { className?: string }) => {
  return (
    <Button disabled className={className}>
      <Loader2 className="bitte-mr-2 bitte-h-4 bitte-w-4 bitte-animate-spin" />
      Please wait
    </Button>
  );
};
