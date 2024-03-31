import { color, commonCss } from '@/components/Palette';

import styled from 'styled-components';

export const Button = styled.button`
  ${commonCss.transition}
  border: none;
  outline: 1px solid #ededed;
  border-radius: 4px;
  width: 100%;
  cursor: pointer;
  background-color: white;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  :hover {
    background-color: ${color.chatBlue};
    color: white;
  }
`;
