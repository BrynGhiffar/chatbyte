import { SendGroupMessage, SendMessage, StoreType, WebSocketOutgoingMessage, WebsocketMiddleware, WebsocketMiddlewareImpl } from "./type";
import { LocalStorage } from "@/utility/LocalStorage";
import { fetchSetDirectConversations, fetchSetGroupConversations, fetchSetMessageRead, getUserToken, pushSnackbarError, pushSnackbarSuccess } from "../AppStore/utility";
import { AppState, AppStateGet, AppStateSet, Conversation } from "../AppStore/type";
import { logDebug, logError } from "@/utility/Logger";
import { isContactSelected, pushDirectMessageNotification, pushGroupMessageNotification } from "./utility";
import { Endpoint, WebSocketEndpoint } from "@/api/http/Endpoint";
import { showBrowserNotification } from "@/api/browser/BrowserNotification";

const reduceMessage = async (set: AppStateSet, get: () => AppState, message: WebSocketOutgoingMessage) => {
    switch (message.type) {
        case "ERROR_NOTIFICATION": {
            pushSnackbarError(set, message.message);
            break;
        }
        case "GROUP_MESSAGE_NOTIFICATION": {
            const token = await getUserToken(set);
            if (!token) { break; }
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
                await fetchSetMessageRead(set, get, token, groupContact);

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
                await fetchSetMessageRead(set, get, token, contact);
            }
            await fetchSetDirectConversations(set, token);
            break;
        }
        case "READ_NOTIFICATION": {
            const token = await getUserToken(set);
            if (!token) { return }
            const contactId = get().loggedInUserId === message.senderUid ? message.receiverUid : message.senderUid;
            const messageMap = structuredClone(get().message);
            const directMessages = messageMap[`DIRECT-${contactId}`];
            if (directMessages === undefined) { break; }
            messageMap[`DIRECT-${contactId}`] = directMessages.map(m => m.isUser ? ({...m, receiverRead: true }) : m);
            set(s => ({...s, message: messageMap}));
            break;
        }
        default:
            break
    }


}

const connect = (set: AppStateSet, get: AppStateGet, token: string, store: StoreType) => {
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
        await reduceMessage(set, get, message);
    };
    wsConn.onclose = () => {
    };
    store.wsDisconnect = () => {
        wsConn.close();
    }
};

const websocketImpl: WebsocketMiddlewareImpl = (f) => (set, get, _store) => {

    const store = _store as StoreType;
    store.sendGroupMessage = (groupId, message) => {};
    store.sendMessage = (receiverId, message) => {};
    store.wsConnect = (set, get, token) => {};
    store.wsDisconnect = () => {};
    store.wsConnect = (set: AppStateSet, get: AppStateGet, token: string) => connect(set, get, token, store);
    // store.sendMessage = ;
    return f(set, get, _store);
}

export const websocket = websocketImpl as unknown as WebsocketMiddleware;