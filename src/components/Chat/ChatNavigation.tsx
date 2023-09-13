import styled from "styled-components";
import { color, colorConfig, font } from "@/components/Palette";
import { ProfilePicture } from "@/components/common/ProfilePicture";
import { FC } from "react";
import { useAvatarImage, useChatListContext, useCurrentContactUid } from "@/utility/UtilityHooks";
import { avatarImageUrl } from "@/service/api/UserService";

export const ChatNavigationStyled = styled.div`
  width: 100%;
  background-color: ${colorConfig.chatNavBackgroundColor};
  display: grid;
  grid-template-columns: 50px 1fr;
  align-items: center;
  padding-left: 1rem;
  gap: 1rem;
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
  const uid = useCurrentContactUid();
  const [avatarImage] = useAvatarImage(uid);
  return (
    <ChatNavigationStyled>
      <ProfilePicture imageUrl={avatarImage}/>
      <ChatNavigationNameStyled>{name}</ChatNavigationNameStyled>
    </ChatNavigationStyled>
  );
};

export default ChatNavigation;