import { FC, useRef } from "react";
import ChatNavigation from "./ChatNavigation";
import ChatGrid from "./ChatGrid";
import ChatInputBar from "./ChatInputBar";
import EmptyChatWindow from "./EmptyChatWindow";
import { useSelectedContact } from "@/store/AppStore/hooks";
import { TH__ChatWindow } from "./styled";

const Chat: FC = () => {
  const contact = useSelectedContact();
  if (contact) {
    return (
          <TH__ChatWindow>
            <ChatNavigation />
            <ChatGrid/>
            <ChatInputBar />
          </TH__ChatWindow>
    )
  }
  return (
    <EmptyChatWindow/>
  );
}

export default Chat;