import { ButtonWrapper, DivWrapper } from '@/misc/types';
import { useColorConfig } from '@/store/AppStore/hooks';

import { commonCss } from '@components/Palette';

import styled from 'styled-components';

const SC__SidebarContainer = styled.div<{ $backgroundColor: string }>`
  background-color: ${props => props.$backgroundColor};
  display: grid;
  grid-template-rows: 1fr 1fr;
  justify-content: center;
  padding-top: 1rem;
  padding-bottom: 2rem;
`;

const SC__SidebarContainerTop = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const SC__SidebarContainerBottom = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column-reverse;
`;

const SC__SidebarButton = styled.button<{ $hoverBackgroundColor: string }>`
  outline: none;
  border: none;
  ${commonCss.transition}
  border-radius: 4px;
  height: 35px;
  padding: 5px;
  aspect-ratio: 1 / 1;
  background-color: transparent;
  cursor: pointer;
  :hover {
    background-color: ${props => props.$hoverBackgroundColor};
  }
  > svg {
    color: white;
  }
`;

export const TH__SidebarContainer: DivWrapper = ({ children, ...props }) => {
  const backgroundColor = useColorConfig().sidebar.backgroundColor;
  return (
    <SC__SidebarContainer $backgroundColor={backgroundColor} {...props}>
      {children}
    </SC__SidebarContainer>
  );
};

export const TH__SidebarContainerTop: DivWrapper = ({ children, ...props }) => {
  return (
    <SC__SidebarContainerTop {...props}>{children}</SC__SidebarContainerTop>
  );
};

export const TH__SidebarContainerBottom: DivWrapper = ({
  children,
  ...props
}) => {
  return (
    <SC__SidebarContainerBottom {...props}>
      {children}
    </SC__SidebarContainerBottom>
  );
};

export const TH__SidebarButton: ButtonWrapper = ({ children, ...props }) => {
  const hoverBackgroundColor =
    useColorConfig().sidebar.buttonBackgroundHoverColor;
  return (
    <SC__SidebarButton $hoverBackgroundColor={hoverBackgroundColor} {...props}>
      {children}
    </SC__SidebarButton>
  );
};
