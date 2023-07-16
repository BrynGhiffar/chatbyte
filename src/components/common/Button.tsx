import styled from "styled-components";
import { color, commonCss } from "../Palette";

export const Button = styled.button`
    ${commonCss.transition}
    width: 100%;
    outline: none;
    border: none;
    font-size: 1.5rem;
    padding: 0.5rem 0.5rem;
    font-weight: 600;
    color: ${color.lightBlue};
    background-color: ${color.darkBlue};
    cursor: pointer;
    border-radius: 4px;

    :hover {
        color: ${color.darkBlue};
        background-color: ${color.lightBlue};
    }
`;