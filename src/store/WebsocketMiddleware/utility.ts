import { AppStateGet, AppStateSet, Contact, GroupContact } from "../AppStore/type";
import { WebSocketGroupMessageNotification, WebSocketMessageNotification } from "./type";

export const pushDirectMessageNotification = (
    set: AppStateSet, 
    get: AppStateGet,
    message: WebSocketMessageNotification,
    contact: Contact
) => {
    const messageMap = structuredClone(get().message);
    messageMap[`DIRECT-${contact.id}`].push({
        id: message.id,
        content: message.content,
        isUser: message.isUser,
        receiverRead: message.receiverRead,
        senderName: "",
        time: message.sentAt,
        deleted: false,
        edited: false,
    });
    set(s => ({...s, message: messageMap }));
};

export const pushGroupMessageNotification = (
    set: AppStateSet,
    get: AppStateGet,
    message: WebSocketGroupMessageNotification,
    contact: GroupContact
) => {
    const messageMap = structuredClone(get().message);
    messageMap[`GROUP-${message.groupId}`].push({
        id: message.id,
        content: message.content,
        isUser: get().loggedInUserId === message.senderId,
        receiverRead: false,
        senderName: message.username,
        time: message.sentAt,
        deleted: false,
        edited: false,
    });
    set({ message: messageMap });
}

export const isContactSelected = (
    get: AppStateGet,
    contact: Contact | GroupContact
) => {
    return get().selectedContact?.id === contact.id 
        && get().selectedContact?.type === contact.type;
}