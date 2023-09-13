import { ContactService } from "@/service/api/ContactService";
import MessageService from "@/service/api/MessageService";
import { FC, PropsWithChildren, useContext, useEffect, useState } from "react";
import { useEffectOnce, useUpdateEffect } from "usehooks-ts";
import { ChatContext, ChatState, InitialChatState, Message } from "./ChatContext";
import { ChatContactMessageItem, ChatListContext, Contact, InitialChatListState } from "./ChatListContext";
import { useToken } from "@/utility/UtilityHooks";
import { WebSocketOutgoingMessage, useSocket } from "@/service/websocket/Websocket";
import { UserService } from "@/service/api/UserService";

const toMessageNotification = (message: WebSocketOutgoingMessage): [Message, number, number] | null => {
  if (message.type !== "MESSAGE_NOTIFICATION") return null;
  const messagePayload = message;
  const result: Message = {
    id: messagePayload.id, content: messagePayload.content,
    sender: "", time: messagePayload.sentAt,
    isUser: messagePayload.isUser,
    receiverRead: message.receiverRead,
  };
  return [result, message.receiverUid, message.senderUid];
};

const toReadNotification = (message: WebSocketOutgoingMessage): [number, number] | null => {
  if (message.type !== "READ_NOTIFICATION") return null;
  return [message.receiverUid, message.senderUid]; 
}

type SetChatState = (value: React.SetStateAction<ChatState>) => void

const addMessageToChatState = (setChatState: SetChatState, newMessage: Message, contactId: number) => {
  setChatState(s => {
    const ns = structuredClone(s);
    const msgs = ns.messages.get(contactId) ?? [];
    ns.messages.set(contactId, [ ...msgs, newMessage ]);
    return ns;
  });
};

const setMessageRead = (setChatState: SetChatState, receiverUid: number) => {
  setChatState(s => {
    const ns = structuredClone(s);
    const msgs = ns.messages.get(receiverUid);
    if (!msgs) return s;
    const nMsgs = msgs.map(m => m.isUser ? ({...m, receiverRead: true}) : m);
    ns.messages.set(receiverUid, nMsgs);
    return ns;
  })
};

const useOnMessageNotification = () => {
  const token = useToken();
  const { state: chatListState, setState: setChatListState } = useContext(ChatListContext);
  const { setState: setChatState } = useContext(ChatContext);
  const { lastMessageSocket } = useSocket();

  useUpdateEffect(() => {
    // handles message notifications
    const result = toMessageNotification(lastMessageSocket);
    if (!result) return;
    const [message, receiverUid, senderUid] = result;

    const contactId = message.isUser ?
    receiverUid 
      : senderUid;
    addMessageToChatState(setChatState, message, contactId);
    const selectedContact = chatListState.selectedContact;
    const run = async () => {
      if (selectedContact === null) return;
      await MessageService.setMessagesRead(token, selectedContact.uid);
      const resRecent = await ContactService.getContactsRecent(token);
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

  useUpdateEffect(() => {
    const result = toReadNotification(lastMessageSocket);
    if (!result) return;
    const [receiverUid, senderUid] = result;
    setMessageRead(setChatState, receiverUid);
  }, [lastMessageSocket]);
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
      const userDetailsResponse = await UserService.getUserDetails(token);
      if (!responseRecent.success) return;
      if (!response.success) return;
      if (!userDetailsResponse.success) return;
      const { uid, username } = userDetailsResponse.payload;

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

      setChatListState(s => ({ ...s, contacts, contactMessages, userId: uid, username }));
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
