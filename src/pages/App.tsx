import styled from "styled-components";
import { color } from "../components/Palette";
import { ApplicationContext } from "../contexts/ApplicationContext";
import ChatList from "../components/ChatList/ChatList";
import Chat from "../components/Chat/Chat";

const device = {
  laptop: "(max-width: 1000px)"
}

const AppWindow = styled.div`
  min-height: 800px; 
  height: 80vh;
  width: 70%;
  display: grid;
  grid-template-columns: 1fr 2fr;
  box-shadow: 0px 0px 20px 0px black;
  background-color: ${color.lightBlue};
  border-radius: 5px;
  overflow: hidden;

  @media ${device.laptop} {
    width: 90%;
  }

`;

export default function App() {
  return (
    <ApplicationContext>
      <AppWindow>
        <ChatList/>
        <Chat />
      </AppWindow>
    </ApplicationContext>
  )
}