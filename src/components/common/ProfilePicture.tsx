import { FC } from "react";
import styled from "styled-components";

const ProfilePicContainer = styled.div<{ $width?: number }>`
  width: ${props => props.$width ?? 50}px;
  aspect-ratio: 1 / 1;
  object-fit: contain;
  position: relative;
  border-radius: 50%;
  overflow: hidden;
`;


type ProfilePictureProps = {
  width?: number;
};

export const ProfilePicture: FC<ProfilePictureProps> = (props) => {
  const imageUrl = "/profile.png";
  return (<ProfilePicContainer $width={props.width}>
      <img src={imageUrl} alt=""/>
  </ProfilePicContainer>)
};
