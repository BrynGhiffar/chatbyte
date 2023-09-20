import { PropsWithChildren } from "react";
import styled from "styled-components";
import { color } from "../Palette";
import { SnackbarProvider } from "./Snackbar";
import Blur from "./Blur";

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: ${color.darkBlue};
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
