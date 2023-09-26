import { SetStateAction, createContext, Dispatch } from "react";


export type Contact = {
    type: "DIRECT" | "GROUP"
    uid: number;
    urlProfile: string;
    name: string;
};

export type ChatContactMessageItem = {
    id: number,
    name: string;
    time: string;
    message: string;
    unread_count: number;
};

export type ChatContactListState = {
    userId: number,
    username: string,
    searchInput: string;
    list: "message" | "contact";
    selectedContact: Contact | null;
    contacts: Contact[]
    contactMessages: ChatContactMessageItem[]
};

export type ChatListContextType = {
    state: ChatContactListState;
    setList: (list: "message" | "contact") => void;
    setState: Dispatch<SetStateAction<ChatContactListState>>;
};

export const InitialChatListState: ChatContactListState = {
    userId: 0,
    username: "",
    searchInput: "",
    list: "message",
    selectedContact: null,
    contacts: [],
    contactMessages: []
};

export const ChatListContext = createContext<ChatListContextType>({
    state: InitialChatListState,
    // selectContact: (uid: number) => {},
    setList: (list: "message" | "contact") => {},
    setState: () => {}
});
