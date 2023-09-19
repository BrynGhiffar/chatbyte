import { FC, useRef } from "react";
import ChatWindow from "./ChatWindow";
import ChatNavigation from "./ChatNavigation";
import ChatGrid from "./ChatGrid";
import ChatInputBar from "./ChatInputBar";
import { useCurrentContactUid } from "@/utility/UtilityHooks";
import EmptyChatWindow from "./EmptyChatWindow";

const Chat: FC = () => {
  const uid = useCurrentContactUid();
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