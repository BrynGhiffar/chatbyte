import styled from "styled-components";
import { color, colorConfig, font } from "@/components/Palette";
import { ProfilePicture } from "@/components/common/ProfilePicture";
import { FC } from "react";
import { useAvatarImage } from "@/utility/UtilityHooks";
import { useSelectedContact } from "@/store/AppStore/hooks";

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
    color: ${color.white};
    font-size: 1rem;
    font-weight: bold;
`;

const ChatNavigation: FC = () => {
  const contact = useSelectedContact();
  const name = contact?.name;
  const uid = contact?.id ?? null;
  const type = contact?.type ?? "DIRECT"
  const [avatarImage] = useAvatarImage(uid ?? null, type);
  return (
    <ChatNavigationStyled>
      <ProfilePicture imageUrl={avatarImage}/>
      <ChatNavigationNameStyled>{name}</ChatNavigationNameStyled>
    </ChatNavigationStyled>
  );
};

export default ChatNavigation;