import { ContactService } from "@/service/api/ContactService";
import MessageService from "@/service/api/MessageService";
import { FC, PropsWithChildren, useContext, useEffect, useState } from "react";
import { useEffectOnce, useUpdateEffect } from "usehooks-ts";
import { ChatContext, ChatState, InitialChatState, Message } from "./ChatContext";
import { ChatContactMessageItem, ChatListContext, Contact, InitialChatListState } from "./ChatListContext";
import { useToken } from "@/utility/UtilityHooks";
import { WebSocketOutgoingMessage, useSocket } from "@/service/websocket/Websocket";
import { UserService } from "@/service/api/UserService";
import { GroupService } from "@/service/api/GroupService";

const toMessageNotification = (message: WebSocketOutgoingMessage, uid: number): [Message, number, number] | null => {
  if (message.type === "MESSAGE_NOTIFICATION") {
    const messagePayload = message;
    const result: Message = {
      id: messagePayload.id, content: messagePayload.content,
      sender: "", time: messagePayload.sentAt,
      isUser: messagePayload.senderUid === uid,
      receiverRead: message.receiverRead,
    };
    return [result, message.receiverUid, message.senderUid];
  } else if (message.type === "GROUP_MESSAGE_NOTIFICATION") {
    const result: Message = {
      id: message.id,
      content: message.content,
      isUser: message.senderId === uid,
      receiverRead: false,
      sender: `${message.senderId}`,
      time: message.sentAt,
    }
    return [result, message.groupId, message.groupId];
  }
  return null;
};

const toReadNotification = (message: WebSocketOutgoingMessage): [number, number] | null => {
  if (message.type !== "READ_NOTIFICATION") return null;
  return [message.receiverUid, message.senderUid]; 
}



type SetChatState = (value: React.SetStateAction<ChatState>) => void

const addMessageToChatState = (setChatState: SetChatState, newMessage: Message) => {
  setChatState(s => {
    return { messages: [ ...s.messages, newMessage ] };
  });
};

const setMessageRead = (setChatState: SetChatState) => {
  setChatState(s => {
    const nMsgs = s.messages.map(m => m.isUser ? ({...m, receiverRead: true}) : m);
    return { ...s, messages: nMsgs };
  })
};

const useOnMessageNotification = () => {
  const token = useToken();
  const { state: chatListState, setState: setChatListState } = useContext(ChatListContext);
  const { setState: setChatState } = useContext(ChatContext);
  const { lastMessageSocket } = useSocket();

  useUpdateEffect(() => {
    // handles message notifications
    const result = toMessageNotification(lastMessageSocket, chatListState.userId);
    if (!result) return;
    const [message, receiverUid, senderUid] = result;

    const contactId = message.isUser ?
    receiverUid 
      : senderUid;
    const selectedContact = chatListState.selectedContact;
    const run = async () => {
      if (selectedContact === null) return;
      if (selectedContact.uid === contactId && selectedContact.type === "DIRECT") {
        addMessageToChatState(setChatState, message);
        await MessageService.setMessagesRead(token, selectedContact.uid);
      } else if (selectedContact.uid === contactId && selectedContact.type === "GROUP") {
        addMessageToChatState(setChatState, message);
      }
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
    if (receiverUid !== chatListState.selectedContact?.uid) return;
    setMessageRead(setChatState);
  }, [lastMessageSocket, chatListState.selectedContact]);
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
      const getGroupsResponse = await GroupService.getGroups(token);
      if (!responseRecent.success) return;
      if (!response.success) return;
      if (!userDetailsResponse.success) return;
      if (!getGroupsResponse.success) return;

      const groupContacts: Contact[] = getGroupsResponse.payload
        .map(c => ({
          type: "GROUP",
          name: c.name,
          uid: c.id,
          urlProfile: ""
        }));

      const { uid, username } = userDetailsResponse.payload;

      const directContacts: Contact[] = response
        .payload.map(u => ({
          type: "DIRECT",
          uid: u.id,
          name: u.email,
          urlProfile: ""
        }));
      
      const contacts = [...directContacts, ...groupContacts];
      
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
