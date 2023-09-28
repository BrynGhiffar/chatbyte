import { font } from "@/components/Palette";
import { DivProps, DivWrapper } from "@/misc/types";
import styled, { css } from "styled-components";
import { PropsWithChildren, FC } from "react";
import { useColorConfig } from "@/store/AppStore/hooks";
import { Side } from "./type";
import { motion } from "framer-motion";

const debugOutline = () => {
    const cond = true;
    if (cond) return '';
    const red = Math.round(Math.random() * 255);
    const green = Math.round(Math.random() * 255);
    const blue = Math.round(Math.random() * 255);
    return css`
      outline: 1px solid rgba(${red}, ${green}, ${blue}, 1);
    `
};

const justfifyContent = (side: Side) => {
    if (side === 'right') {
        return css`
            display: flex;
            justify-content: end;    
        `;
    } else {
        return ""
    }
}
const reverseJustifyContent = (side: Side) => {
    if (side === 'left') {
        return css`
            display: flex;
            justify-content: end;    
        `;
    } else {
        return ""
    }
}

type SC__ChatBubbleContainerProps = {
    $side: Side,
    $leftSideBackgroundColor: string;
    $rightSideBackgroundColor: string;
    $leftSideColor: string;
    $rightSideColor: string;
}

const SC__ChatBubbleContainer = styled.div<SC__ChatBubbleContainerProps>`
    max-width: 60ch;
    min-width: 10ch;
    min-height: 2rem;
    border-radius: 15px;
    padding: 0.5rem 1ch;
    display: grid;
    background-color: ${props => props.$side === "left" ? props.$leftSideBackgroundColor : props.$rightSideBackgroundColor};
    color: ${props => props.$side == "left" ? props.$leftSideColor : props.$rightSideColor};
    gap: 5px;
    font-family: ${font.appleFont};
    ${debugOutline()}
`;
  
export const SC__ChatBubbleName = styled.span`
    font-weight: bold;
`;

type SC__ChatBubbleTimeProps = {
    $side: Side
}

export const SC__ChatBubbleTime = styled.span<SC__ChatBubbleTimeProps>`
    font-size: 0.65rem;
    ${props => reverseJustifyContent(props.$side)}
`;


type SC__ChatBubbleMessageProps = {
    $side: Side
}

export const SC__ChatBubbleMessage = styled.p<SC__ChatBubbleMessageProps>`
    ${props => justfifyContent(props.$side)}
`;


type SC__ChatRowProps = {
    $side: "left" | "right";
}

export const SC__ChatRow = styled.div<SC__ChatRowProps>`
    min-height: 2.7rem;
    margin-bottom: 0px;
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    justify-content: ${props => props.$side === "left" ? "flex-start" : "flex-end"};
    /* outline: 1px solid red; */
    gap: 10px;

    > ${SC__ChatBubbleContainer} {
        ${props => {
        if (props.$side === "left") {
            return css`
            border-top-left-radius: 0px;
            `;
        } else {
            return css`
            border-top-right-radius: 0px;
            `;
        }
    }}

    ${SC__ChatBubbleContainer} {
        font-size: 0.8rem;
        ${props => {
            if (props.$side === "left") {
            return css`
                display: flex;
                justify-content: flex-end;
            `
            } else {
            return ""
            }
        }}
    }
}
`;


export const SC__CheckmarkContainer = styled.div<{ $backgroundColor: string }>`
    height: 16px;
    display: flex;
    justify-content: flex-end;
    > svg {
        color: ${props => props.$backgroundColor};
    }
`;

export const SC__CheckmarkTimeContainer = styled.div<{$side: Side }>`
    display: grid;
    grid-template-columns: 1fr 1fr;
    ${props => props.$side === "left" && css`
        > * {
        &:first-child {
            order: 1;
        }
        }
    `}
`;

type SC__DeleteButtonProps = {
    $color: string,
    $backgroundColor: string,
    $borderColor: string,
}

export const SC__DeleteButton = styled(motion.div)<SC__DeleteButtonProps>`
    height: 22px;
    padding: 3px;
    aspect-ratio: 1 / 1;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    border: 1px solid ${props => props.$borderColor};
    background-color: ${props => props.$backgroundColor};
    > svg {
        cursor: pointer;
        color: ${props => props.$color};
    }
`;

export const TH__DeleteButton: DivWrapper = ({ children, ...props }) => {
    const backgroundColor = useColorConfig().chatBubble.trashIconBackgroundColor;
    const color = useColorConfig().chatBubble.trashIconColor;
    const borderColor = useColorConfig().chatBubble.trashIconBorderColor;
    return (
        <SC__DeleteButton
            onClick={props.onClick}
            $backgroundColor={backgroundColor}
            $color={color}
            $borderColor={borderColor}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
        >
            {children}
        </SC__DeleteButton>
    )
}




type TH__ChatBubbleContainerProps = PropsWithChildren<DivProps &  {
    $side: Side
}>

export const TH_ChatBubbleContainer: FC<TH__ChatBubbleContainerProps> = ({ children, $side, ...props}) => {
    const rightSideBackgroundColor = useColorConfig().chatBubbleBackgroundColorUserSent;
    const leftSideBackgroundColor = useColorConfig().chatBubbleBackgroundColor;
    const leftSideColor = useColorConfig().chatBubbleTextColor;
    const rightSideColor = useColorConfig().chatBubbleTextColorUserSent;
    return (
        <SC__ChatBubbleContainer
            $rightSideBackgroundColor={rightSideBackgroundColor}
            $leftSideBackgroundColor={leftSideBackgroundColor}
            $rightSideColor={rightSideColor}
            $leftSideColor={leftSideColor}
            $side={$side}
            {...props}
        >
            {children}
        </SC__ChatBubbleContainer>
    );
}
