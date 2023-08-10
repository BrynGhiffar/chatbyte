import { FC } from "react";
import styled from "styled-components";

const ProfilePicContainer = styled.div<{ $width?: number }>`
  width: ${props => props.$width ?? 50}px;
  aspect-ratio: 1 / 1;
  object-fit: contain;
  object-position: center;
  img {
    width: ${props => props.$width ?? 50}px;
    /* aspect-ratio: 1 / 1; */
  }
  position: relative;
  border-radius: 50%;
  overflow: hidden;
`;


type ProfilePictureProps = {
  width?: number;
  imageUrl: string;
};

export const ProfilePicture: FC<ProfilePictureProps> = (props) => {
  return (<ProfilePicContainer $width={props.width}>
      <img src={props.imageUrl} alt=""/>
  </ProfilePicContainer>)
};
