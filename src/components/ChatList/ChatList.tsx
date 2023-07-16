import { FC } from "react"
import ChatListList from "@/components/ChatList/ChatListList"
import { ChatContactListItem, ChatListListItem } from "./ChatListListItem"
import ChatListWindow from "@/components/ChatList/ChatListWindow"
import ChatListSearch from "@/components/ChatList/ChatListSearch"
import ChatListNav from "./ChatListNav"
import { useChatListContext } from "@/utility/UtilityHooks"
import { useEffectOnce, useUpdateEffect } from "usehooks-ts"

const useContacts = () => {
    const { state } = useChatListContext();
    return state.contacts;
};

const useList = () => {
    const { state } = useChatListContext();
    return state.list;
};

const useContactMessage = () => {
    const { state } = useChatListContext();
    return state.contactMessages;
}

const ChatList: FC = () => {
    const contacts = useContacts();
    const contactMessages = useContactMessage();
    const list = useList();
    const ContactList = () => (
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
    );

    const ContactMessageList = () => (
        <ChatListList>
            {
                contactMessages.map(c => (
                    <ChatListListItem 
                        key={c.id}
                        uid={c.id}
                        name={c.name}
                        time={c.time}
                        unread_count={c.unread_count}
                        message={c.message}
                    />
                ))
            }
        </ChatListList>
    );
    const ChatList = () => {
        if (list === "contact") return (<ContactList/>);
        if (list === "message") return (<ContactMessageList/>);
        return (
            <div></div>
        );
    };
    return (
        <ChatListWindow>
            <ChatListSearch />
            <ChatListNav/>
            <ChatList/>
        </ChatListWindow>
    )
}

export default ChatList;