import { FC, PropsWithChildren, useState, useCallback, useEffect } from "react"
import ChatListList from "@/components/ChatList/ChatListList"
import { ChatContactListItem, ChatListListItem } from "./ChatListListItem"
import ChatListWindow from "@/components/ChatList/ChatListWindow"
import ChatListSearch from "@/components/ChatList/ChatListSearch"
import styled from "styled-components"
import { colorConfig, font, color, commonCss } from "../Palette"
import { AddSymbolSVG, ChevronDownSVG } from "../common/Svg"
import useAppStore from "@/store/AppStore"
import { Contact, Conversation, GroupConversation } from "@/store/AppStore/type"
import { useChatListSearch, useWindow } from "@/store/AppStore/hooks"
import { DivMouseEvent } from "@/misc/types"
import ChatListProfile from "./ChatListProfile"

const filterContacts = (searchStr: string, contact: Contact): boolean => {
    if (searchStr === "") {
        return true;
    }
    return contact.name.toLowerCase().includes(searchStr.toLowerCase());
};

const filterContactMessage = (searchStr: string, contactMessage: Conversation | GroupConversation) => {
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
                        <AddSymbolSVG />
                    </SeparatorBlockAddContainer>

                ) : (<></>)
            }
        </SeparatorBlockStyled>
    )
}

const ContactMessageList = () => {
    const [ searchStr, _ ] = useChatListSearch();
    const groupConversations = useAppStore(s => s.groupConversations);
    const directConversations = useAppStore(s => s.conversations);
    const contacts = useAppStore(s => s.contacts.map(c => {
        if (c.type === "DIRECT") return { ...c };
        return undefined;
    }));
    const { pushWindow: push } = useWindow();

    const onClickAddGroup = useCallback(() => {
        push("CREATE_GROUP_WINDOW");
    }, [ push ]);

    return (
        <ChatListList>
            <ChatListSearch />
            <MessageStrip hideAdd>
                DIRECT CONVERSATIONS
            </MessageStrip>
            {
                directConversations.filter(contactMessage => filterContactMessage(searchStr, contactMessage)).map(c => (
                    <ChatListListItem
                        online={false}
                        type={"DIRECT"}
                        key={c.id}
                        uid={c.id}
                        name={c.name}
                        time={c.lastMessageTime}
                        unread_count={c.unreadCount}
                        message={c.lastMessageContent}
                    />
                ))
            }
            <MessageStrip onClickAdd={onClickAddGroup}>
                GROUP CONVERSATIONS
            </MessageStrip>
            {
                groupConversations.filter(contact => filterContactMessage(searchStr, contact)).map(c => (
                    <ChatListListItem
                        type={c.type}
                        key={c.id}
                        name={c.name}
                        uid={c.id}
                        time={c.lastMessageTime}
                        unread_count={c.unreadCount}
                        message={c.lastMessageContent}
                    />
                ))
            }
            <MessageStrip>
                CONTACTS
            </MessageStrip>
            {
                contacts.filter(contact => contact && filterContacts(searchStr, contact)).map(c => (
                    c &&
                    <ChatContactListItem
                        online={false}
                        type={c.type}
                        key={c.id}
                        name={c.name}
                        uid={c.id}
                    />
                ))
            }
        </ChatListList>
    );
}

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
    const { pushWindow } = useWindow();
    const onClickProfile = useCallback((e: DivMouseEvent) => {
        pushWindow("SETTINGS_WINDOW");
    }, [ pushWindow ]);
    const onClickLogout = useCallback((e: DivMouseEvent) => {
        pushWindow("LOGOUT_CONFIRM");
    }, [ pushWindow ]);
    return (
        <PopUpWindowStyled
        >
            <PopupMenuItem onClick={onClickProfile}>Settings</PopupMenuItem>
            <PopupMenuItem onClick={onClickLogout}>Log Out</PopupMenuItem>
        </PopUpWindowStyled>
    )
}

const ChatList: FC = () => {
    return (
        <ChatListWindow>
            <ChatListProfile />
            <ContactMessageList />
        </ChatListWindow>
    )
}

export default ChatList;