import { createContext } from "react";

export type Message = {
  id: number;
  content: string;
  sender: string;
  time: string;
  isUser: boolean;
};


export type ChatContextType = {
  state: ChatState;
  sendMessage: (message: string) => void;
};


export type ChatState = {
  messages: Message[]
};

export const InitialChatState: ChatState = {
  messages: []
};


export const ChatContext = createContext<ChatContextType>({
  state: InitialChatState,
  sendMessage: (message: string) => {},
});
