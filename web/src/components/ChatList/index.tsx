import { FC, useCallback, useRef } from 'react';
import { useResizable } from 'react-resizable-layout';

import { DivMouseEvent } from '@/misc/types';
import useAppStore from '@/store/AppStore';
import {
  useChatListSearch,
  useColorConfig,
  useWindow,
} from '@/store/AppStore/hooks';
import {
  Contact,
  Conversation,
  GroupConversation,
} from '@/store/AppStore/type';

import { commonCss, font } from '@components/Palette';

import styled from 'styled-components';

import ContactItem from './ChatListItem/ContactItem';
import ConversationItem from './ChatListItem/ConversationItem';
import ListSeparator from './ListSeparator';
import Search from './Search';
import {
  SC__ChatListContainer,
  SC__ChatListSeparator,
  SC__ChatListWindow,
  TH__ChatListContactContainer,
} from './styled';

const filterContacts = (searchStr: string, contact: Contact): boolean => {
  if (searchStr === '') {
    return true;
  }
  return contact.name.toLowerCase().includes(searchStr.toLowerCase());
};

const filterContactMessage = (
  searchStr: string,
  contactMessage: Conversation | GroupConversation
) => {
  if (searchStr === '') return true;
  return contactMessage.name.toLowerCase().includes(searchStr.toLowerCase());
};

const ContactMessageList: FC = () => {
  const [searchStr, _] = useChatListSearch();
  const groupConversations = useAppStore(s => s.groupConversations).filter(
    contact => filterContactMessage(searchStr, contact)
  );
  const isUserOnline = useAppStore(s => s.isUserOnline);
  const directConversations = useAppStore(s => s.conversations).filter(
    contactMessage => filterContactMessage(searchStr, contactMessage)
  );
  const contacts = useAppStore(s =>
    s.contacts.map(c => {
      if (c.type === 'DIRECT') return { ...c };
      return undefined;
    })
  ).filter(contact => contact && filterContacts(searchStr, contact));
  const { pushWindow: push } = useWindow();

  const onClickAddGroup = useCallback(() => {
    push({ type: 'CREATE_GROUP_WINDOW' });
  }, [push]);

  return (
    <TH__ChatListContactContainer>
      <Search />
      <ListSeparator hideAdd>DIRECT CONVERSATIONS</ListSeparator>
      {directConversations.map(c => (
        <ConversationItem
          online={isUserOnline(c.id)}
          type={'DIRECT'}
          key={c.id}
          uid={c.id}
          name={c.name}
          time={c.lastMessageTime}
          unread_count={c.unreadCount}
          message={c.lastMessageContent}
          deleted={c.deleted}
        />
      ))}
      <ListSeparator onClickAdd={onClickAddGroup}>
        GROUP CONVERSATIONS
      </ListSeparator>
      {groupConversations.map(c => (
        <ConversationItem
          type={c.type}
          key={c.id}
          name={c.name}
          uid={c.id}
          time={c.lastMessageTime}
          unread_count={c.unreadCount}
          message={c.lastMessageContent}
          deleted={c.deleted}
        />
      ))}
      <ListSeparator>CONTACTS</ListSeparator>
      {contacts.map(
        c =>
          c && (
            <ContactItem
              online={isUserOnline(c.id)}
              type={c.type}
              key={c.id}
              name={c.name}
              uid={c.id}
            />
          )
      )}
    </TH__ChatListContactContainer>
  );
};

const PopUpWindowStyled = styled.div`
  cursor: default;
  position: absolute;
  width: 150px;
  background-color: white;
  border: 1px solid rgb(200, 200, 200);
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
  const onClickProfile = useCallback(
    (e: DivMouseEvent) => {
      pushWindow({ type: 'SETTINGS_WINDOW' });
    },
    [pushWindow]
  );
  const onClickLogout = useCallback(
    (e: DivMouseEvent) => {
      pushWindow({ type: 'LOGOUT_CONFIRM' });
    },
    [pushWindow]
  );
  return (
    <PopUpWindowStyled>
      <PopupMenuItem onClick={onClickProfile}>Settings</PopupMenuItem>
      <PopupMenuItem onClick={onClickLogout}>Log Out</PopupMenuItem>
    </PopUpWindowStyled>
  );
};

const ChatList: FC = props => {
  const chatListContainerRef = useRef(null);
  const { position, separatorProps } = useResizable({
    containerRef: chatListContainerRef,
    axis: 'x',
    initial: 400,
    min: 400,
  });
  const backgroundColor = useColorConfig().chatListBackgroundColor;
  const borderLeftColor = useColorConfig().chatListBorderLeftColor;
  return (
    <SC__ChatListContainer ref={chatListContainerRef}>
      <SC__ChatListWindow $width={position}>
        <ContactMessageList />
      </SC__ChatListWindow>
      <SC__ChatListSeparator
        {...separatorProps}
        $backgroundColor={backgroundColor}
        $borderColor={borderLeftColor}
      />
    </SC__ChatListContainer>
  );
};

export default ChatList;
