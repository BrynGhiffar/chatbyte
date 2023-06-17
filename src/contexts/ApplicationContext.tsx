import { ContactService } from "@/service/api/ContactService";
import MessageService, { WebSocketIncomingMessage, WebSocketOutgoingMessage } from "@/service/api/MessageService";
import { LocalStorage } from "@/utility/LocalStorage";
import { FC, PropsWithChildren, createContext, useContext, useState } from "react";
import { useEffectOnce, useUpdateEffect } from "usehooks-ts";
import useWebSocket from "react-use-websocket";
import { useNavigate } from "react-router-dom";
import { ChatContext, InitialChatState, Message } from "./ChatContext";
import { ChatListContext, Contact, InitialChatListState } from "./ChatListContext";
import { useToken } from "@/utility/UtilityHooks";

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
  const [chatState, setChatState ] = useState(InitialChatState);
  const { sendMessage: sendWsMessageRaw, lastMessage, readyState } = useWebSocket(`ws://localhost:8080/api/message/ws?token=${LocalStorage.getLoginToken() ?? ""}`);
  const token = useToken();

  const sendMessageWs = (receiverUid: number, message: string) => {
    console.log("Message sent");
    const req: WebSocketIncomingMessage = {
        // type: "message",
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
      const response = await ContactService.getContacts(token);
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
