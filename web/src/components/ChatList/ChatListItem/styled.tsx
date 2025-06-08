import { FC, PropsWithChildren } from 'react';

import { commonCss } from '@/components/Palette';
import { DivProps } from '@/misc/types';
import { useColorConfig } from '@/store/AppStore/hooks';

import styled from 'styled-components';

type SC__ChatListItemContainerProps = {
  $selected: boolean;
  $backgroundSelectedColor: string;
  $color: string;
  $hoverBackgroundColor: string;
};

const SC__ChatListItemContainer = styled.div<SC__ChatListItemContainerProps>`
  ${commonCss.transition}
  height: 80px;
  background-color: ${props =>
    props.$selected ? props.$backgroundSelectedColor : 'transparent'};
  color: ${props => props.$color};
  display: grid;
  grid-template-columns: 60px 1fr;
  align-items: center;
  gap: 0.9rem;
  padding-left: 0.5rem;
  cursor: pointer;
  user-select: none;

  :hover {
    background-color: ${props => props.$hoverBackgroundColor};
  }

  > * {
    height: 60px;
  }
`;

type TH__ChatListItemContainerProps = DivProps & {
  $selected: boolean;
};

export const TH__ChatListItemContainer: FC<
  PropsWithChildren<TH__ChatListItemContainerProps>
> = ({ $selected, children, ...rest }) => {
  const colorConfig = useColorConfig();
  const color = colorConfig.chatListTextColor;
  const backgroundSelectedColor = colorConfig.chatListItemSelectedColor;
  const hoverBackgroundColor = colorConfig.chatListItemHoverColor;
  return (
    <SC__ChatListItemContainer
      $hoverBackgroundColor={hoverBackgroundColor}
      $backgroundSelectedColor={backgroundSelectedColor}
      $color={color}
      $selected={$selected}
      {...rest}
    >
      {children}
    </SC__ChatListItemContainer>
  );
};
