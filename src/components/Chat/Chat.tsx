import { FC, useRef } from "react";
import ChatWindow from "./ChatWindow";
import ChatNavigation from "./ChatNavigation";
import ChatGrid from "./ChatGrid";
import ChatBubble from "./ChatBubble";
import ChatInputBar from "./ChatInputBar";
import { useUpdateEffect } from "usehooks-ts";
import { useChatContext, useChatListContext } from "@/utility/UtilityHooks";

const Chat: FC = () => {
  return (
    <ChatWindow>
      <ChatNavigation />
      <ChatGrid/>
      <ChatInputBar />
    </ChatWindow>
  );
}

export default Chat;