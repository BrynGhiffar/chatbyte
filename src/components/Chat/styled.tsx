import { DivProps } from "@/misc/types";
import { useColorConfig } from "@/store/AppStore/hooks";
import { FC, PropsWithChildren } from 'react';
import styled, { css } from "styled-components";

type SC__ChatWindowProps = {
    $backgroundColor: string;
    $highlight: boolean;
}

export const SC__ChatWindow = styled.div<SC__ChatWindowProps>`
    display: grid;
    grid-template-rows: 4rem 1fr auto;
    overflow: hidden;
    background-color: ${props => props.$backgroundColor};
    position: relative;
    ${
        props => props.$highlight ? css`
            border: 3px solid #3d72ff;
            /* filter: blur(4px); */
        ` : ""
    }
`;

type TH__ChatWindowProps = PropsWithChildren<{
    highlight: boolean;
} & DivProps>;

type TH__ChatWindow = FC<TH__ChatWindowProps>;

export const TH__ChatWindow: TH__ChatWindow = ({ children, highlight, ...props }) => {
    const backgroundColor = useColorConfig().chatGridBackgroundColor;
    return (
        <SC__ChatWindow
            $highlight={highlight}
            $backgroundColor={backgroundColor}
            {...props}
        >
            {children}
        </SC__ChatWindow>
    )
}
