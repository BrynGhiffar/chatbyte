import { ChatContext } from "@/contexts/ChatContext";
import { ChatListContext } from "@/contexts/ChatListContext";
import { useContext } from "react";
import { LocalStorage } from "./LocalStorage";
import { useNavigate } from "react-router-dom";
// import { ChatCon}
export const useChatContext = () => {
  return useContext(ChatContext);
};

export const useChatListContext = () => {
  return useContext(ChatListContext);
};

export const useToken = () => {
    const navigate = useNavigate();
    const token = LocalStorage.getLoginToken();
    if (!token) {
        navigate("/auth");
        return "";
    }
    return token;
};