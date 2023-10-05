import styled from "styled-components";
import { colorConfig, commonCss, font } from "@/components/Palette";
import { FC, KeyboardEvent, useEffect, useRef, useState, useCallback, MouseEvent } from "react";
import useAppStore from "@/store/AppStore";
import { SC__SendSvg, TH__ChatEditMessageCloseButton, TH__ChatEditMessageContainer, TH__ChatInputBar, TH__ChatInputText, TH__SendButton } from "./styled";
import { CloseSVG, EyeOpenSVG, TrashIconSVG } from "@/components/common/Svg";
import { logDebug } from "@/utility/Logger";
import { toBase64 } from "@/utility/UtilityFunctions";
import { set } from "zod";

const ChatEditMessageDetail = () => {
  const cancelEdit = useAppStore(s => s.cancelEditMessage);
  const editMessage = useAppStore(s => s.editMessage);
  const onClick = useCallback(() => {
    if (!editMessage) return;
    editMessage.scrollIntoView();
  }, []);
  const onClickClose = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    cancelEdit();
  }, []);
  return (
    <>
      <TH__ChatEditMessageContainer
        onClick={onClick}
      >
        <TH__ChatEditMessageCloseButton onClick={onClickClose}>
          <CloseSVG/>
        </TH__ChatEditMessageCloseButton>
        Edit Message
      </TH__ChatEditMessageContainer>
      <div/>
    </>
  )
}

const InputAttachmentContainer = styled.div`
  padding: 0.5rem;
  background-color: #0f0f0f;
  border: 1px solid #1f1f1f;
  border-radius: 5px;
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
`

type SC__AttachmentItemProps = {
  $image: string,
}

const SC__AttachmentItem = styled.div<SC__AttachmentItemProps>`
  height: 130px;
  width: 110px;
  /* background-color: #393a3d; */
  background-image: url(${props => props.$image});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-color: #1e1d1d;
  position: relative;
  border-radius: 5px;
`;

const SC__AttachmentItemControl = styled.div`
  background-color: #3a3b3e;
  border: 1px solid #1f1f1f;
  border-radius: 5px;
  position: absolute;
  top: -2px;
  right: -2px;
  height: 20px;
  width: 40px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
`;

const SC__AttachmentControlItems = styled.div`
  ${commonCss.transition}
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  :hover {
    background-color: #29292c;
  }
  > svg {
    color: white;
  }
`;

const SC__AttachmentDeleteButton = styled(SC__AttachmentControlItems)`
  :hover {
    background-color: red;
  }
`;

const SC__AttachmentViewButton = styled(SC__AttachmentControlItems)`
  > svg {
    height: 17px;
    aspect-ratio: 1 / 1;
  }
`;

type AttachmentItemProps = {
  id: number;
  file: string
}

const AttachmentItem: FC<AttachmentItemProps> = ({ id, file }) => {
  const removeAttachmentById = useAppStore(s => s.removeAttachmentById);
  const onClickDeleteButton = () => {
    removeAttachmentById(id);
  };
  return (
    <SC__AttachmentItem $image={file}>
      <SC__AttachmentItemControl>
        <SC__AttachmentViewButton>
          <EyeOpenSVG/>
          {/* <TrashIconSVG/> */}
        </SC__AttachmentViewButton>
        <SC__AttachmentDeleteButton onClick={onClickDeleteButton}>
          <TrashIconSVG/>
        </SC__AttachmentDeleteButton>
      </SC__AttachmentItemControl>
    </SC__AttachmentItem>
  )
}

const InputAttachment: FC = () => {
  const attachments = useAppStore(s => s.uploadAttachments);
  if (attachments.length > 0) {
    return (
      <>
        <InputAttachmentContainer>
        {
          attachments.map(a => (
            <AttachmentItem
              key={a.id}
              id={a.id}
              file={a.file}
            />
          ))
        }
        </InputAttachmentContainer>
        <div/>
      </>
    );
  }
  return <></>
}


const ChatInputBar: FC = () => {
  const [ input, setInput ] = useState("");
  const sendMessage = useAppStore(s => s.sendMessage);
  const onClickSend = async () => {
    const message = input.trim();
    if (message.length === 0) return;
    setInput("");
    sendMessage(message);
  }
  const inputRef = useRef(null);
  const editMessage = useAppStore(s => s.editMessage);
  const cancelEditMessage = useAppStore(s => s.cancelEditMessage);
  useEffect(() => {
    if (editMessage !== null) {
      setInput(editMessage.message.content);
      if (inputRef.current !== null) {
        const element = inputRef.current as HTMLInputElement;
        element.focus();
      }
    } else {
      setInput("");
    }
  }, [editMessage]);

  const onKeyPressInInput = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { 
      onClickSend();
      return ;
    } else if (e.key === 'Escape') {
      return cancelEditMessage();
    }
  } 
  return (
    <TH__ChatInputBar>
      { editMessage && <ChatEditMessageDetail/> }
      <InputAttachment/>
      <TH__ChatInputText
        ref={inputRef}
        placeholder="Type something"
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={onKeyPressInInput}
      />
      <TH__SendButton onClick={onClickSend}>
        <SendSymbol />
      </TH__SendButton>
    </TH__ChatInputBar>
  );
}

const SendSymbol: FC = () => {
  return (
    <>
      <SC__SendSvg className="send svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.5004 11.9998H5.00043M4.91577 12.2913L2.58085 19.266C2.39742 19.8139 2.3057 20.0879 2.37152 20.2566C2.42868 20.4031 2.55144 20.5142 2.70292 20.5565C2.87736 20.6052 3.14083 20.4866 3.66776 20.2495L20.3792 12.7293C20.8936 12.4979 21.1507 12.3822 21.2302 12.2214C21.2993 12.0817 21.2993 11.9179 21.2302 11.7782C21.1507 11.6174 20.8936 11.5017 20.3792 11.2703L3.66193 3.74751C3.13659 3.51111 2.87392 3.39291 2.69966 3.4414C2.54832 3.48351 2.42556 3.59429 2.36821 3.74054C2.30216 3.90893 2.3929 4.18231 2.57437 4.72906L4.91642 11.7853C4.94759 11.8792 4.96317 11.9262 4.96933 11.9742C4.97479 12.0168 4.97473 12.0599 4.96916 12.1025C4.96289 12.1506 4.94718 12.1975 4.91577 12.2913Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </SC__SendSvg>
    </>
  )
}

export default ChatInputBar;
