import { FC, PropsWithChildren } from 'react';

import { commonCss, font } from '@/components/Palette';
import { useColorConfig } from '@/store/AppStore/hooks';

import styled from 'styled-components';

type SC__ChatListContainerProps = {
  $borderLeftColor: string;
  $backgroundColor: string;
};

export const TH__ChatListContainer: FC<PropsWithChildren> = props => {
  // const colorConfig = ;
  const backgroundColor = useColorConfig().chatListBackgroundColor;
  const borderLeftColor = useColorConfig().chatListBorderLeftColor;
  return (
    <SC__ChatListContainer
      $backgroundColor={backgroundColor}
      $borderLeftColor={borderLeftColor}
    >
      {props.children}
    </SC__ChatListContainer>
  );
};

const SC__ChatListContainer = styled.div<SC__ChatListContainerProps>`
  background-color: ${props => props.$backgroundColor};
  border-right: 1px solid ${props => props.$borderLeftColor};
  font-family: ${font.appleFont};
  overflow-x: hidden;
  overflow-y: scroll;
  ${commonCss.scrollableCss}
`;

export const SC__ChatListWindow = styled.div`
  display: grid;
  /* grid-template-rows: 4rem 1fr; */
  height: 100vh;
`;
