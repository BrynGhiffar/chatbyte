import { AnimatePresence } from 'framer-motion';
import { FC, useCallback, useRef, useState } from 'react';

import { AttachmentSrc } from '@/api/http/Endpoint';
import { ProfilePicture } from '@/components/common/ProfilePicture';
import useAppStore from '@/store/AppStore';
import {
  useColorConfig,
  useSelectedContact,
  useWindow,
} from '@/store/AppStore/hooks';
import { useAvatarImage } from '@/utility/UtilityHooks';

import {
  DoubleCheckmarkSVG,
  PencilIconSVG,
  TrashIconSVG,
} from '@components/common/Svg';

import {
  SC__ChatBubbleMessage,
  SC__ChatBubbleName,
  SC__ChatBubbleTime,
  SC__ChatRow,
  SC__CheckmarkContainer,
  SC__CheckmarkTimeContainer,
  SC__ImageAttachment,
  SC__ImageAttachmentImage,
  SC__ImageAttachmentImageOverlay,
  SC__ImageAttachmentImageWrapper,
  SC__ProfilePictureContainer,
  TH_ChatBubbleContainer,
  TH__Button,
} from './styled';
import { Side } from './type';

type ReadReceiptProps = {
  side: Side;
  receiverRead: boolean;
};

const ReadReceipt: FC<ReadReceiptProps> = (props: ReadReceiptProps) => {
  const read = props.receiverRead;
  const checkmarkRead = useColorConfig().chatBubbleCheckmarkRead;
  const checkmarkNotRead = useColorConfig().chatBubbleCheckmarkNotRead;
  const backgroundColor = read ? checkmarkRead : checkmarkNotRead;
  return props.side === 'left' || !props.receiverRead ? (
    <div></div>
  ) : (
    <SC__CheckmarkContainer $backgroundColor={backgroundColor}>
      <DoubleCheckmarkSVG />
    </SC__CheckmarkContainer>
  );
};

type ButtonProps = {
  onClick?: () => void;
};

const DeleteButton: FC<ButtonProps> = props => {
  return (
    <TH__Button onClick={props.onClick}>
      <TrashIconSVG />
    </TH__Button>
  );
};

type Image = { key: string; src: string };

type ImageAttachmentProps = {
  images: Image[];
};

const ImageAttachment: FC<ImageAttachmentProps> = props => {
  const { pushWindow } = useWindow();
  const images = props.images;
  const onClickImageWrapper = useCallback(() => {
    pushWindow({
      type: 'IMAGE_CARROUSEL_WINDOW',
      imageSrcs: images.map(v => v.src),
    });
  }, []);
  return (
    <SC__ImageAttachment $oneImage={images.length === 1}>
      {images.slice(0, 4).map((im, i) => (
        <SC__ImageAttachmentImageWrapper onClick={onClickImageWrapper}>
          <SC__ImageAttachmentImage src={im.src} key={im.key} />
          {images.length > 4 && i === 3 && (
            <SC__ImageAttachmentImageOverlay>
              +{images.length}
            </SC__ImageAttachmentImageOverlay>
          )}
        </SC__ImageAttachmentImageWrapper>
      ))}
    </SC__ImageAttachment>
  );
};

const EditButton: FC<ButtonProps> = props => {
  return (
    <TH__Button iconHeight={17} onClick={props.onClick}>
      <PencilIconSVG />
    </TH__Button>
  );
};

type ChatBubbleMessageProps = {
  side: Side;
  deleted: boolean;
  message: string;
};

const ChatBubbleMessage: FC<ChatBubbleMessageProps> = props => {
  return (
    <SC__ChatBubbleMessage $side={props.side}>
      {props.deleted ? <em>Message has been deleted</em> : props.message}
    </SC__ChatBubbleMessage>
  );
};

type ChatBubbleProps = {
  messageId: number;
  side: 'left' | 'right';
  senderId: number;
  name: string;
  message: string;
  time: string;
  receiverRead: boolean;
  deleted: boolean;
  showProfilePicture?: boolean;
  attachmentIds: number[];
};

const ChatBubble: FC<ChatBubbleProps> = props => {
  const [hoverRow, setHoverRow] = useState(false);
  const { pushWindow } = useWindow();
  const setEditMessage = useAppStore(s => s.setEditMessage);
  const ref = useRef(null);
  const scrollIntoView = useCallback(() => {
    if (ref.current === null) return;
    const element = ref.current as HTMLDivElement;
    element.scrollIntoView({ behavior: 'smooth' });
  }, [ref]);
  const onClickTrash = useCallback(() => {
    pushWindow({
      type: 'CONFIRM_POPUP_DELETE_MESSAGE',
      messageId: props.messageId,
    });
  }, [pushWindow, scrollIntoView]);
  const onClickEdit = useCallback(() => {
    setEditMessage(props.messageId, scrollIntoView);
  }, [props.messageId]);
  const [imageUrl, _] = useAvatarImage(props.senderId);
  const selectedContact = useSelectedContact();
  const showProfilePicture = props.showProfilePicture ?? false;

  const showBubbleProfilePicture = useCallback(
    () => props.side === 'left' && selectedContact?.type === 'GROUP',
    [props.side, selectedContact?.type]
  );

  const showMessageControls = useCallback(
    () => props.side === 'right' && hoverRow && !props.deleted,
    [props.side, hoverRow, props.deleted]
  );

  const showImageAttachments = useCallback(
    () => props.attachmentIds.length > 0,
    [props.attachmentIds]
  );

  return (
    <SC__ChatRow
      $side={props.side}
      ref={ref}
      onMouseLeave={() => setHoverRow(false)}
      $sharpenEdge={showProfilePicture}
    >
      {showBubbleProfilePicture() && (
        <SC__ProfilePictureContainer>
          <ProfilePicture imageUrl={showProfilePicture ? imageUrl : ''} />
        </SC__ProfilePictureContainer>
      )}
      <AnimatePresence>
        {showMessageControls() && (
          <>
            <EditButton key='edit_button' onClick={onClickEdit} />
            <DeleteButton key='delete_button' onClick={onClickTrash} />
          </>
        )}
      </AnimatePresence>
      <TH_ChatBubbleContainer
        $side={props.side}
        onMouseEnter={() => setHoverRow(true)}
      >
        <SC__ChatBubbleName>
          {showProfilePicture && props.name}
        </SC__ChatBubbleName>
        <ChatBubbleMessage
          deleted={props.deleted}
          message={props.message}
          side={props.side}
        />
        {showImageAttachments() && (
          <ImageAttachment
            images={props.attachmentIds.map(at => ({
              key: `${at}`,
              src: AttachmentSrc(at),
            }))}
          />
        )}
        <SC__CheckmarkTimeContainer $side={props.side}>
          <SC__ChatBubbleTime $side={props.side}>
            {props.time}
          </SC__ChatBubbleTime>
          <ReadReceipt side={props.side} receiverRead={props.receiverRead} />
        </SC__CheckmarkTimeContainer>
      </TH_ChatBubbleContainer>
    </SC__ChatRow>
  );
};

export default ChatBubble;
