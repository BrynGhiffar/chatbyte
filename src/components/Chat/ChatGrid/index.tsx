import styled from "styled-components";
import { commonCss } from "@/components/Palette";
import { useRef, MutableRefObject, useEffect, memo } from "react";
import ChatBubble from "../ChatBubble";
import { useSelectedContactMessages } from "@/store/AppStore/hooks";
import { Message } from "@/store/AppStore/type";
import { SC__ChatGrid } from "./styled";

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
        <SC__ChatGrid ref={gridRef}>
            {
                messages.map(m => (<ChatBubble
                    key={m.id}
                    messageId={m.id}
                    name={m.isUser ? "" : m.senderName }
                    message={m.content}
                    time={m.time}
                    side={m.isUser ? "right" : "left"}
                    receiverRead={m.receiverRead}
                    deleted={m.deleted}
                />))
            }
        </SC__ChatGrid>
    );
};

export default ChatGrid;