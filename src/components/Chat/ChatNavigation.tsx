import styled from "styled-components";
import { color, font } from "@/components/Palette";
import { ProfilePicture } from "@/components/common/ProfilePicture";
import { FC } from "react";
import { useChatListContext } from "@/contexts/ApplicationContext";

export const ChatNavigationStyled = styled.div`
  width: 100%;
  background-color: ${color.darkBlue};
  display: grid;
  grid-template-columns: 50px 1fr;
  align-items: center;
  padding-left: 1rem;
  gap: 1rem;
  border-bottom: 1px solid black;
`;

const ChatNavigationNameStyled = styled.span`
    font-family: ${font.appleFont};
    color: ${color.kindaWhite};
    font-size: 1rem;
    font-weight: bold;
`;

const useChatProfileName = ( )=> {
  const { state } = useChatListContext();
  return state.selectedContact?.name;
}

const ChatNavigation: FC = () => {
  const name = useChatProfileName();
  return (
    <ChatNavigationStyled>
      <ProfilePicture/>
      <ChatNavigationNameStyled>{name}</ChatNavigationNameStyled>
    </ChatNavigationStyled>
  );
};

export default ChatNavigation;