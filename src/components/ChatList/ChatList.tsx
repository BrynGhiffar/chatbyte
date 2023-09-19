import { FC, PropsWithChildren, useState, useCallback, useEffect, useContext } from "react"
import ChatListList from "@/components/ChatList/ChatListList"
import { ChatContactListItem, ChatListListItem } from "./ChatListListItem"
import ChatListWindow from "@/components/ChatList/ChatListWindow"
import ChatListSearch from "@/components/ChatList/ChatListSearch"
import ChatListNav from "./ChatListNav"
import { useAvatarImage, useChatListContext, useChatListSearch, useChatProfile, useLogout } from "@/utility/UtilityHooks"
import { ChatContactMessageItem, Contact } from "@/contexts/ChatListContext"
import styled from "styled-components"
import { colorConfig, font, color, commonCss } from "../Palette"
import { AddSymbolSVG, ChevronDownSVG } from "../common/Svg"
import { ProfilePicture, ProfilePictureWithStatus } from "../common/ProfilePicture"
import { WindowContext } from "@/contexts/WindowContext"

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
    return contact.name.toLowerCase().includes(searchStr.toLowerCase());
};

const filterContactMessage = (searchStr: string, contactMessage: ChatContactMessageItem) => {
    if (searchStr === "") return true;
    return contactMessage.name.toLowerCase().includes(searchStr.toLowerCase());
};


const SeparatorBlockStyled = styled.div`
    min-height: 40px;
    display: grid;
    grid-template-columns: 5fr 1fr;
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

type MessageStripProps = {
    hideAdd?: boolean;
    onClickAdd?: () => void;
}

const MessageStrip: FC<PropsWithChildren<MessageStripProps>> = (props) => {
    const hideAdd = props.hideAdd ?? false;
    return (
        <SeparatorBlockStyled>
            <SeparatorBlockTitle>
                {props.children}
            </SeparatorBlockTitle>
            {
                !hideAdd ? (
                    <SeparatorBlockAddContainer onClick={props.onClickAdd}>
                        <AddSymbolSVG/>
                    </SeparatorBlockAddContainer>

                ) : (<></>)
            }
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
                        type={c.type}
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
    const contacts = useContacts();
    const { push } = useContext(WindowContext);

    const onClickAddGroup = useCallback(() => {
        push("CREATE_GROUP_WINDOW");
    }, [push]);

    return  (
        <ChatListList>
            <ChatListSearch />
            <MessageStrip hideAdd>
                DIRECT CONVERSATIONS
            </MessageStrip>
            {
                contactMessages.filter(contactMessage => filterContactMessage(searchStr, contactMessage)).map(c => (
                    <ChatListListItem
                        type={"DIRECT"} 
                        key={c.id}
                        uid={c.id}
                        name={c.name}
                        time={c.time}
                        unread_count={c.unread_count}
                        message={c.message}
                    />
                ))
            }
            <MessageStrip onClickAdd={onClickAddGroup}>
                GROUP CONVERSATIONS
            </MessageStrip>
            {
                contacts.filter(c => c.type === "GROUP").filter(contact => filterContacts(searchStr, contact)).map(c => (
                    <ChatListListItem
                        type={c.type} 
                        key={c.uid} 
                        name={c.name} 
                        uid={c.uid}
                        time=""
                        unread_count={0}
                        message=""
                    />
                    ))
            }
            <MessageStrip>
                CONTACTS
            </MessageStrip>
            {
                contacts.filter(c => c.type === "DIRECT").filter(contact => filterContacts(searchStr, contact)).map(c => (
                    <ChatContactListItem
                        type={c.type} 
                        key={c.uid} 
                        name={c.name} 
                        uid={c.uid}
                    />
                    ))
            }
        </ChatListList>
    );
}

export const ChatListProfileStyled = styled.div`
  width: 100%;
  background-color: ${colorConfig.chatNavBackgroundColor};
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const ProfileDetailContainer = styled.div`
    height: 100%;
    display: grid;
    grid-template-columns: 50px 1fr;
    align-items: center;
    padding-left: 1rem;
    gap: 1rem;
`;

const ProfileDetailControlsContainer = styled.div`
    height: 100%;
    display: grid;
    justify-content: flex-end;
    align-items: center;
    padding-right: 15px;
`;

const ChatListProfileNameStyled = styled.span`
    font-family: ${font.appleFont};
    color: ${color.white};
    font-size: 1rem;
    font-weight: bold;
`;

const ChatListProfileMoreButton = styled.div<{$clicked: boolean}>`
    position: relative;
    ${commonCss.transition}
    height: 25px;
    aspect-ratio: 1 / 1;
    cursor: pointer;
    border-radius: 5px;
    background-color: ${props => props.$clicked ? '#2a4fb2' : 'transparent'};
    :hover {
        background-color: #2a4fb2;
    }
    > svg {
        color: white;
    }
`

const PopUpWindowStyled = styled.div`
    cursor: default;
    position: absolute;
    width: 150px;
    background-color: white;
    border: 1px solid rgb(200,200,200);
    border-radius: 5px;
    top: 30px;
    z-index: 100;
    display: grid;
    overflow: hidden;
`;

const PopupMenuItem = styled.div`
    ${commonCss.transition}
    width: 100%;
    font-family: ${font.appleFont};
    padding-left: 10px;
    font-weight: 600;
    font-size: 1.2rem;
    height: 2rem;
    cursor: pointer;
    text-transform: uppercase;
    :hover {
        background-color: #eff4ff;
    }
`;

const PopupWindow: FC = () => {
    const { push: pushWindow } = useContext(WindowContext);
    const onClickProfile = useCallback((e: DivMouseEvent) => {
        pushWindow("SETTINGS_WINDOW");
    }, [pushWindow]);
    const onClickLogout = useCallback((e: DivMouseEvent) => {
        pushWindow("LOGOUT_CONFIRM");
    }, [pushWindow]);
    return (
        <PopUpWindowStyled
        >
            <PopupMenuItem onClick={onClickProfile}>Settings</PopupMenuItem>
            <PopupMenuItem onClick={onClickLogout}>Log Out</PopupMenuItem>
        </PopUpWindowStyled>
    )
}


type DivMouseEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;

const ChatListProfile: FC = () => {
  const [userId, username] = useChatProfile();
  const [avatarImage] = useAvatarImage(userId);
  const [showPopup, setShowPopup] = useState(false);
  const { push: pushWindow } = useContext(WindowContext);

  useEffect(() => {
    const clickOutside = () => setShowPopup(false);
    window.addEventListener('click', clickOutside);

    return () => {
        window.removeEventListener('click', clickOutside);
    }
  }, []);

  const onProfileMoreButton = useCallback((e: DivMouseEvent) => {
    e.stopPropagation();
    pushWindow("SETTINGS_WINDOW");
  }, [pushWindow]);

  return (
    <ChatListProfileStyled>
        <ProfileDetailContainer>
            <ProfilePictureWithStatus
                imageUrl={avatarImage} 
                statusOutlineColor={colorConfig.chatNavBackgroundColor}
            />
            <ChatListProfileNameStyled>{username}</ChatListProfileNameStyled>
        </ProfileDetailContainer>
        <ProfileDetailControlsContainer>
            <ChatListProfileMoreButton $clicked={showPopup} onClick={onProfileMoreButton}>
                <ChevronDownSVG/>
                {/* {showPopup && <PopupWindow/>} */}
            </ChatListProfileMoreButton>
        </ProfileDetailControlsContainer>
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
            {/* <ChatListNav/> */}
            <ChatListInner/>
        </ChatListWindow>
    )
}

export default ChatList;