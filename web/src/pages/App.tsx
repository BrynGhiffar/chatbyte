import { AnimatePresence, motion } from 'framer-motion';
import { FC, PropsWithChildren, useEffect, useRef } from 'react';

import { askShowNotificationPermission } from '@/api/browser/BrowserNotification';
import ChangePasswordWindow from '@/components/ChangePasswordWindow';
import Chat from '@/components/Chat';
import ChatList from '@/components/ChatList';
import ConfirmDeleteMessagePopup from '@/components/ConfirmDeleteMessagePopup';
import { CreateGroupWindow } from '@/components/CreateGroupWindow';
import ImageCarouselWindow from '@/components/ImageCarouselWindow';
import { color } from '@/components/Palette';
import { PopupLogoutWindow } from '@/components/PopupLogout';
import SettingsNewWindow from '@/components/SettingsNewWindow';
import useAppStore from '@/store/AppStore';
import { useToken } from '@/utility/UtilityHooks';

import Sidebar from '@components/Sidebar';

import styled from 'styled-components';

const AppWindowStyled = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: ${color.lightBlue};
  position: relative;
`;

type ChatWindowStyledProps = {
  $showChatList: boolean;
};

const ChatWindowStyled = styled.div<ChatWindowStyledProps>`
  height: 100vh;
  width: 100vw;
  display: flex;
`;

const ChatWindow: FC = props => {
  const chatWindowRef = useRef(null);
  const showChatList = useAppStore(s => s.showChatList);
  return (
    <ChatWindowStyled $showChatList={showChatList} ref={chatWindowRef}>
      <Sidebar />
      {showChatList && <ChatList />}
      <Chat />
    </ChatWindowStyled>
  );
};

const AnimateChildWindowStyled = styled(motion.div)`
  height: 100%;
  width: 100%;
  position: absolute;
`;

const AnimateChildWindow: FC<PropsWithChildren> = props => {
  return (
    <AnimateChildWindowStyled
      initial={{ opacity: 0, backdropFilter: 'blur(4px)' }}
      animate={{ opacity: 1, backdropFilter: 'blur(4px)' }}
      exit={{ opacity: 0 }}
      transition={{ ease: 'linear' }}
    >
      {props.children}
    </AnimateChildWindowStyled>
  );
};

const AppWindow: FC = () => {
  const window = useAppStore(s => s.windowStack[s.windowStack.length - 1]);
  return (
    <AppWindowStyled>
      <AnimatePresence initial={false}>
        <AnimateChildWindowStyled>
          <ChatWindow />
        </AnimateChildWindowStyled>
        {window.type === 'SETTINGS_WINDOW' && (
          <SettingsNewWindow key='settings_new' />
        )}
        {window.type === 'LOGOUT_CONFIRM' && <PopupLogoutWindow key='logout' />}
        {window.type === 'CHANGE_PASSWORD' && (
          <ChangePasswordWindow key='change_password' />
        )}
        {window.type === 'CREATE_GROUP_WINDOW' && (
          <CreateGroupWindow key='create_group_window' />
        )}
        {window.type === 'CONFIRM_POPUP_DELETE_MESSAGE' && (
          <ConfirmDeleteMessagePopup
            messageId={window.messageId}
            key='confirm_delete_message'
          />
        )}
        {window.type === 'IMAGE_CARROUSEL_WINDOW' && (
          <ImageCarouselWindow
            imageSrcs={window.imageSrcs}
            key='image_carrousel_window'
          />
        )}
      </AnimatePresence>
    </AppWindowStyled>
  );
};

export default function App() {
  useToken();
  const fetchInitialData = useAppStore(s => s.fetchInitialData);

  useEffect(() => {
    fetchInitialData();
    askShowNotificationPermission();
    const onFocus = () => {
      // fetchInitialData();
    };
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
    };
  }, [fetchInitialData]);
  return <AppWindow />;
}
