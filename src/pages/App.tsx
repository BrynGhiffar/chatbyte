import styled from "styled-components";
import { color } from "../components/Palette";
import { ApplicationContext } from "../contexts/ApplicationContext";
import ChatList from "../components/ChatList/ChatList";
import Chat from "../components/Chat/Chat";
import { FC, PropsWithChildren, useCallback, useContext, useState } from "react";
import { SettingsWindow } from "@/components/Settings/SettingsWindow";
import { Window, WindowContext } from "@/contexts/WindowContext";

const device = {
  laptop: "(max-width: 1000px)"
}

const AppWindowStyled = styled.div`
  min-height: 800px; 
  height: 80vh;
  width: 70%;
  box-shadow: 0px 0px 20px 0px black;
  background-color: ${color.lightBlue};
  border-radius: 5px;
  overflow: hidden;

  @media ${device.laptop} {
    width: 90%;
  }
`;

const ChatWindowStyled = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 2fr;
`;

const ChatWindow: FC = props => {
  return (
    <ChatWindowStyled>
      <ChatList />
      <Chat />
    </ChatWindowStyled>
  )
}

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
  const Window: FC = useCallback(() => {
    if (top === "CHAT_WINDOW") return <ChatWindow/>
    if (top === "SETTINGS_WINDOW") return <SettingsWindow/>
  }, [top]);
  return (
    <AppWindowStyled>
      <Window/>
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