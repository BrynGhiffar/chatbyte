import { ContactService } from "@/service/api/ContactService";
import MessageService from "@/service/api/MessageService";
import { FC, PropsWithChildren, useState } from "react";
import { useEffectOnce, useUpdateEffect } from "usehooks-ts";
import { ChatContext, InitialChatState, Message } from "./ChatContext";
import { ChatContactMessageItem, ChatListContext, Contact, InitialChatListState } from "./ChatListContext";
import { useToken } from "@/utility/UtilityHooks";
import { WebSocketIncomingMessage, useSocket } from "@/service/websocket/Websocket";

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
  const [ chatState, setChatState ] = useState(InitialChatState);
  const [ chatListState, setChatListState ] = useState(InitialChatListState);
  const { sendMessageSocket , lastMessageSocket } = useSocket();
  const token = useToken();

  const sendMessageWs = (receiverUid: number, message: string) => {
    const req: WebSocketIncomingMessage = {
        content: message,
        receiverUid: receiverUid,
    };
    sendMessageSocket(req);
  };

  useUpdateEffect(() => {
    if (lastMessageSocket.type !== "message_notification") return;
    const msg = lastMessageSocket.payload;
    const newMessage: Message = {
      id: lastMessageSocket.payload.id,
      content: lastMessageSocket.payload.content,
      sender: "",
      time: lastMessageSocket.payload.sentAt,
      isUser: lastMessageSocket.payload.isUser
    };
    const contactId = msg.isUser ? msg.receiverUid : msg.senderUid;
    setChatState(s => {
      const ns = structuredClone(s);
      const msgs = ns.messages.get(contactId);
      if (msgs === undefined) {
        ns.messages.set(contactId, [newMessage]);
        return ns;
      }
      ns.messages.set(contactId, [...msgs, newMessage]);
      return ns;
    });
    const selectedContact = chatListState.selectedContact;
    (async () => {
      const resRecent = await ContactService.getContactsRecent(token);
      if (!resRecent.success) return;
      const contactMessagesProm: Promise<ChatContactMessageItem>[] = resRecent.payload.map(async u => {
        const unreadNotif = {
          id: u.contact_id,
          message: u.content,
          name: u.username,
          time: u.sent_at,
          unread_count: u.unread_count
        };
        if (selectedContact === null) return unreadNotif;
        if (selectedContact.uid !== u.contact_id) return unreadNotif;
        await MessageService.setMessagesRead(token, selectedContact.uid);
        unreadNotif.unread_count = 0;
        return unreadNotif;
      });
      const contactMessages = await Promise.all(contactMessagesProm);
      setChatListState(s => ({ ...s, contactMessages }));
    })();
  }, [lastMessageSocket]);

  const sendMessage = (message: string) => {
    if (chatListState.selectedContact === null) return;
    const receiverUid = chatListState.selectedContact.uid;
    sendMessageWs(receiverUid, message);
  };

  const setList = (
    list: "message" | "contact"
  ) => {
    setChatListState(s => ({ ...s, list }));
  };

  const selectContact = async (uid: number) => {
    const contact = chatListState.contacts.find(c => c.uid === uid);
    if (!contact) return;

    await MessageService.setMessagesRead(token, contact.uid);
    const response = await MessageService.getMessage(token, contact.uid);
    if (!response.success) return;
    const messages: ClientMessage[] = response.payload;

    setChatListState(s => ({
      ...s,
      selectedContact: contact,
      contactMessages: s.contactMessages.map(m => {
        if (m.id !== contact.uid) return m;
        return { ...m, unread_count: 0 };
      })
    }));

    setChatState(s => {
      const msgs = s.messages.get(contact.uid);
      if (msgs) return s;
      const ns = structuredClone(s);
      ns.messages.set(contact.uid, messages.map(m => ({
        id: m.id,
        content: m.content,
        isUser: m.isUser,
        sender: "",
        time: m.time
      })));
      return ns;
    });
  };

  useEffectOnce(() => {
    const run = async () => {
      const response = await ContactService.getContacts(token);
      if (response.success) {
        const contacts: Contact[] = response.payload.map(u => ({
          uid: u.id,
          name: u.email,
          urlProfile: ""
        }))
        setChatListState(s => ({...s, contacts }));
      }
      const resRecent = await ContactService.getContactsRecent(token);
      if (resRecent.success) {
        const contactMessages: ChatContactMessageItem[] = resRecent.payload.map(u => ({
          id: u.contact_id,
          message: u.content,
          name: u.username,
          time: u.sent_at,
          unread_count: u.unread_count
        }));
        setChatListState(s => ({ ...s, contactMessages }));
      }
    };
    run();
  });


  return (
    <ChatListContext.Provider value={{ state: chatListState, selectContact, setList }}>
      <ChatContext.Provider value={{ state: chatState, sendMessage }}>
        {props.children}
      </ChatContext.Provider>
    </ChatListContext.Provider>
  )
}
