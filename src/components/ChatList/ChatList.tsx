import { FC } from "react"
import ChatListList from "@/components/ChatList/ChatListList"
import { ChatContactListItem, ChatListListItem } from "./ChatListListItem"
import ChatListWindow from "@/components/ChatList/ChatListWindow"
import ChatListSearch from "@/components/ChatList/ChatListSearch"
import ChatListNav from "./ChatListNav"
import { useChatListContext, useChatListSearch } from "@/utility/UtilityHooks"
import { useEffectOnce, useUpdateEffect } from "usehooks-ts"
import { ChatContactMessageItem, Contact } from "@/contexts/ChatListContext"

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
};

const filterContacts = (searchStr: string, contact: Contact): boolean => {
    if (searchStr === "") {
        return true;
    }
    return contact.name.includes(searchStr);
};

const filterContactMessage = (searchStr: string, contactMessage: ChatContactMessageItem) => {
    if (searchStr === "") return true;
    return contactMessage.name.includes(searchStr);
};

const ChatList: FC = () => {
    const contacts = useContacts();
    const contactMessages = useContactMessage();
    const list = useList();
    const [ searchStr ] = useChatListSearch();
    const ContactList = () => (
            <ChatListList>
                {
                    contacts.filter(contact => filterContacts(searchStr, contact)).map(c => (
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
                contactMessages.filter(contactMessage => filterContactMessage(searchStr, contactMessage)).map(c => (
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