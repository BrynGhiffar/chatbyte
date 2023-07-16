import { createContext } from "react";


export type Contact = {
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
    list: "message" | "contact";
    selectedContact: Contact | null;
    contacts: Contact[]
    contactMessages: ChatContactMessageItem[]
};

export type ChatListContextType = {
    state: ChatContactListState;
    selectContact: (uid: number) => void;
    setList: (list: "message" | "contact") => void;
};

const DummyContactMessages = [
    {
        id: 1,
        name: "Jackoo",
        time: "11:02",
        message: "Wat the hell",
        unread_count: 5,
    },
    {
        id: 1,
        name: "Catalina",
        time: "23:59",
        message: "Wassup!",
        unread_count: 10,
    },
    {
        id: 1,
        name: "Catalina",
        time: "23:59",
        message: "Wassup!",
        unread_count: 0,
    },
];

export const InitialChatListState: ChatContactListState = {
    list: "message",
    selectedContact: null,
    contacts: [],
    contactMessages: []
};

export const ChatListContext = createContext<ChatListContextType>({
    state: InitialChatListState,
    selectContact: (uid: number) => {},
    setList: (list: "message" | "contact") => {}
});
