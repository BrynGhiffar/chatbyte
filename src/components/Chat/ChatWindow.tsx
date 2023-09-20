import styled from "styled-components";
import { colorConfig } from "../Palette";

const ChatWindow = styled.div`
    display: grid;
    grid-template-rows: 4rem 1fr 3.5rem;
    overflow: hidden;
    background-color: ${colorConfig.chatGridBackgroundColor};
    /* visibility: hidden; */
`;

export default ChatWindow;