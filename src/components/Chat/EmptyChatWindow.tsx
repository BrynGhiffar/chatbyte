import styled from "styled-components";
import { FC, PropsWithChildren } from "react";
import { color, colorConfig } from "../Palette";


const StyledEmptyChatWindow = styled.div`
    background: ${colorConfig.chatEmptyBackgroundColor};
`;

const EmptyChatWindow: FC<PropsWithChildren> = (props) => {
    return (
        <StyledEmptyChatWindow>
        </StyledEmptyChatWindow>
    )
};

export default EmptyChatWindow;