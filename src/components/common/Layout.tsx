import { DarkTheme } from "@/theme";
import { PropsWithChildren } from "react";
import styled from "styled-components";
import { SnackbarProvider } from "../Snackbar";

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: ${DarkTheme.config.chatNavBackgroundColor};
  width: 100vw;
  height: 100vh;
`;

export function Layout({ children }: PropsWithChildren) {
    return (
        <PageWrapper>
                <SnackbarProvider>
                    {children}
                </SnackbarProvider>
        </PageWrapper>
    )
}
