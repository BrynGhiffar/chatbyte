import { commonCss, font } from '@/components/Palette';
import { DivWrapper } from '@/misc/types';
import { useColorConfig } from '@/store/AppStore/hooks';

import styled from 'styled-components';

type SC__GenericPopupContainerProps = {
  $backgroundColor: string;
  $borderColor: string;
};

export const SC__GenericPopupContainer = styled.div<SC__GenericPopupContainerProps>`
  background-color: ${props => props.$backgroundColor};
  outline: 1px solid ${props => props.$borderColor};
  border-radius: 10px;
  overflow: hidden;
  font-family: ${font.appleFont};
`;

export const GenericBottomPopupButton = styled.div`
  ${commonCss.transition}
  outline: 1px solid #ededed;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: ${font.appleFont};
  font-size: 1.2rem;
  cursor: pointer;
`;

export const TH__GenericPopupContainer: DivWrapper = ({
  children,
  ...props
}) => {
  const backgroundColor = useColorConfig().popup.backgroundColor;
  const borderColor = useColorConfig().popup.borderColor;
  return (
    <SC__GenericPopupContainer
      $backgroundColor={backgroundColor}
      $borderColor={borderColor}
      {...props}
    >
      {children}
    </SC__GenericPopupContainer>
  );
};
