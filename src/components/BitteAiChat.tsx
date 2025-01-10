import { Message } from "ai";
import { useEffect, useState } from "react";
import { convertToUIMessages } from "../lib/chat";
import { fetchChatHistory } from "../lib/fetchChatHistory";
import { BitteAiChatProps, SmartActionMessage } from "../types/types";
import { AccountProvider } from "./AccountContext";
import { ChatContent } from "./chat/ChatContent";

export const BitteAiChat = ({
  colors,
  wallet,
  apiUrl,
  historyApiUrl,
  agentid,
  options,
}: BitteAiChatProps) => {
  const [loadedData, setLoadedData] = useState({
    messagesLoaded: [] as SmartActionMessage[],
    agentIdLoaded: "",
    promptLoaded: "",
    creatorLoaded: "",
    uiMessages: [] as Message[],
  });

  const chatId =
    typeof window !== "undefined" && localStorage.getItem("chatId");

  useEffect(() => {
    const fetchData = async () => {
      if (chatId && historyApiUrl) {
        const chat = await fetchChatHistory(chatId, historyApiUrl);
        if (chat) {
          const uiMessages = convertToUIMessages(chat.messages);
          setLoadedData({
            messagesLoaded: chat.messages,
            agentIdLoaded: chat.agentId,
            promptLoaded: chat.message,
            creatorLoaded: chat.creator,
            uiMessages: uiMessages,
          });
        }
      }
    };

    fetchData();
  }, [chatId, historyApiUrl]);

  const {
    messagesLoaded,
    agentIdLoaded,
    promptLoaded,
    creatorLoaded,
    uiMessages,
  } = loadedData;

  console.log("AGENT ID", agentid);

  return (
    <AccountProvider wallet={wallet}>
      <ChatContent
        colors={colors}
        wallet={wallet}
        apiUrl={apiUrl}
        agentid={agentid ?? agentIdLoaded}
        messages={uiMessages}
        options={{
          agentName: options?.agentName,
          agentImage: options?.agentImage,
          chatId: options?.chatId ?? (chatId || undefined),
        }}
      />
    </AccountProvider>
  );
};
