import { useToken } from "@/utility/UtilityHooks";
import { useContext, useState } from "react";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import { useUpdateEffect } from "usehooks-ts";
import { z } from "zod";
import { Endpoint, WebSocketEndpoint } from "../api/Endpoint";
import { SnackbarContext } from "@/components/common/Snackbar";

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

const useRawDataWebSocket = () => {
    const token = useToken();
    const ept = `${WebSocketEndpoint()}${Endpoint.messageWebSocket(token)}`;
    const { sendMessage: sendMessageRaw, lastMessage: lastMessageRaw } = useWebSocket(ept);
    return { sendMessageRaw, lastMessageRaw };
}

export const useSocket = () => {
    const { sendMessageRaw, lastMessageRaw } = useRawDataWebSocket();
    const { push: pushError } = useContext(SnackbarContext);
    const [ lastMessageSocket, setLastMessage ] = useState<WebSocketOutgoingMessage>({ type: "empty" })

    useUpdateEffect(() => {
        if (!lastMessageRaw?.data) return;
        const lastMessageJson = JSON.parse(lastMessageRaw?.data);
        const parseLastMessageRaw = WebSocketMessageNotification.safeParse(lastMessageJson);
        if (parseLastMessageRaw.success) {
            return setLastMessage(_ => ({ type: "message_notification", payload: parseLastMessageRaw.data }))
        } else {
            pushError("There was an issue parsing a message notification");
        }
        return setLastMessage(_ => ({type: "error", message: "A parsing error occured"}));
    }, [lastMessageRaw]);

    const sendMessageSocket = (message: WebSocketIncomingMessage) => sendMessageRaw(JSON.stringify(message));
    return { sendMessageSocket, lastMessageSocket };
};