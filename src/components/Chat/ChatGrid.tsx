import styled from "styled-components";
import { commonCss } from "@/components/Palette";
import { useRef, MutableRefObject, useEffect } from "react";
import { Message } from "@/contexts/ChatContext";
import { useChatContext, useChatListContext } from "@/utility/UtilityHooks";
import ChatBubble from "./ChatBubble";
import { useSpring } from "framer-motion";

const ChatGridStyled = styled.div`
    ${commonCss.transition}
    ${commonCss.scrollableCss}
    /* overflow-y: hidden; */
    overflow-x: hidden;
`;

const useCurrentContactUid = () => {
  const { state } = useChatListContext();
  return state.selectedContact?.uid;
};

const useMessages = () => {
  const { state } = useChatContext();
  const uid = useCurrentContactUid();
  if (!uid) return [];
  return state.messages;
};

const useScrollToBottom = (ref: MutableRefObject<HTMLDivElement | null>) => {
    const messages: Message[] = useMessages();
    useEffect(() => {
        if (ref.current === null) return;
        const e = ref.current;
        e.scrollTo({ top: e.scrollHeight, behavior: "smooth" });
    }, [messages, ref]);
};

const ChatGrid = () => {
    const gridRef = useRef<HTMLDivElement | null>(null);
    const messages: Message[] = useMessages();
    useScrollToBottom(gridRef)
    return (
        <ChatGridStyled ref={gridRef}>
            {
                messages.map(m => (<ChatBubble
                    key={m.id}
                    name={m.isUser ? "" : m.sender }
                    message={m.content}
                    time={m.time}
                    side={m.isUser ? "right" : "left"}
                    receiverRead={m.receiverRead}
                />))
            }
        </ChatGridStyled>
    );
};

export default ChatGrid;