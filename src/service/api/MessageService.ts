import { z } from "zod";
import { useCallback, useEffect, useRef } from "react";
import { useEffectOnce } from "usehooks-ts";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";

const GetMessageResponse = z.object({
    success: z.literal(true),
    payload: z.array(
        z.object({
            id: z.number(),
            receiverId: z.number(),
            senderId: z.number(),
            isUser: z.boolean(),
            content: z.string(),
            time: z.string()
        })
    )
})
.or(z.object({
    success: z.literal(false),
    message: z.string()
}));


type GetMessageResponse = z.infer<typeof GetMessageResponse>;

const getMessage = async (token: string, receiverUid: number): Promise<GetMessageResponse> => {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${token}`);
    
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
    };
    
    const res = await fetch(`http://localhost:8080/api/message?receiverUid=${receiverUid}`, requestOptions);
    const json = await res.json();
    const parsedJson = GetMessageResponse.safeParse(json);
    if (!parsedJson.success) {
        // console.log(parsedJson.error)
        return ({
            success: false,
            message: "? Failed parsing schema"
        });
    }

    return parsedJson.data;
};
export const WebSocketIncomingMessage = z.object({
    type: z.literal("message"),
    content: z.string(),
    receiverUid: z.number(),
});

export type WebSocketIncomingMessage = z.infer<typeof WebSocketIncomingMessage>;

export const WebSocketOutgoingMessage = z.object({
    type: z.literal("message_notification"),
    id: z.number(),
    senderUid: z.number(),
    receiverUid: z.number(),
    content: z.string(),
    sentAt: z.string(),
    isUser: z.boolean(),
});

export type WebSocketOutgoingMessage = z.infer<typeof WebSocketOutgoingMessage>;

type useWsMessageParams = {
    token: string;
    onOpen?: () => void;
    onMessage?: (message: WebSocketOutgoingMessage) => void;
    onClose?: () => void;
};

// const useWsMessage = (params: useWsMessageParams) => {
//     // const ws = useRef(new WebSocket(`ws://localhost:8080/messagews?token=${params.token}`));
//     const { sendMessage: sendWsMessage, lastMessage, readyState } = useWebSocket(`ws://localhost:8080/messagews?token=${params.token}`);
//     const onOpen = useCallback(
//         () => {
//             if (!params.onOpen) return;
//             params.onOpen();
//         },
//         [params]
//     );
//     const onMessageReceived = useCallback(
//         (msg: MessageEvent<string>) => {
//             console.log("message received");
//             const jsond = JSON.parse(msg.data);
//             const parseMsg = WebSocketOutgoingMessage.safeParse(jsond);
//             if (!parseMsg.success) {
//                 console.log("Failed to parse message");
//                 return;
//             }
//             const message = parseMsg.data;
//             if (!params.onMessage) return;
//             params.onMessage(message);
//         },
//         [params]
//     );

//     const onMessageReceivedTest = (msg: MessageEvent<any>) => {
//         console.log(msg);
//     };
//     const onClose = useCallback(
//         () => {
//             if (!params.onClose) return;
//             params.onClose();
//         },
//         [params]
//     );
//     const onError = useCallback(() => {
//         console.log("An error occurred");
//     }, []);
//     useEffectOnce(() => {
//         ws.current.addEventListener('open', onOpen);
//         ws.current.addEventListener('message', onMessageReceived);
//         // ws.current.onmessage = onMessageReceivedTest;
//         ws.current.addEventListener('error', onError);
//         ws.current.addEventListener('close', onClose);

//         return () => {
//             ws.current.removeEventListener('open', onOpen);
//             ws.current.removeEventListener('message', onMessageReceived);
//             ws.current.removeEventListener('error', onError);            
//             ws.current.removeEventListener('close', onClose);
//         }
//     });

//     const sendMessage = useCallback(
//         (receiverUid: number, msg: string) => {
//             console.log("Message sent");
//             const req: WebSocketIncomingMessage = {
//                 type: "message",
//                 content: msg,
//                 receiverUid: receiverUid,
//             }
//             ws.current.send(JSON.stringify(req));
//         },
//         []
//     );

//     return { sendMessage };
// };

const MessageService = {
    getMessage,
    // useWsMessage
};

export default MessageService;