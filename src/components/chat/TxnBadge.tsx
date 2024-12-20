import React from "react";
import { Badge } from "../ui/badge";

const TxnBadge = ({ transactionType }: { transactionType: string }) => {
  let styleClass = "";
  let displayName = "";

  switch (transactionType) {
    case "nft_batch_mint":
    case "mint":
      styleClass = "bg-shad-white-10 text-shad-slate-20";
      displayName = "Mint";
      break;
    case "nft_transfer":
      styleClass = "bg-shad-bg-light-blue-10 text-shad-blue-100";
      displayName = "Transfer";
      break;
    case "nft_approve":
      styleClass = "bg-light-purple text-purple-100";
      displayName = "List";
      break;
    case "nft_batch_burn":
      styleClass = "bg-shad-error-5 text-shad-error";
      displayName = "Burn";
      break;
    case "buy":
      styleClass = "bg-shad-light-green text-shad-green-20";
      displayName = "Buy";
      break;
    case "ft_transfer":
    case "Send":
      styleClass = "bg-shad-light-green text-shad-green-20";
      displayName = "Send";
      break;
    default: // Default styles
      styleClass = "bg-shad-white-10 text-shad-slate-20";
      displayName = transactionType; // Default to raw transaction type if not matched
  }

  return <Badge className={`px-2 ${styleClass}`}>{displayName}</Badge>;
};

export default TxnBadge;
