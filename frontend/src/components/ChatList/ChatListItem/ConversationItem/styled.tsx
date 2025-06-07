import { color } from '@/components/Palette';

import styled from 'styled-components';

export const SC__Description = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr 1fr;
  padding-right: 1rem;
`;

export const SC__AlignCenterSpan = styled.span`
  display: flex;
  align-items: center;
`;

export const SC__AlignCenterEndSpan = styled(SC__AlignCenterSpan)`
  justify-content: end;
`;

export const SC__DescriptionName = styled(SC__AlignCenterSpan)`
  font-weight: bold;
`;

export const SC__DescriptionTime = styled(SC__AlignCenterEndSpan)``;

export const SC__DescriptionMessage = SC__AlignCenterSpan;

export const SC__DescriptionNotification = SC__AlignCenterEndSpan;

export const SC__DescriptionNotificationIcon = styled.div`
  height: 1.3rem;
  aspect-ratio: 1 / 1;
  background-color: ${color.seaGreen};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
`;
