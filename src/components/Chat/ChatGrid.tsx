import styled from "styled-components";
import { commonCss } from "@/components/Palette";
import { useRef, MutableRefObject, useEffect, memo } from "react";
import ChatBubble from "./ChatBubble";
import { useSelectedContactMessages } from "@/store/AppStore/hooks";
import { Message } from "@/store/AppStore/type";

const ChatGridStyled = styled.div`
    ${commonCss.transition}
    ${commonCss.scrollableCss}
    /* overflow-y: hidden; */
    overflow-x: hidden;
`;

const useScrollToBottom = (ref: MutableRefObject<HTMLDivElement | null>) => {
    const messages: Message[] = useSelectedContactMessages();
    useEffect(() => {
        if (ref.current === null) return;
        const e = ref.current;
        e.scrollTop = e.scrollHeight
    }, [ref, messages]);
};

const ChatGrid = () => {
    const gridRef = useRef<HTMLDivElement | null>(null);
    const messages: Message[] = useSelectedContactMessages();
    useScrollToBottom(gridRef)
    return (
        <ChatGridStyled ref={gridRef}>
            {
                messages.map(m => (<ChatBubble
                    key={m.id}
                    name={m.isUser ? "" : m.senderName }
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