import styled from "styled-components";
import { commonCss } from "@/components/Palette";
import { useRef, MutableRefObject } from "react";
import { useUpdateEffect } from "usehooks-ts";
import { Message } from "@/contexts/ChatContext";
import { useChatContext, useChatListContext } from "@/utility/UtilityHooks";
import ChatBubble from "./ChatBubble";

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
  const map = state.messages;
  const msgs = map.get(uid);
  if (!msgs) return [];
  return msgs;
};

const useScrollToBottom = (ref: MutableRefObject<HTMLDivElement | null>) => {
    const messages: Message[] = useMessages();
    useUpdateEffect(() => {
        if (ref.current === null) return;
        const e = ref.current;
        e.scrollTo(0, e.scrollHeight);
    }, [messages]);
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
                />))
            }
        </ChatGridStyled>
    );
};

export default ChatGrid;