import styled from "styled-components";
import { FC, PropsWithChildren } from "react";
import { color } from "../Palette";


const StyledEmptyChatWindow = styled.div`
    background: ${color.darkBlue};
`;

const EmptyChatWindow: FC<PropsWithChildren> = (props) => {
    return (
        <StyledEmptyChatWindow>
        </StyledEmptyChatWindow>
    )
};

export default EmptyChatWindow;