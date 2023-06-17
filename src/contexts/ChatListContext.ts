import { createContext } from "react";


export type Contact = {
  uid: number;
  urlProfile: string;
  name: string;
};

export type ChatListState = {
  selectedContact: Contact | null;
  contacts: Contact[]
};

export type ChatListContextType = {
  state: ChatListState;
  selectContact: (uid: number) => void;
};

export const InitialChatListState: ChatListState = {
  selectedContact: null,
  contacts: []
};

export const ChatListContext = createContext<ChatListContextType>({
  state: InitialChatListState,
  selectContact: (uid: number) => {}
});
