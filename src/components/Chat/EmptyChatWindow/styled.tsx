import { DivWrapper } from '@/misc/types';
import { useColorConfig } from '@/store/AppStore/hooks';

import styled from 'styled-components';

type SC__EmptyChatWindowProps = {
  $backgroundColor: string;
};

const SC__EmptyChatWindow = styled.div<SC__EmptyChatWindowProps>`
  background: ${props => props.$backgroundColor};
  flex-grow: 1;
`;

export const TH__EmptyChatWindow: DivWrapper = ({ children, ...props }) => {
  const backgroundColor = useColorConfig().chatEmptyBackgroundColor;
  return (
    <SC__EmptyChatWindow $backgroundColor={backgroundColor} {...props}>
      {children}
    </SC__EmptyChatWindow>
  );
};
