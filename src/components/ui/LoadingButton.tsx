import { Loader2 } from "lucide-react";
import React from "react";
import { Button } from "./button";

export const LoadingButton = ({ className }: { className?: string }) => {
  return (
    <Button disabled className={className}>
      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
      Please wait
    </Button>
  );
};
