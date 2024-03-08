import { PropsWithChildren } from "react";
import styled from "styled-components";
import { color } from "../Palette";
import { SnackbarProvider } from "../Snackbar";
import Blur from "./Blur";
import { DarkTheme } from "@/theme";

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
