import { FC, useRef } from "react";
import ChatWindow from "./ChatWindow";
import ChatNavigation from "./ChatNavigation";
import ChatGrid from "./ChatGrid";
import ChatInputBar from "./ChatInputBar";
import EmptyChatWindow from "./EmptyChatWindow";
import { useSelectedContact } from "@/store/AppStore/hooks";

const Chat: FC = () => {
  const uid = useSelectedContact();
  if (uid) {
    return (
          <ChatWindow>
            <ChatNavigation />
            <ChatGrid/>
            <ChatInputBar />
          </ChatWindow>
    )
  }
  return (
    <EmptyChatWindow/>
  );
}

export default Chat;