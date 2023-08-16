'use client';
import styled, { css } from "styled-components";
import { color, font } from "@/components/Palette";
import { FC } from "react";

const ChatBubbleStyled = styled.div`
  max-width: 60ch;
  min-width: 5ch;
  min-height: 2rem;
  border-radius: 15px;
  padding: 0.5rem 1ch;
  display: grid;
  background-color: ${color.kindaWhite};
  gap: 5px;
  font-family: ${font.appleFont};
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

    > ${ChatBubbleTimeStyled} {
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

type ChatBubbleProps = {
  side: "left" | "right";
  name: string;
  message: string;
  time: string;
}

const ChatBubble: FC<ChatBubbleProps> = (props) => {
  return (
    <ChatRowStyled $side={props.side}>
      <ChatBubbleStyled>
        <ChatBubbleNameStyled>
          {props.name}
        </ChatBubbleNameStyled>
        <ChatBubbleMessageStyled $side={props.side}>
          {props.message}
        </ChatBubbleMessageStyled>
        <ChatBubbleTimeStyled>
          {props.time}
        </ChatBubbleTimeStyled>
      </ChatBubbleStyled>
    </ChatRowStyled>
  );
};

export default ChatBubble;