import styled, { css } from "styled-components";
import { color, colorConfig, commonCss, font } from "@/components/Palette";
import { FC, useCallback, useState, useRef } from "react";
import { DoubleCheckmarkSVG, PencilIconSVG, TrashIconSVG } from "../../common/Svg";
import { Side } from "./type";
import { SC__ChatBubbleMessage, SC__ChatBubbleName, SC__ChatBubbleTime, SC__ChatRow, SC__CheckmarkContainer, SC__CheckmarkTimeContainer, TH_ChatBubbleContainer, TH__Button } from "./styled";
import { useColorConfig, useSelectedContact, useWindow } from "@/store/AppStore/hooks";
import useAppStore from "@/store/AppStore";
import { AnimatePresence } from "framer-motion";
import { ProfilePicture } from "@/components/common/ProfilePicture";
import { useAvatarImage } from "@/utility/UtilityHooks";
import { AttachmentSrc } from "@/api/http/Endpoint";


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

const SC__ProfilePictureContainer = styled.div`
  display: grid;
  align-items: start;
  /* outline: 1px solid red; */
`;

type SC__ImageAttachmentProps = {
  $oneImage: boolean;
}

const SC__ImageAttachment = styled.div<SC__ImageAttachmentProps>`
  width: 100%;
  display: grid;
  /* outline: 1px solid blue; */
  ${
    props => (!props.$oneImage) && (css`
      grid-template-columns: repeat(2, 1fr);
      img {
        aspect-ratio: 1 / 1;
      }
    `)
  }
  gap: 3px;

`;

const SC__ImageAttachmentImageWrapper = styled.div`
  /* outline: 1px solid red; */
  position: relative;
  border-radius: 10px;
  overflow: hidden;
`;


const SC__ImageAttachmentImageOverlay = styled.div`
  transition: all 150ms ease-in-out;
  background-color: transparent;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  color: white;
  background-color: rgba(100,100,100, 0.5);
`;

const SC__ImageAttachmentImage = styled.img`
  /* width: 50px; */
  display: block;
  width: 100%;
  object-fit: cover;
  object-position: center;
  ${commonCss.transition}
  cursor: pointer;
  :hover {
    filter: blur(100%);
  }
`;

const images = [
  {
    key: '2',
    src: "http://localhost:8080/api/user/avatar/3?random=61"
  },
  {
    key: '1',
    src: "http://localhost:8080/api/user/avatar/1?random=503"
  },
  {
    key: '3',
    src: "http://localhost:8080/api/user/avatar/1?random=503"
  },
  {
    key: '4',
    src: "http://localhost:8080/api/user/avatar/1?random=503"
  },
  {
    key: '5',
    src: "http://localhost:8080/api/user/avatar/1?random=503"
  },
  {
    key: '6',
    src: "http://localhost:8080/api/user/avatar/3?random=61"
  },
]

type Image = { key: string, src: string, }

type ImageAttachmentProps = {
  images: Image[]
}

const ImageAttachment: FC<ImageAttachmentProps> = (props) => {
  const images = props.images;
  return (
    <SC__ImageAttachment
      $oneImage={images.length === 1}
    >
      { 
        images.slice(0, 4).map((im, i) => (
          <SC__ImageAttachmentImageWrapper>
            <SC__ImageAttachmentImage 
              src={im.src} key={im.key}
            />
            {
              (images.length > 4 && i === 3) && (
                <SC__ImageAttachmentImageOverlay>
                  +{images.length}
                </SC__ImageAttachmentImageOverlay>
              )
            }
          </SC__ImageAttachmentImageWrapper>
        ))
      }
    </SC__ImageAttachment>
  );
};

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
  senderId: number;
  name: string;
  message: string;
  time: string;
  receiverRead: boolean;
  deleted: boolean;
  showProfilePicture?: boolean;
  attachmentIds: number[]
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
  const [imageUrl, _] = useAvatarImage(props.senderId);
  const selectedContact = useSelectedContact();
  const showProfilePicture = props.showProfilePicture ?? false;
  return (
    <SC__ChatRow $side={props.side}
      ref={ref}
      onMouseLeave={() => setHoverRow(false)}
      $sharpenEdge={showProfilePicture}
    >
      {
        props.side === "left" 
          && selectedContact?.type === "GROUP" 
          && (
            <SC__ProfilePictureContainer>
              <ProfilePicture
                imageUrl={showProfilePicture ? imageUrl : ""}
              />
            </SC__ProfilePictureContainer>
          )
      }
      <AnimatePresence>
        {
          props.side === "right" 
            && hoverRow 
            && !props.deleted 
            && (
              <EditButton
                key="edit_button" 
                onClick={onClickEdit}
              />
            )
        }
        {
          props.side === "right" 
            && hoverRow 
            && !props.deleted 
            && (
              <DeleteButton 
                key="delete_button" 
                onClick={onClickTrash}
              />
            )
        }
      </AnimatePresence>
      <TH_ChatBubbleContainer
        $side={props.side}
        onMouseEnter={() => setHoverRow(true)}
      >
        <SC__ChatBubbleName>
          {showProfilePicture && props.name}
        </SC__ChatBubbleName>
        <SC__ChatBubbleMessage $side={props.side}>
          {props.deleted ? <em>Message has been deleted</em> : props.message}
        </SC__ChatBubbleMessage>
        <ImageAttachment images={props.attachmentIds.map(at => ({ key: `${at}`, src: AttachmentSrc(at) }))}/>
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