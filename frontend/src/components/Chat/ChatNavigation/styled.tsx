import { font } from '@/components/Palette';
import { DivWrapper, SpanWrapper } from '@/misc/types';
import { useColorConfig } from '@/store/AppStore/hooks';

import styled from 'styled-components';

type SC__ChatNavigationProps = {
  $backgroundColor: string;
};

export const SC__ChatNavigation = styled.div<SC__ChatNavigationProps>`
  width: 100%;
  background-color: ${props => props.$backgroundColor};
  display: grid;
  grid-template-columns: 50px 1fr;
  align-items: center;
  padding-left: 1rem;
  gap: 1rem;
`;

type SC__ChatNavigationNameProps = {
  $color: string;
};

export const SC__ChatNavigationName = styled.span<SC__ChatNavigationNameProps>`
  font-family: ${font.appleFont};
  color: ${props => props.$color};
  font-size: 1rem;
  font-weight: bold;
`;

export const TH__ChatNavigation: DivWrapper = ({ children, ...props }) => {
  const backgroundColor = useColorConfig().chatNavBackgroundColor;
  return (
    <SC__ChatNavigation $backgroundColor={backgroundColor} {...props}>
      {children}
    </SC__ChatNavigation>
  );
};

export const TH__ChatNavigationName: SpanWrapper = ({ children, ...props }) => {
  const color = useColorConfig().chatNavTextColor;
  return (
    <SC__ChatNavigationName $color={color}>{children}</SC__ChatNavigationName>
  );
};
