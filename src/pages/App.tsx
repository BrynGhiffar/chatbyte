import styled from "styled-components";
import { color } from "../components/Palette";
import { ApplicationContext } from "../contexts/ApplicationContext";
import ChatList from "../components/ChatList/ChatList";
import Chat from "../components/Chat/Chat";
import { FC, PropsWithChildren, useCallback, useContext, useState } from "react";
import { SettingsWindow } from "@/components/Settings/SettingsWindow";
import { Window, WindowContext } from "@/contexts/WindowContext";
import { motion, AnimatePresence } from "framer-motion";

const device = {
  laptop: "(max-width: 1000px)"
}

const AppWindowStyled = styled.div`
  min-height: 90vh; 
  height: 100vh;
  width: 100vw;
  /* box-shadow: 0px 0px 20px 0px black; */
  background-color: ${color.lightBlue};
  /* border-radius: 5px; */
  overflow: hidden;
  position: relative;
`;

const ChatWindowStyled = styled.div`
  height: 100%;
  width: 100%;
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
      initial={{opacity: 0, scale: 0.8 }}
      animate={{opacity: 1, scale: 1}}
      exit={{opacity: 0, scale: 0.8}}
      transition={{ ease: "easeInOut", }}
    >
      {props.children}
    </AnimateChildWindowStyled>
  )
};

const WindowContextProvider: FC<PropsWithChildren> = (props) => {
  const [windowStack, setWindowStack] = useState<Window[]>([ "CHAT_WINDOW" ]);
  const push = useCallback((window: Window) => {
    setWindowStack(s => [...s, window]);
  }, [setWindowStack]);
  const pop = useCallback(() => {
    setWindowStack(s => {
      if (s.length >= 2) {
        return s.slice(0, s.length - 1);
      }
      return s;
    });
  }, [setWindowStack]);

  const top = windowStack[windowStack.length - 1];
  return (
    <WindowContext.Provider value={{ windowStack, pop, push, top }}>
      {props.children}
    </WindowContext.Provider>
  )
};

const AppWindow: FC = () => {
  const { top } = useContext(WindowContext);
  return (
    <AppWindowStyled>
      <AnimatePresence initial={false}>
        <AnimateChildWindowStyled>
            <ChatWindow/>
        </AnimateChildWindowStyled>
        { 
          top === "SETTINGS_WINDOW" && (
            <AnimateChildWindow key="settings">
              <SettingsWindow/>
            </AnimateChildWindow>
          )
        }
      </AnimatePresence>
    </AppWindowStyled>
  );
}

export default function App() {
  return (
    <ApplicationContext>
      <WindowContextProvider >
        <AppWindow/>
      </WindowContextProvider>
    </ApplicationContext>
  )
}