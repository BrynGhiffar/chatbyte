import { DivWrapper } from '@/misc/types';
import { useColorConfig } from '@/store/AppStore/hooks';

import styled from 'styled-components';

type SC__SeparatorBlockProps = {
  $borderColor: string;
};

export const SC__SeparatorBlock = styled.div<SC__SeparatorBlockProps>`
  min-height: 40px;
  display: grid;
  grid-template-columns: 5fr 1fr;
  border-top: 1px solid ${props => props.$borderColor};
`;

type SC__SeparatorBlockTitleProps = {
  $color: string;
};

export const SC__SeparatorBlockTitle = styled.div<SC__SeparatorBlockTitleProps>`
  padding-left: 20px;
  font-weight: 600;
  color: ${props => props.$color};
  display: flex;
  align-items: center;
  height: 100%;
`;

type SC__SeparatorBlockAddContainerProps = {
  $color: string;
};

export const SC__SeparatorBlockAddContainer = styled.div<SC__SeparatorBlockAddContainerProps>`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 40px;
  > svg {
    cursor: pointer;
    height: 80%;
    color: ${props => props.$color};
  }
`;

export const TH__SeparatorBlock: DivWrapper = ({ children, ...rest }) => {
  const colorConfig = useColorConfig();
  const borderColor = colorConfig.chatListSeparatorBorderColor;
  return (
    <SC__SeparatorBlock $borderColor={borderColor} {...rest}>
      {children}
    </SC__SeparatorBlock>
  );
};

export const TH__SeparatorBlockTitle: DivWrapper = ({ children, ...rest }) => {
  const colorConfig = useColorConfig();
  const color = colorConfig.chatListSeparatorTextColor;
  return (
    <SC__SeparatorBlockTitle $color={color} {...rest}>
      {children}
    </SC__SeparatorBlockTitle>
  );
};

export const TH__SeparatorBlockAddContainer: DivWrapper = ({
  children,
  ...rest
}) => {
  const colorConfig = useColorConfig();
  const color = colorConfig.chatListSeparatorTextColor;
  return (
    <SC__SeparatorBlockAddContainer {...rest} $color={color}>
      {children}
    </SC__SeparatorBlockAddContainer>
  );
};
