import { FC } from 'react';

import { VerticalStackContainer } from '@components/common/StackContainer';
import { CloseSVG } from '@components/common/Svg';

import styled from 'styled-components';

const SessionTitle = styled.h1`
  padding-left: 1rem;
  padding-bottom: 1rem;
`;

const SessionListItemTitle = styled.h2`
  width: 90%;
  font-weight: normal;
  font-size: 1rem;
  border-bottom: 1px solid #ededed;
  padding-bottom: 0.2rem;
`;

const SessionListItemContainer = styled.div`
  border: 1px solid #ededed;
  width: 85%;
  display: grid;
  grid-template-columns: auto 30px;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  border-radius: 7px;
`;

const SessionListItemLeftContainer = styled.div`
  display: grid;
`;

const SessionListItemRightContainer = styled.div`
  /* outline: 1px solid red; */
  display: flex;
  align-items: center;
  justify-content: center;
  > svg {
    width: 20px;
    cursor: pointer;
  }
`;

type SessionListItemProps = {
  hideCloseButton?: boolean;
  onClose?: () => void;
};

const SessionListItem: FC<SessionListItemProps> = props => {
  return (
    <SessionListItemContainer>
      <SessionListItemLeftContainer>
        <strong>Windows</strong>
        <p>Jakarta, Indonesia - 1 hour ago</p>
      </SessionListItemLeftContainer>
      <SessionListItemRightContainer onClick={props.onClose}>
        {!props.hideCloseButton && <CloseSVG />}
      </SessionListItemRightContainer>
    </SessionListItemContainer>
  );
};

export const SessionSettings: FC = () => {
  return (
    <>
      <SessionTitle>Session</SessionTitle>
      <VerticalStackContainer $gap={10}>
        <SessionListItemTitle>Current Session</SessionListItemTitle>
        <SessionListItem hideCloseButton />
        <SessionListItemTitle>Other Sessions</SessionListItemTitle>
        <SessionListItem />
        <SessionListItem />
        <SessionListItem />
      </VerticalStackContainer>
    </>
  );
};
