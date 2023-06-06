import { FC } from "react";
import ChatWindow from "./ChatWindow";
import ChatNavigation from "./ChatNavigation";
import ChatGrid from "./ChatGrid";
import ChatBubble from "./ChatBubble";
import ChatInputBar from "./ChatInputBar";
import { useChatContext } from "@/contexts/ApplicationContext";

type Message = {
  id: number,
  isUser: boolean,
  content: string,
  time: string,
  sender: string,
}

const useMessages = () => {
  const { state } = useChatContext();
  return state.messages;
};

const Chat: FC = () => {
  const messages: Message[] = useMessages();
  return (
    <ChatWindow>
      <ChatNavigation />
      <ChatGrid>
        {
          messages.map(m => (<ChatBubble
            key={m.id}
            name={m.isUser ? "" : m.sender }
            message={m.content}
            time={m.time}
            side={m.isUser ? "right" : "left"}
          />))
        }
      </ChatGrid>
      <ChatInputBar />
    </ChatWindow>
  );
}

export default Chat;