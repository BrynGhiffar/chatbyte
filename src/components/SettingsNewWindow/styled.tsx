import styled, { css } from "styled-components";
import { FC, PropsWithChildren } from 'react';
import { color, commonCss, font } from "../Palette";
import { VerticalStackContainer } from "../common/StackContainer";
import { DivProps, DivWrapper } from "@/misc/types";
import { useColorConfig } from "@/store/AppStore/hooks";

type SC__SidebarContainerProps = {
    $backgroundColor: string;
};

export const SC__SidebarContainer = styled(VerticalStackContainer)<SC__SidebarContainerProps>`
    padding-top: 1rem;
    padding-bottom: 1rem;
    padding-right: 1rem;
    padding-left: 1rem;
    background-color: ${props => props.$backgroundColor};
    gap: 5px;
    align-items: normal;
`;

type SC__SidebarItemContainerProps = {
    $selected?: boolean,
    $focusBgColor?: string,
    $color: string,
}

export const SC__SidebarItemContainer = styled.div<SC__SidebarItemContainerProps>`
    ${commonCss.transition}
    color: ${props => props.$color};
    border-radius: 5px;
    font-family: ${font.appleFont};
    font-size: 1.2rem;
    font-weight: 600;
    height: 2.3rem;
    padding-left: 0.3rem;
    display: flex;
    align-items: center;
    text-align: end;
    cursor: pointer;

    ${
        props => props.$selected ? css`background-color: ${props.$focusBgColor};` : ''
    }

    :hover {
        background-color: ${props => props.$focusBgColor};
    }
`;

export type TH__SidebarItemContainerProps = PropsWithChildren<DivProps & {
    $selected?: boolean,
    $focusBgColor?: string
}>

export const TH__SidebarItemContainer: FC<TH__SidebarItemContainerProps> = ({ 
    children, 
    $selected, 
    $focusBgColor, 
    ...props
}) => {
    const color = useColorConfig().settings.sidebarItemColor;
    return (
        <SC__SidebarItemContainer
            $color={color}
            $selected={$selected}
            $focusBgColor={$focusBgColor}
            {...props}
        >
            {children}
        </SC__SidebarItemContainer>
    )
}

export type TH__SidebarContainerProps = PropsWithChildren<DivProps & {
    $gap?: number
}>;

export const TH__SidebarContainer: FC<TH__SidebarContainerProps> = ({ children, $gap, ...props}) => {
    const backgroundColor = useColorConfig().settings.sidebarBackgroundColor;
    return (
        <SC__SidebarContainer
            $backgroundColor={backgroundColor}
            $gap={$gap}
            {...props}
        >
            {children}
        </SC__SidebarContainer>
    )
}