import styled, { css } from "styled-components";
import { color, commonCss, font } from "../Palette";
import { VerticalStackContainer } from "../common/StackContainer";

export const SidebarContainer = styled(VerticalStackContainer)`
    padding-top: 1rem;
    padding-bottom: 1rem;
    padding-right: 1rem;
    padding-left: 1rem;
    background-color: ${color.chatBlue};
    gap: 5px;
    align-items: normal;
`;


export const SidebarItemContainer = styled.div<{ $selected?: boolean, $focusBgColor?: string}>`
    ${commonCss.transition}
    color: white;
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

