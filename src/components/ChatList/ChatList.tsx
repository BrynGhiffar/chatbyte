import { FC, PropsWithChildren } from "react"
import ChatListList from "@/components/ChatList/ChatListList"
import { ChatContactListItem, ChatListListItem } from "./ChatListListItem"
import ChatListWindow from "@/components/ChatList/ChatListWindow"
import ChatListSearch from "@/components/ChatList/ChatListSearch"
import ChatListNav from "./ChatListNav"
import { useAvatarImage, useChatListContext, useChatListSearch } from "@/utility/UtilityHooks"
import { ChatContactMessageItem, Contact } from "@/contexts/ChatListContext"
import styled from "styled-components"
import { colorConfig, font, color } from "../Palette"
import { AddSymbolSVG } from "../common/Svg"
import { ProfilePicture } from "../common/ProfilePicture"

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
    return contact.name.includes(searchStr.toLowerCase());
};

const filterContactMessage = (searchStr: string, contactMessage: ChatContactMessageItem) => {
    if (searchStr === "") return true;
    return contactMessage.name.toLowerCase().includes(searchStr.toLowerCase());
};


const SeparatorBlockStyled = styled.div`
    min-height: 40px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-top: 1px solid ${colorConfig.chatListSeparatorBorderColor};
`;

const SeparatorBlockTitle = styled.div`
    padding-left: 20px;
    font-weight: 600;
    color: ${colorConfig.chatListSeparatorTextColor};
    display: flex;
    align-items: center;
    height: 100%;
`;

const SeparatorBlockAddContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 40px;
    > svg {
        cursor: pointer;
        height: 80%;
        color: ${colorConfig.chatListSeparatorTextColor};
    }
    /* height: 100%; */
`;

const MessageStrip: FC<PropsWithChildren> = (props) => {
    return (
        <SeparatorBlockStyled>
            <SeparatorBlockTitle>
                {props.children}
            </SeparatorBlockTitle>
            <SeparatorBlockAddContainer>
                <AddSymbolSVG/>
            </SeparatorBlockAddContainer>
        </SeparatorBlockStyled>
    )
}
const ContactList = () => {
    const [searchStr] = useChatListSearch();
    const contacts = useContacts();
    return (
        <ChatListList>
            <MessageStrip>
                CONTACTS
            </MessageStrip>
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

}

const ContactMessageList = () => {
    const [searchStr] = useChatListSearch();
    const contactMessages = useContactMessage();
    return  (
        <ChatListList>
            <ChatListSearch />
            <MessageStrip>
                DIRECT CONVERSATIONS
            </MessageStrip>
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
            <MessageStrip>
                GROUP CONVERSATIONS
            </MessageStrip>
        </ChatListList>
    );
}

export const ChatListProfileStyled = styled.div`
  width: 100%;
  background-color: ${colorConfig.chatNavBackgroundColor};
  display: grid;
  grid-template-columns: 50px 1fr;
  align-items: center;
  padding-left: 1rem;
  gap: 1rem;
`;

const ChatListProfileNameStyled = styled.span`
    font-family: ${font.appleFont};
    color: ${color.white};
    font-size: 1rem;
    font-weight: bold;
`;

const useChatProfile = (): [number, string]=> {
  const { state } = useChatListContext();
  return [state.userId, state.username];
}

const ChatListProfile: FC = () => {
  const [userId, username] = useChatProfile();
  const [avatarImage] = useAvatarImage(userId);
  return (
    <ChatListProfileStyled>
      <ProfilePicture imageUrl={avatarImage}/>
      <ChatListProfileNameStyled>{username}</ChatListProfileNameStyled>
    </ChatListProfileStyled>
  );
};

const ChatListInner = () => {
    const list = useList();
    if (list === "contact") return (<ContactList/>);
    if (list === "message") return (<ContactMessageList/>);
    return (
        <div></div>
    );
};

const ChatList: FC = () => {
    return (
        <ChatListWindow>
            <ChatListProfile/>
            <ChatListNav/>
            <ChatListInner/>
        </ChatListWindow>
    )
}

export default ChatList;