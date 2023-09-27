import styled, { css } from "styled-components";
import { color, colorConfig, font } from "@/components/Palette";
import { FC } from "react";
import { DoubleCheckmarkSVG } from "../../common/Svg";
import { Side } from "./type";
import { SC__ChatBubbleMessage, SC__ChatBubbleName, SC__ChatBubbleTime, SC__ChatRow, SC__CheckmarkContainer, SC__CheckmarkTimeContainer, TH_ChatBubbleContainer } from "./styled";
import { useColorConfig } from "@/store/AppStore/hooks";


type ReadReceiptProps = {
  side: Side,
  receiverRead: boolean;
}

const ReadReceipt: FC<ReadReceiptProps> = (props: ReadReceiptProps) => {
  const read = props.receiverRead;
  const checkmarkRead = useColorConfig().chatBubbleCheckmarkRead;
  const checkmarkNotRead = useColorConfig().chatBubbleCheckmarkNotRead;
  const backgroundColor = read ? checkmarkRead : checkmarkNotRead;
  return (
    props.side === "left" || !props.receiverRead ? (
      <div></div>
    ) : (
    <SC__CheckmarkContainer $backgroundColor={backgroundColor}>
      <DoubleCheckmarkSVG/>
    </SC__CheckmarkContainer>
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
    <SC__ChatRow $side={props.side}>
      <TH_ChatBubbleContainer $side={props.side}>
        <SC__ChatBubbleName>
          {props.name}
        </SC__ChatBubbleName>
        <SC__ChatBubbleMessage $side={props.side}>
          {props.message}
        </SC__ChatBubbleMessage>
        <SC__CheckmarkTimeContainer $side={props.side}>
          <SC__ChatBubbleTime $side={props.side}>
            {props.time}
          </SC__ChatBubbleTime>
          <ReadReceipt side={props.side} receiverRead={props.receiverRead}/>
        </SC__CheckmarkTimeContainer>
      </TH_ChatBubbleContainer>
    </SC__ChatRow>
  );
};

export default ChatBubble;