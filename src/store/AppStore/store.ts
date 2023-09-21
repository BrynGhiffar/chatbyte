import { create } from "zustand";
import { AppState, AppStateSet, Contact, ContactType, Conversation, GroupContact, GroupConversation, Message, Window } from "./type";
import { LocalStorage } from "@/utility/LocalStorage";
import { ContactService } from "@/service/api/ContactService";
import { UserService, avatarImageGroupUrl, avatarImageUrl } from "@/service/api/UserService";
import { GroupService } from "@/service/api/GroupService";
import { SendGroupMessage, SendMessage } from "../WebsocketMiddleware/type";
import { websocket } from "../WebsocketMiddleware/middleware";
import MessageService from "@/service/api/MessageService";
import { AuthService } from "@/service/api/AuthService";
import { devtools } from "zustand/middleware";
import { getUserToken, pushSnackbarError, pushSnackbarSuccess } from "./utility";



const setFetchInitialFailed = (set: AppStateSet) => set(s => ({...s, type: "ERROR_FETCHING_INITIAL_USER_DATA" }));

const setInitialData = (
    set: AppStateSet, 
    userId: number,
    username: string,
    contacts: Contact[],
    groupContacts: GroupContact[], 
    conversations: Conversation[], 
    groupConversations: GroupConversation[]
) => set(s => ({...s,
    type: "NORMAL",
    loggedInUserId: userId, 
    loggedInUsername: username,
    groupContacts,
    contacts,
    conversations,
    groupConversations
}));


export const useAppStore = create<AppState, [
    ['zustand/devtools', never],
    ['sendMessage', SendMessage],
    ['sendGroupMessage', SendGroupMessage],
]>(devtools(websocket((set, get, api) => ({
    type: "FETCHING_INITIAL_USER_DATA",
    snackbarMessage: [],
    loggedInUserId: 0,
    loggedInUsername: ""  ,
    chatlistSearch: "",
    groupContacts: [],
    contacts: [],
    groupConversations: [],
    conversations: [],
    windowStack: ["CHAT_WINDOW"],
    message: {},
    selectedContact: null,
    fetchInitialData: async () => {
        const token = await getUserToken(set);
        if (!token) {
            return;
        }
        const resContacts = await ContactService.getContacts(token);
        if (!resContacts.success) {
            pushSnackbarError(set, resContacts.message);
            setFetchInitialFailed(set);
            return;
        }
        const resConversations = await ContactService.getContactsRecent(token);
        if (!resConversations.success) {
            pushSnackbarError(set, resConversations.message);
            setFetchInitialFailed(set);
            return;
        }
        const resUserDetails = await UserService.getUserDetails(token);
        if (!resUserDetails.success) {
            pushSnackbarError(set, resUserDetails.message);
            setFetchInitialFailed(set);
            return;
        }
        const resGetGroups = await GroupService.getGroups(token);
        if (!resGetGroups.success) {
            pushSnackbarError(set, resGetGroups.message);
            setFetchInitialFailed(set);
            return;
        }
        
        const groupConversations: GroupConversation[] = resGetGroups.payload.map(c => ({
            type: "GROUP",
            id: c.id,
            name: c.name,
            urlProfile: avatarImageGroupUrl(c.id)(0), 
            lastMessageContent: "",
            lastMessageTime: "",
            unreadCount: 0
        }));

        const groupContacts: GroupContact[] = resGetGroups.payload.map(c => ({
            type: "GROUP",
            id: c.id,
            name: c.name,
            urlProfile: avatarImageGroupUrl(c.id)(0)
        }));

        const directContacts: Contact[] = resContacts.payload.map(c => ({
            type: "DIRECT",
            name: c.username,
            id: c.id,
            urlProfile: avatarImageUrl(c.id)(0)
        }));

        const conversations: Conversation[] = resConversations.payload.map(c => ({
            type: "DIRECT",
            id: c.contact_id,
            name: c.username,
            lastMessageTime: c.sent_at,
            lastMessageContent: c.content,
            unreadCount: c.unread_count,
        }));

        const { uid, username } = resUserDetails.payload;
        setInitialData(set, uid, username, directContacts, groupContacts, conversations, groupConversations);
    },
    selectContact: async (type: ContactType, id: number) => {
        const token = await getUserToken(set);
        if (!token) return;
        // const total = [...get().contacts, ...get().group]
        const allContacts = [...get().contacts, ...get().groupContacts];
        const contactIndex = allContacts.findIndex(c => {
            return c.type === type && c.id === id;
        });

        if (contactIndex === -1) {
            pushSnackbarError(set, "Contact not found");
            return;
        }
        const contact = allContacts[contactIndex];
        const contactKey = `${type}-${id}`;

        // fetching latest messages from the database
        // I feel like this is not good enough, better to offload
        // all initial data fetching to when application first loads.
        if (contact.type === "DIRECT") {
            const resRead = await MessageService.setMessagesRead(token, contact.id);
            if (!resRead.success) {
                pushSnackbarError(set, resRead.message);
                return;
            }
            if (get().message[contactKey] === undefined) {
                const resGetMessage = await MessageService.getMessage(token, contact.id);
                if (!resGetMessage.success) {
                    pushSnackbarError(set, resGetMessage.message);
                    return;
                }
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
            }
        } else {
            if (get().message[contactKey] === undefined) {
                const resGetGroupMessage = await GroupService.getGroupMessages(id, token);
                if (!resGetGroupMessage.success) {
                    pushSnackbarError(set, resGetGroupMessage.message);
                    return;
                }
                const messages = resGetGroupMessage.payload.map(m => ({
                    id: m.id,
                    receiverRead: false,
                    isUser: m.senderId === get().loggedInUserId,
                    senderName: "Other",
                    time: m.sentAt,
                    content: m.content
                }));
                const messageMapNew = structuredClone(get().message);
                messageMapNew[contactKey] = messages;
                set({ message: messageMapNew });
            }
        }

        // setting the number of unread messages in conversations to be zero.
        set(s => ({...s, selectedContact: contact, conversations: s.conversations.map(c => {
            if (c.type === type && c.id === id) {
                return { ...c, unreadCount: 0 };
            }
            return c;
        })}));

    },
    sendMessage: (message: string) => {
        const selectedContact = get().selectedContact;
        if (!selectedContact) return;
        if (selectedContact.type === "GROUP") {
            // supposed to be two different kinds of send message.
            api.sendGroupMessage(selectedContact.id, message);
        } else if (selectedContact.type === "DIRECT") {
            api.sendMessage(selectedContact.id, message);
        }
        return;
    },

    // Snackbar methods
    pushSnackbarSuccess: (message: string) => pushSnackbarSuccess(set, message),
    pushSnackbarError: (message: string) => pushSnackbarError(set, message),
    removeSnackbarMessage: (id: number) => {
        set(s => ({...s, snackbarMessage: s.snackbarMessage.filter(m => m.id !== id)}));
    },

    // Window methods
    pushWindow: (window: Window) => set(s => ({...s, windowStack: [...s.windowStack, window]})),
    popWindow: () => set(s => {
        const windowStack = s.windowStack;
        if (windowStack.length >= 2) {
            return ({...s, windowStack: windowStack.slice(0, windowStack.length - 1)})
        }
        return s;
    }),
    top: () => get().windowStack[get().windowStack.length - 1],

    onChangeChatListSearch: (search) => set(s => ({...s, chatlistSearch: search})),

}))));