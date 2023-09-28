import styled from "styled-components";
import { colorConfig } from "../Palette";
import { DivWrapper } from "@/misc/types";
import { useColorConfig } from "@/store/AppStore/hooks";

type SC__ChatWindowProps = {
    $backgroundColor: string;
}

export const SC__ChatWindow = styled.div<SC__ChatWindowProps>`
    display: grid;
    grid-template-rows: 4rem 1fr auto;
    overflow: hidden;
    background-color: ${props => props.$backgroundColor};
    /* visibility: hidden; */
`;

export const TH__ChatWindow: DivWrapper = ({ children, ...props }) => {
    const backgroundColor = useColorConfig().chatGridBackgroundColor;
    return (
        <SC__ChatWindow
            $backgroundColor={backgroundColor}
            {...props}
        >
            {children}
        </SC__ChatWindow>
    )
}