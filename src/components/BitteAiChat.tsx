import React from "react";
import { BitteAiChatProps } from "../types/types";
import { ChatContent } from "./chat/ChatContent";
import { AccountProvider } from "./AccountContext";

export const BitteAiChat = ({
  id,
  creator,
  prompt,
  messages,
  agentData,
  model,
  isShare,
  colors,
  account,
  wallet,
  apiUrl,
}: BitteAiChatProps) => {
  return (
    <AccountProvider wallet={wallet} account={account}>
      <ChatContent
        id={id}
        creator={creator}
        prompt={prompt}
        messages={messages}
        agentData={agentData}
        model={model}
        isShare={isShare}
        colors={colors}
        account={account}
        wallet={wallet}
        apiUrl={apiUrl}
      />
    </AccountProvider>
  );
};
