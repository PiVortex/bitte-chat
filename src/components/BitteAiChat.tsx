import React, { useState, useEffect } from "react";
import { BitteAiChatProps } from "../types/types";
import { ChatContent } from "./chat/ChatContent";
import { AccountProvider } from "./AccountContext";
import { getSmartActionChat, convertToUIMessages } from "../lib/chat";
import { Message } from "ai";
import { SmartActionMessage } from "../types/types";

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
  evmWallet,
}: BitteAiChatProps) => {
  const [loadedData, setLoadedData] = useState({
    messagesLoaded: [] as SmartActionMessage[],
    agentIdLoaded: "",
    promptLoaded: "",
    creatorLoaded: "",
    uiMessages: [] as Message[],
  });

  useEffect(() => {
    const fetchChatData = async () => {
      const chatId = localStorage.getItem("chatId") || "";
      const smartActionChat = await getSmartActionChat(chatId);

      if (smartActionChat) {
        const {
          messages: messagesLoaded,
          agentId: agentIdLoaded,
          message: promptLoaded,
          creator: creatorLoaded,
        } = smartActionChat;

        const uiMessages = convertToUIMessages(messagesLoaded);

        setLoadedData({
          messagesLoaded,
          agentIdLoaded,
          promptLoaded,
          creatorLoaded,
          uiMessages,
        });
      }
    };

    fetchChatData();
  }, []);

  const {
    messagesLoaded,
    agentIdLoaded,
    promptLoaded,
    creatorLoaded,
    uiMessages,
  } = loadedData;

  return (
    <AccountProvider wallet={wallet} account={account} evmWallet={evmWallet}>
      <ChatContent
        id={id || localStorage.getItem("chatId") || ""}
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
