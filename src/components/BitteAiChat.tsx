import React from "react";
import { BitteAiChatProps } from "../types/types";
import { ChatContent } from "./chat/ChatContent";
import { AccountProvider } from "./AccountContext";
import { getSmartActionChat, convertToUIMessages } from "../lib/chat";

export const BitteAiChat = async ({
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
  evmWallet,
}: BitteAiChatProps) => {
  const chatId = localStorage.getItem("chatId") || "";
  const smartActionChat = await getSmartActionChat(chatId);
  console.log("SMART A CHAT", smartActionChat);

  let messagesLoaded, agentIdLoaded, promptLoaded, creatorLoaded, uiMessages;

  if (smartActionChat) {
    ({
      messages: messagesLoaded,
      agentId: agentIdLoaded,
      message: promptLoaded,
      creator: creatorLoaded,
    } = smartActionChat);

    console.log("MESSAGES LOADED", messagesLoaded);
    uiMessages = convertToUIMessages(messagesLoaded);

    console.log("UI MSG", uiMessages);
  }

  return (
    <AccountProvider wallet={wallet} account={account} evmWallet={evmWallet}>
      <ChatContent
        id={id || chatId}
        creator={creator || creatorLoaded}
        prompt={prompt || promptLoaded}
        messages={messages || uiMessages}
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
