import { FC } from "react"
import ChatListList from "@/components/ChatList/ChatListList"
import { ChatContactListItem } from "./ChatListListItem"
import ChatListWindow from "@/components/ChatList/ChatListWindow"
import ChatListSearch from "@/components/ChatList/ChatListSearch"
import ChatListNav from "./ChatListNav"
import { useChatListContext } from "@/contexts/ApplicationContext"

const useContacts = () => {
    const { state } = useChatListContext();
    return state.contacts;
};

const ChatList: FC = () => {
    const contacts = useContacts();
    return (
        <ChatListWindow>
            <ChatListSearch />
            <ChatListNav/>
            <ChatListList>
                {
                    contacts.map(c => (
                        <ChatContactListItem 
                            key={c.uid} 
                            name={c.name} 
                            uid={c.uid}
                        />
                    ))
                }
            </ChatListList>
        </ChatListWindow>
    )
}

export default ChatList;