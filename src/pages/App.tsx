import styled from "styled-components";
import { color } from "../components/Palette";
import { ApplicationContext } from "../contexts/ApplicationContext";
import ChatList from "../components/ChatList/ChatList";
import Chat from "../components/Chat/Chat";


const AppWindow = styled.div`
  height: 80vh;
  width: 70%;
  display: grid;
  grid-template-columns: 1fr 2fr;
  box-shadow: 0px 0px 20px 0px black;
  background-color: ${color.lightBlue};
  border-radius: 5px;
  overflow: hidden;
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