import { PropsWithChildren } from 'react';

import { DarkTheme } from '@/theme';

import { SnackbarProvider } from '@components/Snackbar';

import styled from 'styled-components';

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: ${DarkTheme.config.chatEmptyBackgroundColor};
  background-image: url('/bytes-wallpaper.png');
  width: 100vw;
  height: 100vh;
`;

export function Layout({ children }: PropsWithChildren) {
  return (
    <PageWrapper>
      <SnackbarProvider>{children}</SnackbarProvider>
    </PageWrapper>
  );
}
