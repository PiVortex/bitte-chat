import { BitteAiChatProps } from "../types/types";
import { ChatContent } from "./chat/ChatContent";
import { AccountProvider } from "./AccountContext";
export const BitteAiChat = ({
  colors,
  wallet,
  apiUrl,
  agentid,
}: BitteAiChatProps) => {
  return (
    <AccountProvider wallet={wallet}>
      <ChatContent
        colors={colors}
        wallet={wallet}
        apiUrl={apiUrl}
        agentid={agentid}
      />
    </AccountProvider>
  );
};
