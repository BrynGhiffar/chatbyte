import { useSelectedContactMessages } from "@/store/AppStore/hooks";
import { Message } from "@/store/AppStore/type";
import { MutableRefObject, useEffect, useRef } from "react";
import ChatBubble from "../ChatBubble";
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
                messages.map((m, i, arr) => {
                    const showProfile = (() => {
                        if (i === 0) return true;
                        if (arr[i].senderId !== arr[i - 1].senderId) return true;
                        return false;
                    })()
                    return (<ChatBubble
                        key={m.id}
                        messageId={m.id}
                        senderId={m.senderId}
                        name={m.isUser ? "" : m.senderName }
                        message={m.content}
                        time={m.time}
                        side={m.isUser ? "right" : "left"}
                        receiverRead={m.receiverRead}
                        deleted={m.deleted}
                        showProfilePicture={showProfile}
                        attachmentIds={m.attachmentIds}
                    />
                )})
            }
        </SC__ChatGrid>
    );
};

export default ChatGrid;