import { commonCss, font } from "@/components/Palette";
import { ButtonWrapper, DivWrapper, InputProps } from "@/misc/types";
import { useColorConfig } from "@/store/AppStore/hooks";
import { ForwardedRef, forwardRef } from "react";
import styled from "styled-components";

// █▀ ▀█▀ █▄█ █░░ █▀▀ █▀▄
// ▄█ ░█░ ░█░ █▄▄ ██▄ █▄▀

export const SC__SendSvg = styled.svg``;

type SC__ChatInputBarProps = {
    $backgroundColor: string;
}

export const SC__ChatInputBar = styled.div<SC__ChatInputBarProps>`
  /* width: 100%; */
  background-color: ${props => props.$backgroundColor};
  display: grid;
  grid-template-columns: 1fr 3rem;
  /* display: flex; */
  justify-content: center;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem;
  /* outline: 1px solid red; */
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
    /* border-radius: 4px; */
    font-size: 0.9rem;
    /* outline: 1px solid ${props => props.$borderColor}; */
    background-color: ${props => props.$backgroundColor};
    color: ${props => props.$color};
    height: 100%;
    flex-grow: 1;
`;

type SC__ChatInputTextWrapperProps = {
    $borderColor: string;
};

const SC__ChatInputTextWrapper = styled.div<SC__ChatInputTextWrapperProps>`
    outline: 1px solid ${props => props.$borderColor};
    border-radius: 4px;
    overflow: none;
    display: flex;
    height: 100%;
    flex-grow: 1;
`;

type SC__ChatInputDecorationContainerProps = {
    $backgroundColor: string;
}

const SC__ChatInputDecorationContainer = styled.div<SC__ChatInputDecorationContainerProps>`
    background-color: ${props => props.$backgroundColor};
    /* outline: 1px solid red; */
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
`;

type SC__UploadAttachmentButtonProps = {
    $hoverBackgroundColor: string;
    $color: string;
}

const SC__UploadAttachmentButton = styled.button<SC__UploadAttachmentButtonProps>`
    ${commonCss.transition}
    border: none;
    border-radius: 50%;
    background-color: transparent;
    aspect-ratio: 1 / 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2px;
    color: ${ props => props.$color };
    cursor: pointer;
    height: 80%;
    > svg {
        height: 90%;
        color: ${props => props.$color};
    }
    :hover {
        background-color: ${props => props.$hoverBackgroundColor};
    }
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
    height: 100%;
    align-items: center;
    > svg {
        height: 80%;
    }
    :hover {
      background-color: ${props => props.$hoverBackgroundColor};
    }
`;

type SC__ChatEditMessageContainerProps = {
    $backgroundColor: string;
    $borderColor: string;
    $color: string;
}

const SC__ChatEditMessageContainer = styled.div<SC__ChatEditMessageContainerProps>`
  /* outline: 1px solid red; */
  padding: 0.3rem;
  /* box-sizing: border-box; */
  border-radius: 5px;
  background-color: ${props => props.$backgroundColor};
  position: relative;
  overflow: hidden;
  font-family: ${font.appleFont};
  border-top: 3px solid ${props => props.$borderColor};
  font-weight: bold;
  font-size: 0.8rem;
  display: grid;
  align-items: center;
  grid-template-columns: 15px auto;
  gap: 5px;
  color: ${props => props.$color};
  cursor: pointer;
`;

type SC__CloseButtonProps = {
    $color: string;
}

const SC__ChatEditMessageCloseButton = styled.button<SC__CloseButtonProps>`
  width: 15px;
  border-radius: 50%;
  aspect-ratio: 1 / 1;
  border: none;
  cursor: pointer;
  background-color: transparent;
  :hover { background-color: transparent; }
  box-shadow: none;
  color: ${props => props.$color};
`;

// ▀█▀ █░█ █▀▀ █▀▄▀█ █▀▀ █▀▄
// ░█░ █▀█ ██▄ █░▀░█ ██▄ █▄▀

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

export const TH__UploadAttachmentButton: ButtonWrapper = ({ children, ...props }) => {
    const hoverBackgroundColor = useColorConfig().chatInputSendButtonBackgroundColorHover;
    const color = useColorConfig().chatInputSendButtonColor;
    return (
        <SC__UploadAttachmentButton
            $hoverBackgroundColor={hoverBackgroundColor}
            $color={color}
            { ...props }
        >
            { children }
        </SC__UploadAttachmentButton>
    )
}

export const TH__ChatInputDecorationContainer: DivWrapper = ({ children, ...props }) => {
    const backgroundColor = useColorConfig().chatInputInnerBackgroundColor;
    return (
        <SC__ChatInputDecorationContainer
            $backgroundColor={backgroundColor}
            { ...props }
        >
            { children }
        </SC__ChatInputDecorationContainer>
    )
}

export const TH__ChatInputTextWrapper: DivWrapper = ({ children, ...props }) => {
    const borderColor = useColorConfig().chatInputBorderColor;
    return (
        <SC__ChatInputTextWrapper
            $borderColor={borderColor}
            { ...props }
        >
            { children }
        </SC__ChatInputTextWrapper>
    )
}

export const TH__ChatInputText = forwardRef((props: InputProps, ref: ForwardedRef<HTMLInputElement>) => {
    const borderColor = useColorConfig().chatInputBorderColor;
    const backgroundColor = useColorConfig().chatInputInnerBackgroundColor;
    const color = useColorConfig().chatInputTextColor;
    return (
        <SC__ChatInputText
            ref={ref}
            $borderColor={borderColor}
            $backgroundColor={backgroundColor}
            $color={color}
            {...props}
        >
        </SC__ChatInputText>
    )
});

export const TH__SendButton: ButtonWrapper = ({ children, ...props }) => {
    const color = useColorConfig().chatInputSendButtonColor;
    const hoverBackgroundColor = useColorConfig().chatInputSendButtonBackgroundColorHover;
    return (
        <SC__SendButton
            $color={color}
            $hoverBackgroundColor={hoverBackgroundColor}
            { ...props }
        >
            {children}
        </SC__SendButton>
    );
}

export const TH__ChatEditMessageContainer: DivWrapper = ({ children, ...props}) => {
    const backgroundColor = useColorConfig().chatInput.chatEditBackgroundColor;
    const borderColor = useColorConfig().chatInput.chatEditBorderColor;
    const color = useColorConfig().chatInput.chatEditColor;
    return (
        <SC__ChatEditMessageContainer
            $backgroundColor={backgroundColor}
            $borderColor={borderColor}
            $color={color}
            {...props}
        >
            {children}
        </SC__ChatEditMessageContainer>
    );
};

export const TH__ChatEditMessageCloseButton: ButtonWrapper = ({ children, ...props}) => {
    const color = useColorConfig().chatInput.chatEditColor;
    return (
        <SC__ChatEditMessageCloseButton
            $color={color}
            {...props}
        >
            {children}
        </SC__ChatEditMessageCloseButton>
    )
}