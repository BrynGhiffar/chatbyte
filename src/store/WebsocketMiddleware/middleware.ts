import { showBrowserNotification } from "@/api/browser/BrowserNotification";
import { Endpoint, WebSocketEndpoint } from "@/api/http/Endpoint";
import { logDebug, logError } from "@/utility/Logger";
import { AppState, AppStateGet, AppStateSet } from "../AppStore/type";
import { fetchSetDirectConversations, fetchSetGroupConversations, fetchSetMessageRead, getUserToken, pushSnackbarError } from "../AppStore/utility";
import { StoreType, WebSocketOutgoingMessage, WebsocketMiddleware, WebsocketMiddlewareImpl, WebsocketMiddlewareType } from "./type";
import { isContactSelected, pushDirectMessageNotification, pushGroupMessageNotification } from "./utility";

const reduceMessage = async (
    set: AppStateSet, 
    get: () => AppState, 
    websocket: WebsocketMiddlewareType,
    message: WebSocketOutgoingMessage,
) => {
    const token = await getUserToken(set);
    if (!token) { return; }
    switch (message.type) {
        case "ERROR_NOTIFICATION": {
            pushSnackbarError(set, message.message);
            break;
        }
        case "GROUP_MESSAGE_NOTIFICATION": {

            const groupContact = get()
                .groupContacts
                .find(gc => gc.id === message.groupId && gc.type === "GROUP");
            if (!groupContact) {
                logError("Contact not found when websocket GROUP_MESSAGE_NOTIFICATION received");
                return pushSnackbarError(set, '[Websocket] Contact not found');
            }
            if (!isContactSelected(get, groupContact) && get().loggedInUserId !== message.senderId) {
                showBrowserNotification(groupContact.name, `${message.username}: ${message.content}`);
            }
            pushGroupMessageNotification(set, get, message, groupContact);
            if (isContactSelected(get, groupContact)) {
                logDebug("read message group");
                await fetchSetMessageRead(set, get, websocket, token, groupContact);

            }
            await fetchSetGroupConversations(set, token);
            break;
        }
        case "MESSAGE_NOTIFICATION": {
            const token = await getUserToken(set);
            if (!token) { return; }
            const contactId = message.isUser ? message.receiverUid : message.senderUid;
            const contact = get().contacts.find(c => c.id === contactId && c.type === "DIRECT");
            if (!contact) { 
                logError("Contact not found when websocket MESSAGE_NOTIFICATION received");
                return pushSnackbarError(set, "[Websocket] Contact not found");
            }
            pushDirectMessageNotification(set, get, message, contact);
            if (!isContactSelected(get, contact) && get().loggedInUserId !== message.senderUid) {
                showBrowserNotification(contact.name, message.content);
            }
            if (isContactSelected(get, contact)) {
                await fetchSetMessageRead(set, get, websocket, token, contact);
            }
            await fetchSetDirectConversations(set, token);
            break;
        }
        case "READ_NOTIFICATION": {
            const contactId = get().loggedInUserId === message.senderUid ? message.receiverUid : message.senderUid;
            const messageMap = structuredClone(get().message);
            const directMessages = messageMap[`DIRECT-${contactId}`];
            if (directMessages === undefined) { break; }
            messageMap[`DIRECT-${contactId}`] = directMessages.map(m => m.isUser ? ({...m, receiverRead: true }) : m);
            set(s => ({...s, message: messageMap}));
            break;
        }
        case "DELETE_DIRECT_MESSAGE_NOTIFICATION": {
            const messageMap = structuredClone(get().message);
            const directMessages = messageMap[`DIRECT-${message.contactId}`];
            if (!directMessages) { break; };
            messageMap[`DIRECT-${message.contactId}`] = directMessages.map(m => {
                if (m.id === message.messageId) {
                    return ({...m, deleted: true, content: "", attachmentIds: [] })
                }
                return m;
            });
            set({ message: messageMap });
            await fetchSetDirectConversations(set, token);
            break;
        }
        case "DELETE_GROUP_MESSAGE_NOTIFICATION": {
            const messageMap = structuredClone(get().message);
            const messages = messageMap[`GROUP-${message.groupId}`];
            if (!messages) { break; };
            messageMap[`GROUP-${message.groupId}`] = messages.map(m => {
                if (m.id === message.messageId) {
                    return ({...m, deleted: true, content: "", attachmentIds: [] })
                }
                return m;
            });
            set({ message: messageMap });
            await fetchSetGroupConversations(set, token);
            break;
        }
        case "UPDATE_DIRECT_MESSAGE_NOTIFICATION": {
            const messageMap = structuredClone(get().message);
            const messages = messageMap[`DIRECT-${message.contactId}`]
            if (!messages) { break; }
            messageMap[`DIRECT-${message.contactId}`] = messages.map(m => {
                if (m.id === message.messageId) {
                    return ({ ...m, content: message.content, edited: true });
                }
                return m;
            });
            set({ message: messageMap });
            await fetchSetDirectConversations(set, token);
            break;
        }
        case "UPDATE_GROUP_MESSAGE_NOTIFICATION": {
            const messageMap = structuredClone(get().message);
            const messages = messageMap[`GROUP-${message.groupId}`];
            if (!messages) { break; }
            messageMap[`GROUP-${message.groupId}`] = messages.map(m => {
                if (m.id === message.messageId) {
                    return ({ ...m, content: message.content, edited: true });
                }
                return m;
            });
            set({ message: messageMap });
            await fetchSetGroupConversations(set, token);
            break;
        }
        default:
            break
    }


}

const connect = (set: AppStateSet, get: AppStateGet, token: string, store: StoreType) => {
    const wsConn = new WebSocket(`${WebSocketEndpoint()}${Endpoint.webSocket(token)}`);
    store.websocket.readDirectMessage = (receiverId) => {
        wsConn.send(JSON.stringify({
            type: "READ_DIRECT_MESSAGE",
            receiverUid: receiverId
        }));
    }
    store.websocket.readGroupMessage = (groupId) => {
        wsConn.send(JSON.stringify({
            type: "READ_GROUP_MESSAGE",
            groupId
        }));
    }
    store.websocket.sendMessage = (receiverId: number, message: string, attachments) => {
        const attReq = attachments.map(at => ({ name: `f-${at.id}`, contentBase64: at.file.split(",")[1] }));
        wsConn.send(JSON.stringify({
            type: "SEND_MESSAGE",
            receiverUid: receiverId,
            message,
            attachments: attReq
        }));
    };
    store.websocket.sendGroupMessage = (groupId: number, message: string, attachments) => {
        const attReq = attachments.map(at => ({ name: `f-${at.id}`, contentBase64: at.file.split(",")[1] }));
        wsConn.send(JSON.stringify({
            type: "SEND_GROUP_MESSAGE",
            groupId,
            message,
            attachments: attReq
        }));
    };
    store.websocket.editDirectMessage = (messageId: number, editedMessage: string) => {
        wsConn.send(JSON.stringify({
            type: "EDIT_DIRECT_MESSAGE",
            messageId,
            editedContent: editedMessage
        }))
    };
    store.websocket.editGroupMessage = (messageId, editedMessage) => {
        wsConn.send(JSON.stringify({
            type: "EDIT_GROUP_MESSAGE",
            messageId,
            editedContent: editedMessage
        }))
    };
    store.websocket.deleteMessage = (messageId: number) => {
        wsConn.send(JSON.stringify({
            type: "DELETE_DIRECT_MESSAGE",
            messageId
        }));
    }
    store.websocket.deleteGroupMessage = (messageId) => {
        wsConn.send(JSON.stringify({
            type: "DELETE_GROUP_MESSAGE",
            messageId
        }))
    }
    wsConn.onopen = () => {
    }
    wsConn.onmessage = async (evt) => {
        const data = JSON.parse(evt.data);
        const resParse = WebSocketOutgoingMessage.safeParse(data);
        if (!resParse.success) { 
            pushSnackbarError(set, "Error parsing data");
            return;
        }
        const message = resParse.data;
        await reduceMessage(set, get, store.websocket, message);
    };
    wsConn.onclose = () => {
    };
    store.websocket.wsDisconnect = () => {
        wsConn.close();
    }
};

const websocketImpl: WebsocketMiddlewareImpl = (f) => (set, get, _store) => {

    const store = _store as StoreType;
    store.websocket = {
        readDirectMessage: (receiverId) => {},
        readGroupMessage: (groupId) => {},
        sendGroupMessage: (groupId, message) => {},
        sendMessage: (receiverId, message) => {},
        wsDisconnect: () => {},
        wsConnect: (set, get, token) => {},
        editDirectMessage: (messageId, editedMessage) => {},
        editGroupMessage: (messageId, editedMessage) => {},
        deleteMessage: (messageId) => {},
        deleteGroupMessage: (messageId) => {}
    };
    store.websocket.wsConnect = (set: AppStateSet, get: AppStateGet, token: string) => connect(set, get, token, store);
    // store.sendMessage = ;
    return f(set, get, _store);
}

export const websocket = websocketImpl as unknown as WebsocketMiddleware;