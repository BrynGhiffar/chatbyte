import styled from "styled-components";
import { FC, PropsWithChildren } from "react";
import { color, colorConfig } from "../../Palette";
import { DivWrapper } from "@/misc/types";
import { useColorConfig } from "@/store/AppStore/hooks";
import { TH__EmptyChatWindow } from "./styled";

const EmptyChatWindow: FC<PropsWithChildren> = (props) => {
    return (
        <TH__EmptyChatWindow>
        </TH__EmptyChatWindow>
    )
};

export default EmptyChatWindow;