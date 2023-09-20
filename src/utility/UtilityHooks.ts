import { ChatContext, Message } from "@/contexts/ChatContext";
import { ChatListContext } from "@/contexts/ChatListContext";
import { useEffect, useState } from "react";
import { LocalStorage } from "./LocalStorage";
import { useLocation, useNavigate } from "react-router-dom";
import MessageService from "@/service/api/MessageService";
import { WebSocketIncomingMessage, useSocket } from "@/service/websocket/Websocket";
import { avatarImageGroupUrl, avatarImageUrl } from "@/service/api/UserService";
import { AuthService } from "@/service/api/AuthService";
import { GroupService } from "@/service/api/GroupService";
import { SnackbarContext } from "@/components/common/Snackbar";
// export const useChatContext = () => {
//   return useContext(ChatContext);
// };

// export const useChatListContext = () => {
//   return useContext(ChatListContext);
// };

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

export const useLogout = () => {
  const navigate = useNavigate();
  return () => {
    LocalStorage.removeLoginToken();
    navigate("/auth");
  };
};

export const useAvatarImage = (uid: number | null, type: "DIRECT" | "GROUP" = "DIRECT"): [string, () => void] => {
  const [num, setNum] = useState(Math.floor(Math.random() * 1_000));
  const reload = () => {
    setNum(_ => Math.floor(Math.random() * 1_000));
  };
  if (uid === null) {
    return ["", reload]
  }
  const url = type === "DIRECT" ? avatarImageUrl(uid)(num) : avatarImageGroupUrl(uid)(num);
  return [ url, reload ];
};

// export const useSelectContact = () => {
//   const token = useToken();
//   const { pushError } = useContext(SnackbarContext);
//   const { state: chatListState, setState: setChatListState } = useContext(ChatListContext);
//   const { setState: setChatState } = useContext(ChatContext);

//   const selectContact = async (type: "DIRECT" | "GROUP", uid: number) => {
//     const contact = chatListState.contacts.find(c => c.uid === uid && c.type === type);
//     if (!contact) return;

//     setChatListState(s => ({
//       ...s,
//       selectedContact: contact,
//       contactMessages: s.contactMessages.map(m => {
//         if (m.id !== contact.uid) return m;
//         return { ...m, unread_count: 0 };
//       })
//     }));
    
//     if (contact.type === "DIRECT") {
//       await MessageService.setMessagesRead(token, contact.uid);
//       const response = await MessageService.getMessage(token, contact.uid);
//       if (!response.success) return;
//       const messages = response.payload;
  
  
//       setChatState(s => {
//         const newMessages = messages.map(m => ({
//           id: m.id,
//           content: m.content,
//           isUser: m.isUser,
//           sender: "",
//           time: m.time,
//           receiverRead: m.receiverRead
//         }));
//         return {...s, messages: newMessages };
//       });
//     } else {
//       const response = await GroupService.getGroupMessages(uid, token);
//       if (!response.success) { return pushError("Failed getting group messages"); }
//       const messages: Message[] = response.payload
//         .map(m => ({
//           id: m.id,
//           receiverRead: false,
//           isUser: m.senderId === chatListState.userId,
//           sender: "",
//           time: m.sentAt,
//           content: m.content
//         }));
//       setChatState(s => ({ ...s, messages }));
//     }


//   };
//   return selectContact;
// };

// export const useSendMessage = () => {

//   const { state: chatListState } = useChatListContext();
//   const { sendMessageSocket, sendGroupMessage } = useSocket();
  
//   const sendMessageWs = (message: string) => {
//     if (chatListState.selectedContact === null) return;
//     if (chatListState.selectedContact.type === "DIRECT") {
//       const receiverUid = chatListState.selectedContact.uid;
//       const req: WebSocketIncomingMessage = {
//         content: message,
//         receiverUid: receiverUid,
//       };
//       sendMessageSocket(req);
//     } else if (chatListState.selectedContact.type === "GROUP") {
//       const groupId = chatListState.selectedContact.uid;
//       const req = {
//         content: message,
//         groupId: groupId,
//       };
//       sendGroupMessage(req);
//     }
//   };

//   return sendMessageWs;
// }

// export const useChatListSearch = (): [string, (searchStr: string) => void] => {
//   const { state, setState } = useContext(ChatListContext);
//   const setSearch = (searchStr: string) => {
//     setState(prev => ({ ...prev, searchInput: searchStr }));
//   };
//   return [ state.searchInput, setSearch ];
// };

// export const useCurrentContactUid = () => {
//     const { state } = useChatListContext();
//     if (state.selectedContact)
//     {
//         return state.selectedContact.uid;
//     }
//     return null;
// }

// export const useChatProfile = (): [number, string]=> {
//   const { state } = useChatListContext();
//   return [state.userId, state.username];
// };
