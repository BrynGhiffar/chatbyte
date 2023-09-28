import styled, { css } from "styled-components";
import { color, colorConfig, font } from "@/components/Palette";
import { FC, useCallback, useState, useRef } from "react";
import { DoubleCheckmarkSVG, PencilIconSVG, TrashIconSVG } from "../../common/Svg";
import { Side } from "./type";
import { SC__ChatBubbleMessage, SC__ChatBubbleName, SC__ChatBubbleTime, SC__ChatRow, SC__CheckmarkContainer, SC__CheckmarkTimeContainer, TH_ChatBubbleContainer, TH__Button } from "./styled";
import { useColorConfig, useWindow } from "@/store/AppStore/hooks";
import useAppStore from "@/store/AppStore";
import { AnimatePresence } from "framer-motion";


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

type ButtonProps = {
  onClick?: () => void,
}

const DeleteButton: FC<ButtonProps> = (props) => {
  return (
    <TH__Button
      onClick={props.onClick}
    >
      <TrashIconSVG/>
    </TH__Button>
  )
}

const EditButton: FC<ButtonProps> = props => {
  return (
    <TH__Button
      iconHeight={17}
      onClick={props.onClick}
    >
      <PencilIconSVG/>
    </TH__Button>
  )
}


type ChatBubbleProps = {
  messageId: number,
  side: "left" | "right";
  name: string;
  message: string;
  time: string;
  receiverRead: boolean;
  deleted: boolean;
}

const ChatBubble: FC<ChatBubbleProps> = (props) => {
  const [hoverRow, setHoverRow] = useState(false);
  const { pushWindow } = useWindow();
  const setEditMessage = useAppStore(s => s.setEditMessage);
  const ref = useRef(null);
  const scrollIntoView = useCallback(() => {
    if (ref.current === null) return;
    const element = ref.current as HTMLDivElement;
    element.scrollIntoView({ behavior: "smooth" });
  }, [ref]);
  const onClickTrash = useCallback(() => {
    pushWindow({ type: "CONFIRM_POPUP_DELETE_MESSAGE", messageId: props.messageId });
  }, [pushWindow, scrollIntoView]);
  const onClickEdit = useCallback(() => {
    setEditMessage(props.messageId, scrollIntoView);
  }, [props.messageId]);
  return (
    <SC__ChatRow $side={props.side}
      ref={ref}
      onMouseLeave={() => setHoverRow(false)}
    >
      <AnimatePresence>
        {props.side === "right" && hoverRow && !props.deleted && <EditButton key="edit_button" onClick={onClickEdit}/>}
        {props.side === "right" && hoverRow && !props.deleted && <DeleteButton key="delete_button" onClick={onClickTrash}/>}
      </AnimatePresence>
      <TH_ChatBubbleContainer
        $side={props.side}
        onMouseEnter={() => setHoverRow(true)}
      >
        <SC__ChatBubbleName>
          {props.name}
        </SC__ChatBubbleName>
        <SC__ChatBubbleMessage $side={props.side}>
          {props.deleted ? <em>Message has been deleted</em> : props.message}
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