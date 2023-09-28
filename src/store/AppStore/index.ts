import { create } from "zustand";
import { AppState, AppStateSet, AppStateState, Contact, ContactType, Conversation, GroupContact, GroupConversation, Message, Window } from "./type";
import { WebSocketMiddlewareMethods } from "../WebsocketMiddleware/type";
import { websocket } from "../WebsocketMiddleware/middleware";
import { devtools } from "zustand/middleware";
import { fetchSetDirectContacts, fetchSetDirectConversations, fetchSetDirectMessage, fetchSetGroupContact, fetchSetGroupConversations, fetchSetGroupMessage, fetchSetMessageRead, fetchSetUserDetails, getUserToken, initializeTheme, popWindow, pushSnackbarError, pushSnackbarSuccess } from "./utility";
import { GroupService } from "@/api/http/GroupService";
import AllThemes, { LightTheme } from "@/theme";
import { ThemeId } from "@/theme/type";
import { LocalStorage } from "@/utility/LocalStorage";

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

const initialState: AppStateState = {
    type: "FETCHING_INITIAL_USER_DATA",
    snackbarMessage: [],
    loggedInUserId: 0,
    loggedInUsername: ""  ,
    chatlistSearch: "",
    groupContacts: [],
    contacts: [],
    groupConversations: [],
    conversations: [],
    windowStack: [ { type: "CHAT_WINDOW" } ],
    message: {},
    selectedContact: null,
    theme: LightTheme
}

const useAppStore = create<AppState, [
    ['zustand/devtools', never],
    ...WebSocketMiddlewareMethods
]>(devtools(websocket((set, get, api) => ({
    ...initialState,
    fetchInitialData: async () => {
        set({ ...initialState });
        initializeTheme(set);
        const token = await getUserToken(set);
        if (!token) {
            return;
        }
        api.websocket.wsDisconnect();
        api.websocket.wsConnect(set, get, token);
        // Error handling needs to be added here.
        await Promise.all([
            fetchSetGroupContact(set, token),
            fetchSetGroupConversations(set, token),
            fetchSetUserDetails(set, token),
            fetchSetDirectContacts(set, token),
            fetchSetDirectConversations(set, token),
        ]);
        await Promise.all(get().contacts
            .map(contact => fetchSetDirectMessage(set, get, token, contact)));
        await Promise.all(get().groupContacts
            .map(group => fetchSetGroupMessage(set, get, token, group)));
        set({ type: "NORMAL" });
    },
    selectContact: async (type: ContactType, id: number) => {
        const token = await getUserToken(set);
        if (!token) return;
        const allContacts = [...get().contacts, ...get().groupContacts];
        const contactIndex = allContacts
            .findIndex(c => c.type === type && c.id === id);
        const contactExist = contactIndex !== -1;
        if (!contactExist) {
            pushSnackbarError(set, "Contact not found");
            return;
        }
        const contact = allContacts[contactIndex];
        fetchSetMessageRead(set, get, token, contact);
        set({ selectedContact: contact });
    },
    sendMessage: (message: string) => {
        const selectedContact = get().selectedContact;
        if (!selectedContact) return;
        if (selectedContact.type === "GROUP") {
            // supposed to be two different kinds of send message.
            api.websocket.sendGroupMessage(selectedContact.id, message);
        } else if (selectedContact.type === "DIRECT") {
            api.websocket.sendMessage(selectedContact.id, message);
        }
        return;
    },
    deleteMessage: (messageId: number) => {
        if (get().selectedContact?.type === "DIRECT") {
            api.websocket.deleteMessage(messageId);
        } else {
            api.websocket.deleteGroupMessage(messageId);
        }
    },
    createChatGroup: async (name: string, members: number[], profilePicture: File | null) => {
        const token = await getUserToken(set);
        if (!token) { return; }
        const resCreateGroup = await GroupService.createGroup(token, name, members, profilePicture);
        if (resCreateGroup.success) {
            pushSnackbarSuccess(set, resCreateGroup.payload);
            await fetchSetGroupContact(set, token);
            await fetchSetGroupConversations(set, token);
            await Promise.all(get().groupContacts
                .map(group => fetchSetGroupMessage(set, get, token, group)));
            popWindow(set);
        } else {
            pushSnackbarError(set, resCreateGroup.message);
        }
    },
    // Snackbar methods
    pushSnackbarSuccess: (message: string) => pushSnackbarSuccess(set, message),
    pushSnackbarError: (message: string) => pushSnackbarError(set, message),
    removeSnackbarMessage: (id: number) => {
        set(s => ({...s, snackbarMessage: s.snackbarMessage.filter(m => m.id !== id)}));
    },

    // Window methods
    pushWindow: (window: Window) => set(s => ({...s, windowStack: [...s.windowStack, window]})),
    popWindow: () => popWindow(set),
    top: () => get().windowStack[get().windowStack.length - 1],

    onChangeChatListSearch: (search) => set(s => ({...s, chatlistSearch: search})),

    // Themes
    setTheme: (themeId: ThemeId) => {
        const theme = AllThemes.find(th => th.id === themeId);
        if (!theme) return;
        LocalStorage.setTheme(themeId);
        set({ theme });
    }

}))));

export default useAppStore;