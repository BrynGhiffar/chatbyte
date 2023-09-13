'use client';
import styled, { css } from "styled-components";
import { color, colorConfig, font } from "@/components/Palette";
import { FC } from "react";
import { DoubleCheckmarkSVG } from "../common/Svg";

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

const ChatBubbleStyled = styled.div<{$side: Side}>`
  max-width: 60ch;
  min-width: 10ch;
  min-height: 2rem;
  border-radius: 15px;
  padding: 0.5rem 1ch;
  display: grid;
  background-color: ${props => props.$side === "left" ? color.kindaWhite : colorConfig.chatBubbleBackgroundColorUserSent};
  gap: 5px;
  font-family: ${font.appleFont};
  ${debugOutline()}
`;

const ChatBubbleNameStyled = styled.span`
  font-weight: bold;
`;

const ChatBubbleTimeStyled = styled.span``;

const ChatBubbleMessageStyled = styled.p<{ $side: "left" | "right"}>`
  ${props => {
    if (props.$side === "right") {
      return css`
        display: flex;
        justify-content: flex-end;
      `
    } else {
      return ""
    }
  }}
`;

type ChatRowStyledProps = {
  $side: "left" | "right";
}

const ChatRowStyled = styled.div<ChatRowStyledProps>`
  min-height: 2.7rem;
  margin-bottom: 0px;
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  justify-content: ${props => props.$side === "left" ? "flex-start" : "flex-end"};
  /* outline: 1px solid red; */

  > ${ChatBubbleStyled} {
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

    ${ChatBubbleTimeStyled} {
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

type Side = "left" | "right"

const CheckmarkContainer = styled.div<{ $backgroundColor: string }>`
  height: 16px;
  display: flex;
  justify-content: flex-end;
  > svg {
    color: ${props => props.$backgroundColor};
  }
`;

const CheckmarkTimeContainer = styled.div<{$side: Side }>`
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

type ReadReceiptProps = {
  side: Side,
  receiverRead: boolean;
}

const ReadReceipt: FC<ReadReceiptProps> = (props: ReadReceiptProps) => {
  const read = props.receiverRead;
  const backgroundColor = read ? '#118a7e' : 'gray';
  return (
    props.side === "left" ? (
      <div></div>
    ) : (
    <CheckmarkContainer $backgroundColor={backgroundColor}>
      <DoubleCheckmarkSVG/>
    </CheckmarkContainer>
    )
  )
}

type ChatBubbleProps = {
  side: "left" | "right";
  name: string;
  message: string;
  time: string;
  receiverRead: boolean;
}

const ChatBubble: FC<ChatBubbleProps> = (props) => {
  return (
    <ChatRowStyled $side={props.side}>
      <ChatBubbleStyled $side={props.side}>
        <ChatBubbleNameStyled>
          {props.name}
        </ChatBubbleNameStyled>
        <ChatBubbleMessageStyled $side={props.side}>
          {props.message}
        </ChatBubbleMessageStyled>
        <CheckmarkTimeContainer $side={props.side}>
          <ChatBubbleTimeStyled>
            {props.time}
          </ChatBubbleTimeStyled>
          <ReadReceipt side={props.side} receiverRead={props.receiverRead}/>
        </CheckmarkTimeContainer>
      </ChatBubbleStyled>
    </ChatRowStyled>
  );
};

export default ChatBubble;