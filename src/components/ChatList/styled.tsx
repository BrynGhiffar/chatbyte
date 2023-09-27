import styled from "styled-components";
import { colorConfig, commonCss, font } from "@/components/Palette";
import { useColorConfig } from "@/store/AppStore/hooks";
import { FC, PropsWithChildren } from "react";

type SC__ChatListContainerProps = {
  $borderLeftColor: string;
  $backgroundColor: string;
}

const SC__ChatListContainer = styled.div<SC__ChatListContainerProps>`
  transition: all 200ms ease-in-out;
  border-right: 1px solid ${props => props.$borderLeftColor};
  font-family: ${font.appleFont};
  overflow-x: hidden;
  overflow-y: scroll;
  background-color: ${props => props.$backgroundColor};
  ${commonCss.scrollableCss}
`;

export const SC__ChatListWindow = styled.div`
  display: grid;
  grid-template-rows: 4rem 1fr;
  height: 100vh;
`;


export const TH__ChatListContainer: FC<PropsWithChildren> = props => {
  const colorConfig = useColorConfig();
  const borderLeftColor = colorConfig.chatListBorderLeftColor;
  const backgroundColor = colorConfig.chatListBackgroundColor;
  return <SC__ChatListContainer
    $backgroundColor={backgroundColor}
    $borderLeftColor={borderLeftColor}
  >{props.children}</SC__ChatListContainer>
}
