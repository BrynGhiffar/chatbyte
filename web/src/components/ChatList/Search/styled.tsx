import { font } from '@/components/Palette';
import { DivWrapper, InputWrapper } from '@/misc/types';
import { useColorConfig } from '@/store/AppStore/hooks';

import styled from 'styled-components';

type SC__SearchContainerProps = {
  $backgroundColor: string;
};

export const SC__SearchContainer = styled.div<SC__SearchContainerProps>`
  background-color: ${props => props.$backgroundColor};
  padding: 10px 0px 10px 0px;
  overflow: hidden;
  display: grid;
  justify-content: center;
  align-items: center;
  /* grid-template-rows: 1fr 1fr; */
  grid-template-columns: 98%;
`;

const SC__SearchTitle = styled.div`
  color: white;
  font-weight: bold;
  font-size: 1.7rem;
  height: 100%;
  display: flex;
  align-items: end;
  font-family: ${font.appleFont};
`;

type SC__SearchInputProps = {
  $borderColor: string;
  $backgroundColor: string;
  $color: string;
};

export const SC__SearchInput = styled.input<SC__SearchInputProps>`
  border: none;
  outline: none;
  display: block;
  border-radius: 4px;
  font-size: 1rem;
  padding: 0.5rem 0.3rem;
  border: 1px solid ${props => props.$borderColor};
  background-color: ${props => props.$backgroundColor};
  color: ${props => props.$color};
  /* box-shadow: 0px 0px 8px 0.5px black; */
`;

export const TH__SearchContainer: DivWrapper = ({ children, ...rest }) => {
  const backgroundColor = useColorConfig().chatListNavSearchBackgroundColor;

  return (
    <SC__SearchContainer $backgroundColor={backgroundColor} {...rest}>
      {children}
    </SC__SearchContainer>
  );
};

export const TH__SearchInput: InputWrapper = ({ children, ...rest }) => {
  const borderColor = useColorConfig().chatListNavSearchBorderColor;
  const backgroundColor =
    useColorConfig().chatListNavSearchInnerBackgroundColor;
  const color = useColorConfig().chatListNavSearchTextColor;
  return (
    <SC__SearchInput
      $borderColor={borderColor}
      $backgroundColor={backgroundColor}
      $color={color}
      {...rest}
    >
      {children}
    </SC__SearchInput>
  );
};
