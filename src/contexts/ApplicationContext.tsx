import { ContactService } from "@/service/api/ContactService";
import MessageService from "@/service/api/MessageService";
import { FC, PropsWithChildren, useContext, useState } from "react";
import { useEffectOnce, useUpdateEffect } from "usehooks-ts";
import { ChatContext, InitialChatState, Message } from "./ChatContext";
import { ChatContactMessageItem, ChatListContext, Contact, InitialChatListState } from "./ChatListContext";
import { useToken } from "@/utility/UtilityHooks";
import { useSocket } from "@/service/websocket/Websocket";


const useOnMessageNotification = async () => {
  const token = useToken();
  const { lastMessageSocket } = useSocket();
  const { state: chatListState, setState: setChatListState } = useContext(ChatListContext);
  const { setState: setChatState } = useContext(ChatContext);

  useUpdateEffect(() => {
    if (lastMessageSocket.type !== "message_notification") return;
    const messagePayload = lastMessageSocket.payload;
    const message: Message = {
      id: messagePayload.id, content: messagePayload.content,
      sender: "", time: messagePayload.sentAt,
      isUser: messagePayload.isUser
    };

    const contactId = messagePayload.isUser ?
      messagePayload.receiverUid 
      : messagePayload.senderUid;
    
    setChatState(s => {
      const ns = structuredClone(s);
      const msgs = ns.messages.get(contactId) ?? [];
      ns.messages.set(contactId, [ ...msgs, message ]);
      return ns;
    });
    const selectedContact = chatListState.selectedContact;
    const run = async () => {
      if (selectedContact === null) return;
      const resRecent = await ContactService.getContactsRecent(token);
                        await MessageService.setMessagesRead(token, selectedContact.uid);
      if (!resRecent.success) return;
      const contactMessages: ChatContactMessageItem[] = resRecent
        .payload.map(u => ({
          id: u.contact_id,
          message: u.content,
          name: u.username,
          time: u.sent_at,
          unread_count: u.unread_count
        }));
      setChatListState(s => ({ ...s, contactMessages }));
    };
    run();
  }, [ lastMessageSocket ]);
};

const WebSocketListener: FC<PropsWithChildren> = (props) => {
  useOnMessageNotification();
  return props.children;
};

const FetchDataOnMount: FC<PropsWithChildren> = (props) => {
  const token = useToken();
  const { setState: setChatListState } = useContext(ChatListContext);
  useEffectOnce(() => {
    const run = async () => {
      const response = await ContactService.getContacts(token);
      const responseRecent = await ContactService.getContactsRecent(token);
      if (!responseRecent.success) return;
      if (!response.success) return;

      const contacts: Contact[] = response
        .payload.map(u => ({
          uid: u.id,
          name: u.email,
          urlProfile: ""
        }));
      
      const contactMessages: ChatContactMessageItem[] = responseRecent
        .payload.map(u => ({
          id: u.contact_id,
          message: u.content,
          name: u.username,
          time: u.sent_at,
          unread_count: u.unread_count
        }));

      setChatListState(s => ({ ...s, contacts, contactMessages }));
    };
    run();
  });
  return props.children;
}

export const ApplicationContext: FC<PropsWithChildren> = (props) => {
  const [ chatState, setChatState ] = useState(InitialChatState);
  const [ chatListState, setChatListState ] = useState(InitialChatListState);

  const setList = (
    list: "message" | "contact"
  ) => {
    setChatListState(s => ({ ...s, list }));
  };

  return (
    <ChatListContext.Provider value={{ state: chatListState, setState: setChatListState, setList }}>
      <ChatContext.Provider value={{ state: chatState, setState: setChatState }}>
        <FetchDataOnMount>
          <WebSocketListener>
            {props.children}
          </WebSocketListener>
        </FetchDataOnMount>
      </ChatContext.Provider>
    </ChatListContext.Provider>
  )
}
