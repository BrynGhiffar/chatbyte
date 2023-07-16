import { useToken } from "@/utility/UtilityHooks";
import { useState } from "react";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import { useUpdateEffect } from "usehooks-ts";
import { z } from "zod";

export const WebSocketIncomingMessage = z.object({
    // type: z.literal("message"),
    content: z.string(),
    receiverUid: z.number(),
});

export type WebSocketIncomingMessage = z.infer<typeof WebSocketIncomingMessage>;

export const WebSocketMessageNotification = z.object({
    id: z.number(),
    senderUid: z.number(),
    receiverUid: z.number(),
    content: z.string(),
    sentAt: z.string(),
    isUser: z.boolean(),
});

export const WebSocketOutgoingMessage = z.object({
    type: z.literal("message_notification"),
    payload: WebSocketMessageNotification
}).or(z.object({
    type: z.literal("empty")
})).or(z.object({
    type: z.literal("error"),
    message: z.string()
}));

export type WebSocketOutgoingMessage = z.infer<typeof WebSocketOutgoingMessage>;

export const useSocket = () => {
    const token = useToken();
    const { sendMessage: sendMessageRaw, lastMessage: lastMessageRaw } = useWebSocket(`ws://localhost:8080/api/message/ws?token=${token}`);
    const [ lastMessageSocket, setLastMessage ] = useState<WebSocketOutgoingMessage>({ type: "empty" })
    useUpdateEffect(() => {
        if (!lastMessageRaw?.data) return;
        const lastMessageJson = JSON.parse(lastMessageRaw?.data);
        const parseLastMessageRaw = WebSocketMessageNotification.safeParse(lastMessageJson);
        if (parseLastMessageRaw.success) {
            console.log("Received message notification");
            return setLastMessage(_ => ({ type: "message_notification", payload: parseLastMessageRaw.data }))
        } else {
            console.log(parseLastMessageRaw.error);
        }
        return setLastMessage(_ => ({type: "error", message: "A parsing error occured"}));
    }, [lastMessageRaw])
    const sendMessageSocket = (message: WebSocketIncomingMessage) => sendMessageRaw(JSON.stringify(message));
    return { sendMessageSocket, lastMessageSocket };
};