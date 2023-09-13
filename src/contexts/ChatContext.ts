import { Dispatch, SetStateAction, createContext } from "react";

export type Message = {
  id: number;
  content: string;
  sender: string;
  time: string;
  isUser: boolean;
  receiverRead: boolean;
};

export type ChatContext = {
  state: ChatState;
  // sendMessage: (message: string) => void;
  setState: Dispatch<SetStateAction<ChatState>>;
};

type ContactId = number;

export type ChatState = {
  messages: Map<ContactId, Message[]>,
};

export const InitialChatState: ChatState = {
  messages: new Map()
};


export const ChatContext = createContext<ChatContext>({
  state: InitialChatState,
  // sendMessage: (message: string) => {},
  setState: () => {}
});
