import { LocalStorage } from "@/utility/LocalStorage";
import { AppState, AppStateGet, AppStateSet, Contact, Conversation, GroupContact, GroupConversation } from "./type";
import { AuthService } from "@/api/http/AuthService";
import { logError } from "@/utility/Logger";
import { GroupService } from "@/api/http/GroupService";
import { UserService, avatarImageGroupUrl, avatarImageUrl } from "@/api/http/UserService";
import { ContactService } from "@/api/http/ContactService";
import MessageService from "@/api/http/MessageService";
import AllThemes, { LightTheme } from "@/theme";

const setFetchInitialFailed = (set: AppStateSet) => set(s => ({...s, type: "ERROR_FETCHING_INITIAL_USER_DATA" }));

export const pushSnackbarError = (set: AppStateSet, message: string) => {
    const id = Math.floor(Math.random() * 1_000);
    set(s => ({...s, snackbarMessage: [...s.snackbarMessage, { id, message, type: "failure" }]}));
};

export const pushSnackbarSuccess = (set: AppStateSet, message: string) => {
    const id = Math.floor(Math.random() * 1_000);
    set(s => ({...s, snackbarMessage: [...s.snackbarMessage, { id, message, type: "success" }]}));
};

export const getUserToken = async (set: AppStateSet): Promise<string | null> => {
    const token = LocalStorage.getLoginToken();
    if (!token) { 
        pushSnackbarError(set, "Token is missing");
        set(s => ({...s, type: "MISSING_TOKEN" }));
        return null;
    }
    const res = await AuthService.validateToken(token);
    if (!res.success) {
        pushSnackbarError(set, "Token is invalid");
        set(s => ({...s, type: "INVALID_TOKEN" }));
        return null;
    }
    return token;
};

export const popWindow = (set: AppStateSet) => set(s => {
    const windowStack = s.windowStack;
    if (windowStack.length >= 2) {
        return ({...s, windowStack: windowStack.slice(0, windowStack.length - 1)})
    }
    return s;
});

export const fetchSetGroupContact = async (set: AppStateSet, token: string) => {
    const resGetGroups = await GroupService.getGroups(token);
    if (!resGetGroups.success) {
        pushSnackbarError(set, resGetGroups.message);
        return;
    }

    const groupContacts: GroupContact[] = resGetGroups.payload.map(c => ({
        type: "GROUP",
        id: c.id,
        name: c.name,
        urlProfile: avatarImageGroupUrl(c.id)(0)
    }));

    set({ groupContacts });
};

export const fetchSetGroupConversations = async (set: AppStateSet, token: string) => {
    const resGetGroupConv = await GroupService.getGroupsRecent(token);
    if (!resGetGroupConv.success) {
        pushSnackbarError(set, resGetGroupConv.message);
        return;
    }

    const groupConversations: GroupConversation[] = resGetGroupConv.payload.map(c => {

        if (c.detail) {
            return {
                type: "GROUP",
                id: c.groupId,
                name: c.groupName,
                urlProfile: avatarImageGroupUrl(c.groupId)(0), 
                lastMessageContent: `${c.detail.username}: ${c.detail.content}`,
                lastMessageTime: c.detail.sentAt,
                unreadCount: c.unreadMessage
            }
        }
        return {
            type: "GROUP",
            id: c.groupId,
            name: c.groupName,
            urlProfile: avatarImageGroupUrl(c.groupId)(0),
            lastMessageContent: "No messages.",
            lastMessageTime: "",
            unreadCount: c.unreadMessage
        }
    });

    set({ groupConversations });

}

export const fetchSetUserDetails = async (set: AppStateSet, token: string) => {
    const resUserDetails = await UserService.getUserDetails(token);
    if (!resUserDetails.success) {
        pushSnackbarError(set, resUserDetails.message);
        return;
    }
    const { uid, username } = resUserDetails.payload;
    set({ loggedInUserId: uid, loggedInUsername: username });
};

export const fetchSetDirectContacts = async (set: AppStateSet, token: string) => {
    const resContacts = await ContactService.getContacts(token);
    if (!resContacts.success) {
        pushSnackbarError(set, resContacts.message);
        return;
    }
    const directContacts: Contact[] = resContacts.payload.map(c => ({
        type: "DIRECT",
        name: c.username,
        id: c.id,
        urlProfile: avatarImageUrl(c.id)(0)
    }));
    set({ contacts: directContacts });
};

export const fetchSetDirectConversations = async (set: AppStateSet, token: string) => {
    const resConversations = await ContactService.getContactsRecent(token);
    if (!resConversations.success) {
        pushSnackbarError(set, resConversations.message);
        return;
    }
    const conversations: Conversation[] = resConversations.payload.map(c => ({
        type: "DIRECT",
        id: c.contact_id,
        name: c.username,
        lastMessageTime: c.sent_at,
        lastMessageContent: c.content,
        unreadCount: c.unread_count,
    }));
    set({ conversations });
}

export const fetchSetMessageRead = async (
    set: AppStateSet, 
    get: AppStateGet,
    token: string, 
    contact: Contact | GroupContact
) => {
    if (contact.type === "DIRECT") {
        const resRead = await MessageService.setMessagesRead(token, contact.id);
        if (!resRead.success) {
            pushSnackbarError(set, resRead.message);
            return;
        }
    } else if (contact.type === "GROUP") {
        const resGroupRead = await GroupService.updateReadMessage(token, contact.id);
        if (!resGroupRead.success) {
            logError(`There is an issue, when reading group messages: ${resGroupRead.message}`);
            pushSnackbarError(set, resGroupRead.message);
            return;
        }
    }
    const newConversations = get().conversations.map(c => {
        if (c.type === contact.type && c.id === contact.id) {
            return { ...c, unreadCount: 0 };
        }
        return c;
    });
    const newGroupConversations = get().groupConversations.map(c => {    
        if (c.type === contact.type && c.id === contact.id) {
            return { ...c, unreadCount: 0 };
        }
        return c;
    })
    set({ conversations: newConversations, groupConversations: newGroupConversations });
};

export const fetchSetDirectMessage = async (
    set: AppStateSet,
    get: AppStateGet, 
    token: string, 
    contact: Contact
) => {
    const resGetMessage = await MessageService.getMessage(token, contact.id);
    if (!resGetMessage.success) {
        pushSnackbarError(set, resGetMessage.message);
        return;
    }
    const contactKey = `${contact.type}-${contact.id}`;
    const messages = resGetMessage.payload.map(m => ({
        id: m.id,
        content: m.content,
        isUser: m.isUser,
        senderName: "",
        time: m.time,
        receiverRead: m.receiverRead
    }));
    const messageMapNew = structuredClone(get().message);
    messageMapNew[contactKey] = messages;
    set({ message: messageMapNew });
};

export const fetchSetGroupMessage = async (
    set: AppStateSet,
    get: AppStateGet,
    token: string,
    contact: GroupContact
) => {
    const resGetGroupMessage = await GroupService.getGroupMessages(contact.id, token);
    if (!resGetGroupMessage.success) {
        pushSnackbarError(set, resGetGroupMessage.message);
        return;
    }
    const contactKey = `${contact.type}-${contact.id}`;
    const messages = resGetGroupMessage.payload.map(m => ({
        id: m.id,
        receiverRead: false,
        isUser: m.senderId === get().loggedInUserId,
        senderName: m.username,
        time: m.sentAt,
        content: m.content
    }));
    const messageMapNew = structuredClone(get().message);
    messageMapNew[contactKey] = messages;
    set({ message: messageMapNew });
}

export const initializeTheme = (set: AppStateSet) => {
    const themeId = LocalStorage.getTheme();
    if (themeId === null) {
        set({ theme: LightTheme })
        LocalStorage.setTheme(LightTheme.id);
        return;
    }
    const theme = AllThemes.find(th => th.id === themeId);
    if (!theme) {
        set({ theme: LightTheme })
        LocalStorage.setTheme(LightTheme.id);
        return;    
    }
    set({ theme });
    return;
}