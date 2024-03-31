import { font } from '@components/Palette';
import {
  GenericBottomPopupButton,
  TH__GenericPopupContainer,
} from '@components/common/new/Popup';

import styled from 'styled-components';

export const PopupTopHalf = styled.div`
  display: flex;
  justify-content: center;
  background-color: transparent;
  align-items: center;
  font-family: ${font.appleFont};
  font-size: 1.5rem;
`;

export const PopupBottomHalf = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  background-color: transparent;
`;

export const PopupButton = GenericBottomPopupButton;

export const PopupContainer = styled(TH__GenericPopupContainer)`
  height: 18vh;
  width: 300px;
  display: grid;
  grid-template-rows: 2fr 1fr;
`;

export const LogoutButton = styled(PopupButton)`
  :hover {
    background-color: #ff0000;
    color: white;
  }
`;
