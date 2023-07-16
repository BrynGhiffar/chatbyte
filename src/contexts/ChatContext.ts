import { createContext } from "react";

export type Message = {
  id: number;
  content: string;
  sender: string;
  time: string;
  isUser: boolean;
};

export type ChatContext = {
  state: ChatState;
  sendMessage: (message: string) => void;
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
  sendMessage: (message: string) => {},
});
