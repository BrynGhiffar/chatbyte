import { FC, PropsWithChildren } from 'react';

import { commonCss, font } from '@/components/Palette';
import { DivProps, DivWrapper } from '@/misc/types';
import { useColorConfig } from '@/store/AppStore/hooks';

import styled from 'styled-components';

type SC__ChatListProfileContainerProps = {
  $backgroundColor: string;
};

export const SC__ChatListProfileContainer = styled.div<SC__ChatListProfileContainerProps>`
  width: 100%;
  background-color: ${props => props.$backgroundColor};
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

export const SC__ProfileDetailContainer = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 50px 1fr;
  align-items: center;
  padding-left: 1rem;
  gap: 1rem;
`;

export const SC__ProfileDetailControlsContainer = styled.div`
  height: 100%;
  display: grid;
  justify-content: flex-end;
  align-items: center;
  padding-right: 15px;
`;

type SC__ChatListProfileMoreButtonProps = {
  $clicked?: boolean;
  $hoverBackgroundColor: string;
};

export const SC__ChatListProfileMoreButton = styled.div<SC__ChatListProfileMoreButtonProps>`
  position: relative;
  ${commonCss.transition}
  height: 25px;
  aspect-ratio: 1 / 1;
  cursor: pointer;
  border-radius: 5px;
  /* background-color: transparent; */
  /* background-color: ${props =>
    props.$clicked ? '#2a4fb2' : 'transparent'}; */
  :hover {
    background-color: ${props => props.$hoverBackgroundColor};
  }
  > svg {
    color: white;
  }
`;

type SC__ChatListProfileNameProps = {
  $color: string;
};

const SC__ChatListProfileName = styled.span<SC__ChatListProfileNameProps>`
  font-family: ${font.appleFont};
  color: ${props => props.$color};
  font-size: 1rem;
  font-weight: bold;
`;

export const TH__ChatListProfileContainer: DivWrapper = ({
  children,
  ...props
}) => {
  const backgroundColor = useColorConfig().chatNavBackgroundColor;
  return (
    <SC__ChatListProfileContainer $backgroundColor={backgroundColor} {...props}>
      {children}
    </SC__ChatListProfileContainer>
  );
};

export const TH__ChatListProfileName: DivWrapper = ({ children, ...props }) => {
  const color = useColorConfig().chatListNavProfileTextColor;
  return (
    <SC__ChatListProfileName $color={color} {...props}>
      {children}
    </SC__ChatListProfileName>
  );
};

type TH__ChatListProfileMoreButtonProps = PropsWithChildren<
  DivProps & {
    $clicked?: boolean;
  }
>;

export const TH__ChatListProfileMoreButton: FC<
  TH__ChatListProfileMoreButtonProps
> = ({ children, $clicked, ...props }) => {
  const hoverBackgroundColor =
    useColorConfig().chatListNavProfileMoreButtonHoverBackgroundColor;
  return (
    <SC__ChatListProfileMoreButton
      $clicked={$clicked}
      $hoverBackgroundColor={hoverBackgroundColor}
      {...props}
    >
      {children}
    </SC__ChatListProfileMoreButton>
  );
};
