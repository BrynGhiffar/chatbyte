import { FC } from "react";
import styled from "styled-components";
import { commonCss } from "../Palette";

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
  /* outline: 1px solid red; */
  /* overflow: hidden; */
`;


type ProfilePictureProps = {
  width?: number;
  imageUrl: string;

};

type Status = "online" | "offline"

type StatusSymbolProps = {
  $status: Status,
  $outlineColor: string,
}

const StatusSymbol = styled.div<StatusSymbolProps>`
  ${commonCss.transition}
  position: absolute;
  bottom: 0px;
  right: 0px;
  height: 15px;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  background-color: ${props => props.$status === "online" ? '#229f56' : 'gray'};
  border: 3px solid ${props => props.$outlineColor};
`

export const ProfilePicture: FC<ProfilePictureProps> = (props) => {
  return (<ProfilePicContainer $width={props.width} imageUrl={props.imageUrl}>
  </ProfilePicContainer>)
};

type ProfilePictureWithStatus = {
  width?: number;
  imageUrl: string;
  statusOutlineColor: string;
  online: boolean;
}

export const ProfilePictureWithStatus: FC<ProfilePictureWithStatus> = props => {
  const online = props.online;
  return (<ProfilePicContainer $width={props.width} imageUrl={props.imageUrl}>
    <StatusSymbol $status={online ? "online" : "offline"} $outlineColor={props.statusOutlineColor}/>
  </ProfilePicContainer>)
}