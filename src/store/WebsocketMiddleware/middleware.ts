import { Endpoint, WebSocketEndpoint } from "@/service/api/Endpoint";
import { SendGroupMessage, SendMessage, WebSocketOutgoingMessage, WebsocketMiddleware, WebsocketMiddlewareImpl } from "./type";
import { Mutate, StoreApi } from 'zustand';
import { LocalStorage } from "@/utility/LocalStorage";
import { getUserToken, pushSnackbarError, pushSnackbarSuccess } from "../AppStore/utility";
import { AppState, AppStateSet, Conversation } from "../AppStore/type";
import { GetGroupMessageResponse, GroupService } from "@/service/api/GroupService";
import MessageService from "@/service/api/MessageService";
import { ContactService } from "@/service/api/ContactService";


const reduceMessage = async (set: AppStateSet, get: () => AppState, message: WebSocketOutgoingMessage) => {
    switch (message.type) {
        case "ERROR_NOTIFICATION": {
            pushSnackbarError(set, message.message);
            break;
        }
        case "GROUP_MESSAGE_NOTIFICATION": {
            const token = await getUserToken(set);
            if (!token) {
                return;
            }
            const messageMap = structuredClone(get().message);
            const groupMessages = messageMap[`GROUP-${message.groupId}`];
            if (groupMessages === undefined) {
                const resGetGroupMessage = await GroupService.getGroupMessages(message.groupId, token);
                if (!resGetGroupMessage.success) 
                    return pushSnackbarSuccess(set, resGetGroupMessage.message);
                messageMap[`GROUP-${message.groupId}`] = resGetGroupMessage.payload.map(m => ({
                    id: m.id,
                    receiverRead: false,
                    isUser: m.senderId === get().loggedInUserId,
                    senderName: "Other",
                    time: m.sentAt,
                    content: m.content
                }));
            } else {
                messageMap[`GROUP-${message.groupId}`].push({
                    id: message.id,
                    content: message.content,
                    isUser: get().loggedInUserId === message.senderId,
                    receiverRead: false,
                    senderName: "Other",
                    time: message.sentAt
                });
            }
            set(s => ({...s, message: messageMap }));
            break;
        }
        case "MESSAGE_NOTIFICATION": {
            const token = await getUserToken(set);
            if (!token) {
                return;
            }
            const contactId = message.isUser ? message.receiverUid : message.senderUid;
            const messageMap = structuredClone(get().message);
            const directMessages = messageMap[`DIRECT-${contactId}`];
            if (directMessages === undefined) {
                const resGetMessage = await MessageService.getMessage(token, contactId);
                if (!resGetMessage.success) 
                    return pushSnackbarSuccess(set, resGetMessage.message);
                messageMap[`DIRECT-${contactId}`] = resGetMessage.payload.map(m => ({
                    id: m.id,
                    receiverRead: message.receiverRead,
                    isUser: m.isUser,
                    senderName: "",
                    time: m.time,
                    content: m.content
                }));
            } else {
                messageMap[`DIRECT-${contactId}`].push({
                    id: message.id,
                    content: message.content,
                    isUser: message.isUser,
                    receiverRead: message.receiverRead,
                    senderName: "",
                    time: message.sentAt
                });
            }
            set(s => ({...s, message: messageMap }));
            if (get().selectedContact?.id === contactId && get().selectedContact?.type === "DIRECT") {
                const resRead = await MessageService.setMessagesRead(token, contactId);
                if (!resRead.success) { return pushSnackbarError(set, resRead.message); }
            }
            const resRecent = await ContactService.getContactsRecent(token);
            if (!resRecent.success) return pushSnackbarError(set, resRecent.message);
            const conversations: Conversation[] = resRecent.payload.map(c => ({
                id: c.contact_id,
                lastMessageContent: c.content,
                lastMessageTime: c.sent_at,
                name: c.username,
                type:"DIRECT",
                unreadCount: c.unread_count
            }));
            set(s => ({...s, conversations}));
            break;
        }
        case "READ_NOTIFICATION": {
            const token = await getUserToken(set);
            if (!token) { return }
            const contactId = get().loggedInUserId === message.senderUid ? message.receiverUid : message.senderUid;
            const messageMap = structuredClone(get().message);
            const directMessages = messageMap[`DIRECT-${contactId}`];
            if (directMessages === undefined) { break; }
            messageMap[`DIRECT-${contactId}`] = directMessages.map(m => m.isUser ? ({...m, receiverRead: true}) : m);
            set(s => ({...s, message: messageMap}));
            break;
        }
        default:
            break
    }


}

const websocketImpl: WebsocketMiddlewareImpl = (f) => (set, get, _store) => {
    type T = ReturnType<typeof f>;
    const token = LocalStorage.getLoginToken();
    const store = _store as Mutate<StoreApi<T>, [
        ['sendMessage', SendMessage],
        ['sendGroupMessage', SendGroupMessage]
    ]>;


    if (!token) {
        set(s => ({...s, type: "MISSING_TOKEN"}));
        store.sendMessage = (receiverId: number, message: string) => {};
        store
        return f(set, get, _store);
    }
    const wsConn = new WebSocket(`${WebSocketEndpoint()}${Endpoint.webSocket(token)}`);
    store.sendMessage = (receiverId: number, message: string) => {
        wsConn.send(JSON.stringify({
            type: "SEND_MESSAGE",
            receiverUid: receiverId,
            message
        }));
    };
    store.sendGroupMessage = (groupId: number, message: string) => {
        wsConn.send(JSON.stringify({
            type: "SEND_GROUP_MESSAGE",
            groupId,
            message
        }));
    };
    wsConn.onmessage = async (evt) => {
        const data = JSON.parse(evt.data);
        const resParse = WebSocketOutgoingMessage.safeParse(data);
        if (!resParse.success) { 
            pushSnackbarError(set, "Error parsing data");
            return;
        }
        const message = resParse.data;
        reduceMessage(set, get, message);
    };
    // store.sendMessage = ;
    return f(set, get, _store);
}

export const websocket = websocketImpl as unknown as WebsocketMiddleware;