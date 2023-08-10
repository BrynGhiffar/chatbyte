import { ChatContext } from "@/contexts/ChatContext";
import { ChatListContext } from "@/contexts/ChatListContext";
import { useContext, useEffect, useState } from "react";
import { LocalStorage } from "./LocalStorage";
import { useNavigate } from "react-router-dom";
import MessageService from "@/service/api/MessageService";
import { WebSocketIncomingMessage, useSocket } from "@/service/websocket/Websocket";
import { avatarImageUrl } from "@/service/api/UserService";
import { AuthService } from "@/service/api/AuthService";
export const useChatContext = () => {
  return useContext(ChatContext);
};

export const useChatListContext = () => {
  return useContext(ChatListContext);
};

export const useToken = () => {
    const navigate = useNavigate();
    const token = LocalStorage.getLoginToken();
    useEffect(() => {
      const run = async () => {
        if (!token) {
            return navigate("/auth");
        }
        const response = await AuthService.validateToken(token);
        if (!response.success) {
          return navigate("/auth");
        }
      };
      run();
    }, [token, navigate]);
    return token || "";
};


type ClientMessage = {
  id: number;
  receiverId: number;
  senderId: number;
  isUser: boolean;
  content: string;
  time: string;
};

export const useAvatarImage = (uid: number | null): [string, () => void] => {
  const [num, setNum] = useState(Math.floor(Math.random() * 1_000));
  const reload = () => {
    setNum(_ => Math.floor(Math.random() * 1_000));
  };
  if (uid === null) {
    return ["", reload]
  }
  return [ avatarImageUrl(uid)(num), reload ];
};

export const useSelectContact = () => {
  const token = useToken();
  const { state: chatListState, setState: setChatListState } = useContext(ChatListContext);
  const { setState: setChatState } = useContext(ChatContext);

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
  return selectContact;
};


export const useSendMessage = () => {

  const { state: chatListState } = useChatListContext();
  const { sendMessageSocket } = useSocket();
  
  const sendMessageWs = (message: string) => {
    if (chatListState.selectedContact === null) return;
    const receiverUid = chatListState.selectedContact.uid;
    const req: WebSocketIncomingMessage = {
      content: message,
      receiverUid: receiverUid,
    };
    sendMessageSocket(req);
  };

  return sendMessageWs;
}