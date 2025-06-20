import { FC, PropsWithChildren } from 'react';

import { commonCss, font } from '@/components/Palette';
import { useColorConfig } from '@/store/AppStore/hooks';

import styled from 'styled-components';

type SC__ChatListContainerProps = {
  $borderLeftColor: string;
  $backgroundColor: string;
};

export const TH__ChatListContactContainer: FC<PropsWithChildren> = props => {
  // const colorConfig = ;
  const backgroundColor = useColorConfig().chatListBackgroundColor;
  const borderLeftColor = useColorConfig().chatListBorderLeftColor;
  return (
    <SC__ChatListContactContainer
      $backgroundColor={backgroundColor}
      $borderLeftColor={borderLeftColor}
    >
      {props.children}
    </SC__ChatListContactContainer>
  );
};

const SC__ChatListContactContainer = styled.div<SC__ChatListContainerProps>`
  background-color: ${props => props.$backgroundColor};
  /* border-right: 1px solid ${props => props.$borderLeftColor}; */
  font-family: ${font.appleFont};
  overflow-x: hidden;
  overflow-y: scroll;
  ${commonCss.scrollableCss}
`;

type SC__ChatListWindowProps = {
  $width: number;
};

export const SC__ChatListWindow = styled.div<SC__ChatListWindowProps>`
  display: grid;
  /* grid-template-rows: 4rem 1fr; */
  height: 100vh;
  width: ${props => props.$width}px;
`;

type SC__ChatListSeparatorProps = {
  $backgroundColor: string;
  $borderColor: string;
};

export const SC__ChatListSeparator = styled.div<SC__ChatListSeparatorProps>`
  background-color: ${props => props.$backgroundColor};
  border-right: 1px solid ${props => props.$borderColor};
  width: 8px;
  cursor: ew-resize;
`;

export const SC__ChatListContainer = styled.div`
  display: flex;
`;
