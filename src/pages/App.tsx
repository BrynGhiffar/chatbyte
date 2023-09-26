import styled from "styled-components";
import { color } from "../components/Palette";
import { ApplicationContext } from "../contexts/ApplicationContext";
import ChatList from "../components/ChatList/ChatList";
import Chat from "../components/Chat/Chat";
import { FC, PropsWithChildren } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PopupLogoutWindow } from "@/components/PopupLogout/PopupWindow";
import SettingsNewWindow from "@/components/SettingsNewWindow/SettingsNewWindow";
import { ChangePasswordWindow } from "@/components/ChangePasswordWindow/ChangePasswordWindow";
import { CreateGroupWindow } from "@/components/CreateGroupWindow/CreateGroupWindow";
import { useAppStore } from "@/store/AppStore/store";
import { BlurBackgroundCover } from "@/components/common/BackgroundBlurCover";
import { CenterContainer } from "@/components/common/StackContainer";

const AppWindowStyled = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: ${color.lightBlue};
  position: relative;
`;

const ChatWindowStyled = styled.div`
  height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-columns: 30vw auto;
`;

const ChatWindow: FC = props => {
  return (
    <ChatWindowStyled>
      <ChatList />
      <Chat />
    </ChatWindowStyled>
  )
};

const AnimateChildWindowStyled = styled(motion.div)`
  height: 100%;
  width: 100%;
  position: absolute;
`;

const AnimateChildWindow: FC<PropsWithChildren> = props => {
  return (
    <AnimateChildWindowStyled
      initial={{opacity: 0, backdropFilter: 'blur(4px)' }}
      animate={{opacity: 1, backdropFilter: 'blur(4px)'}}
      exit={{opacity: 0}}
      transition={{ ease: "linear", }}
    >
      {props.children}
    </AnimateChildWindowStyled>
  )
};

const AppWindow: FC = () => {
  const top = useAppStore(s => s.windowStack[s.windowStack.length - 1]);
  return (
    <AppWindowStyled>
      <AnimatePresence initial={false}>
        <AnimateChildWindowStyled>
            <ChatWindow/>
        </AnimateChildWindowStyled>
        { 
          top === "SETTINGS_WINDOW" && (
            <SettingsNewWindow
              key="settings_new"
            />
          )
        }
        {
          top === "LOGOUT_CONFIRM" && (
              <PopupLogoutWindow

              />
          )
        }
        {
          top === "CHANGE_PASSWORD" && (
            <ChangePasswordWindow
              key="change_password"
            />
          )
        }
        {
          top === "CREATE_GROUP_WINDOW" && (
            <CreateGroupWindow
              key="create_group_window"
            />
          )
        }
      </AnimatePresence>
    </AppWindowStyled>
  );
}

export default function App() {
  return (
    <ApplicationContext>
        <AppWindow/>
    </ApplicationContext>
  )
}