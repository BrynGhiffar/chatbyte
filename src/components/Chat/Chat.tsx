import { FC, useRef } from "react";
import ChatWindow from "./ChatWindow";
import ChatNavigation from "./ChatNavigation";
import ChatGrid from "./ChatGrid";
import ChatBubble from "./ChatBubble";
import ChatInputBar from "./ChatInputBar";
import { useUpdateEffect } from "usehooks-ts";
import { useChatContext } from "@/utility/UtilityHooks";

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
  const gridRef = useRef<HTMLDivElement | null>(null);
  useUpdateEffect(() => {
    if (gridRef.current === null) return;
    const e = gridRef.current;
    e.scrollTo(0, e.scrollHeight);
  }, [messages]);

  return (
    <ChatWindow>
      <ChatNavigation />
      <ChatGrid ref={gridRef}>
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