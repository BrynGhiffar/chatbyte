import { FC } from "react";
import styled from "styled-components";

const ProfilePicContainer = styled.div<{ $width?: number, imageUrl: string }>`
  width: ${props => props.$width ?? 50}px;
  aspect-ratio: 1 / 1;
  object-fit: contain;
  object-position: center;
  img {
    width: ${props => props.$width ?? 50}px;
    /* aspect-ratio: 1 / 1; */
  }
  background-size: ${props => props.$width ?? 50}px auto;
    background-image: url(${props => props.imageUrl});
    background-repeat: no-repeat;
    background-position: center;
  position: relative;
  border-radius: 50%;
  overflow: hidden;
`;


type ProfilePictureProps = {
  width?: number;
  imageUrl: string;
};

export const ProfilePicture: FC<ProfilePictureProps> = (props) => {
  return (<ProfilePicContainer $width={props.width} imageUrl={props.imageUrl}>
  </ProfilePicContainer>)
};
