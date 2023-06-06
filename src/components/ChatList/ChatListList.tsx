import styled from "styled-components";
import { commonCss, font } from "@/components/Palette";

const ChatListList = styled.div`
  transition: all 200ms ease-in-out;
  border-right: 1px solid black;
  font-family: ${font.appleFont};
  overflow-x: hidden;
  overflow-y: scroll;
  ${commonCss.scrollableCss}
`;

export default ChatListList;