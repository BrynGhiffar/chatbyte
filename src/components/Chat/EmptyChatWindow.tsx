import styled from "styled-components";
import { FC, PropsWithChildren } from "react";
import { color, colorConfig } from "../Palette";
import { DivWrapper } from "@/misc/types";
import { useColorConfig } from "@/store/AppStore/hooks";

type SC__EmptyChatWindowProps = {
    $backgroundColor: string;
}

const SC__EmptyChatWindow = styled.div<SC__EmptyChatWindowProps>`
    background: ${props => props.$backgroundColor};
`;

const TH__EmptyChatWindow: DivWrapper = ({ children, ...props }) => {
    const backgroundColor = useColorConfig().chatEmptyBackgroundColor;
    return <SC__EmptyChatWindow
        $backgroundColor={backgroundColor}
        {...props}
    >{children}</SC__EmptyChatWindow>
}

const EmptyChatWindow: FC<PropsWithChildren> = (props) => {
    return (
        <TH__EmptyChatWindow>
        </TH__EmptyChatWindow>
    )
};

export default EmptyChatWindow;