import { commonCss, font } from "@/components/Palette";
import styled from "styled-components";

export const GenericPopupContainer = styled.div`
    background-color: white;
    border: 2px solid #ededed;
    border-radius: 10px;
    overflow: hidden;
    font-family: ${font.appleFont};
`;

export const GenericBottomPopupButton = styled.div`
    ${commonCss.transition}
    outline: 1px solid #ededed;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: ${font.appleFont};
    font-size: 1.2rem;
    cursor: pointer;
`;