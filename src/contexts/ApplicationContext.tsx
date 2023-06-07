import { ContactService } from "@/service/api/ContactService";
import MessageService, { WebSocketIncomingMessage, WebSocketOutgoingMessage } from "@/service/api/MessageService";
import { LocalStorage } from "@/utility/LocalStorage";
import { FC, PropsWithChildren, createContext, useContext, useState } from "react";
import { useEffectOnce, useUpdateEffect } from "usehooks-ts";
import useWebSocket from "react-use-websocket";

type Message = {
  id: number;
  content: string;
  sender: string;
  time: string;
  isUser: boolean;
}

type ChatState = {
  messages: Message[]
}

type ChatContextType = {
  state: ChatState;
  sendMessage: (message: string) => void;
};

type Contact = {
  uid: number;
  urlProfile: string;
  name: string;
}

type ChatListState = {
  selectedContact: Contact | null;
  contacts: Contact[]
}

type ChatListContextType = {
  state: ChatListState;
  selectContact: (uid: number) => void;
}

const InitialChatState: ChatState = {
  messages: []
};

const InitialChatListState: ChatListState = {
  selectedContact: null,
  contacts: []
}

const ChatContext = createContext<ChatContextType>({
  state: InitialChatState,
  sendMessage: (message: string) => {},
});

const ChatListContext = createContext<ChatListContextType>({
  state: InitialChatListState,
  selectContact: (uid: number) => {}
});

type UserIdEmail = {
  uid: number,
  email: string
};

type ClientMessage = {
  id: number;
  receiverId: number;
  senderId: number;
  isUser: boolean;
  content: string;
  time: string;
};

export const ApplicationContext: FC<PropsWithChildren> = (props) => {
  // const { data: users, isLoading } = trpc.getUsers.useQuery();
  const users: UserIdEmail[] = [];
  // const messageMutation = trpc.getMessages.useMutation();
  // const sendMessageMutation = trpc.sendMessage.useMutation();
  const [chatState, setChatState ] = useState(InitialChatState);

  const { sendMessage: sendWsMessageRaw, lastMessage, readyState } = useWebSocket(`ws://localhost:8080/messagews?token=${LocalStorage.getLoginToken() ?? ""}`);

  const sendMessageWs = (receiverUid: number, message: string) => {
    console.log("Message sent");
    const req: WebSocketIncomingMessage = {
        type: "message",
        content: message,
        receiverUid: receiverUid,
    }
    sendWsMessageRaw(JSON.stringify(req));
  };


  useUpdateEffect(() => {
    // console.log("Message receied");
    // console.log(lastMessage?.data);
    if (!lastMessage?.data) return;
    const msgParse = WebSocketOutgoingMessage.safeParse(JSON.parse(lastMessage?.data));
    if (!msgParse.success) return;
    const newMessage: Message = {
      id: msgParse.data.id,
      content: msgParse.data.content,
      sender: "",
      time: msgParse.data.sentAt,
      isUser: msgParse.data.isUser
    };
    setChatState(s => ({ ...s, messages: [ ...s.messages, newMessage ]}))
  }, [lastMessage]);

  const sendMessage = (message: string) => {
    if (chatListState.selectedContact === null) return;
    const receiverUid = chatListState.selectedContact.uid;
    const date = new Date();
    const hour = date.getHours();
    const min = date.getMinutes();
    const randomId = Math.floor( Math.random() * 1_000_000 );
    const newMessage: Message = {
      id: randomId,
      content: message,
      sender: "user",
      time: `${hour}:${min}`,
      isUser: true
    };
    sendMessageWs(receiverUid, message);
  };

  const selectContact = async (uid: number) => {
    const contacts = chatListState.contacts.filter(c => c.uid === uid);
    if (contacts.length < 1) return;
    const contact = contacts[0];
    setChatListState(s => ({
      ...s,
      selectedContact: contact
    }));
    const token = LocalStorage.getLoginToken();
    if (!token) return;
    const response = await MessageService.getMessage(token, contact.uid);
    // console.log(response)
    if (!response.success) return;
    const messages: ClientMessage[] = response.payload;
    setChatState(s => ({
      ...s,
      messages: messages.map(m => ({
        id: m.id,
        content: m.content,
        isUser: m.isUser,
        sender: "",
        time: m.time
      }))
    }));
  };

  const [ chatListState, setChatListState ] = useState(InitialChatListState);
  useEffectOnce(() => {
    const run = async () => {
      const response = await ContactService.getContacts();
      if (!response.success) return;
      const contacts: Contact[] = response.payload.map(u => ({
        uid: u.id,
        name: u.email,
        urlProfile: ""
      }))
      setChatListState(s => ({...s, contacts }));
    };
    run();
  });


  return (
    <ChatListContext.Provider value={{ state: chatListState, selectContact }}>
      <ChatContext.Provider value={{ state: chatState, sendMessage }}>
        {props.children}
      </ChatContext.Provider>
    </ChatListContext.Provider>
  )
}

export const useChatContext = () => {
  return useContext(ChatContext);
};

export const useChatListContext = () => {
  return useContext(ChatListContext);
};