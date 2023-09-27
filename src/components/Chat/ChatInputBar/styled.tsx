import { commonCss } from "@/components/Palette";
import { ButtonWrapper, DivWrapper, InputWrapper } from "@/misc/types";
import { useColorConfig } from "@/store/AppStore/hooks";
import styled from "styled-components";

export const SC__SendSvg = styled.svg``;

type SC__ChatInputBarProps = {
    $backgroundColor: string;
}

export const SC__ChatInputBar = styled.div<SC__ChatInputBarProps>`
  width: 100%;
  background-color: ${props => props.$backgroundColor};
  display: grid;
  grid-template-columns: 1fr 5rem;
  justify-content: center;
  align-items: center;
  gap: 0.4rem;

  * {
    height: 2rem;
  }

  & > *:first-child {
    margin-left: 1.5rem;
  }

  & > *:last-child {
    margin-right: 1.5rem;
  }
`;

type SC__ChatInputTextProps = {
    $borderColor: string;
    $backgroundColor: string;
    $color: string;
}

const SC__ChatInputText = styled.input<SC__ChatInputTextProps>`
    border: none;
    outline: none;
    padding: 0px 0.5rem;
    border-radius: 4px;
    font-size: 0.9rem;
    outline: 1px solid ${props => props.$borderColor};
    background-color: ${props => props.$backgroundColor};
    color: ${props => props.$color};
`;

type SC__SendButtonProps = {
    $color: string;
    $hoverBackgroundColor: string;
}

const SC__SendButton = styled.button<SC__SendButtonProps>`
    ${commonCss.transition}
    border: none;
    border-radius: 4px;
    background-color: transparent;
    color: ${props => props.$color};
    text-transform: uppercase;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    :hover {
      background-color: ${props => props.$hoverBackgroundColor};
    }

    > ${SC__SendSvg} {
      height: 70%;
    }
`;

export const TH__ChatInputBar: DivWrapper = ({ children, ...props }) => {
    const backgroundColor = useColorConfig().chatInputBackgroundColor;
    return (
        <SC__ChatInputBar
            $backgroundColor={backgroundColor}
            {...props}
        >
            {children}
        </SC__ChatInputBar>
    )
}

export const TH__ChatInputText: InputWrapper = ({ children, ...props}) => {
    const borderColor = useColorConfig().chatInputBorderColor;
    const backgroundColor = useColorConfig().chatInputInnerBackgroundColor;
    const color = useColorConfig().chatInputTextColor;
    return (
        <SC__ChatInputText
            $borderColor={borderColor}
            $backgroundColor={backgroundColor}
            $color={color}
            {...props}
        >
            {children}
        </SC__ChatInputText>
    )
}

export const TH__SendButton: ButtonWrapper = ({ children, ...props }) => {
    const color = useColorConfig().chatInputSendButtonColor;
    const hoverBackgroundColor = useColorConfig().chatInputSendButtonBackgroundColorHover;
    return (
        <SC__SendButton
            $color={color}
            $hoverBackgroundColor={hoverBackgroundColor}
        >
            {children}
        </SC__SendButton>
    );
}