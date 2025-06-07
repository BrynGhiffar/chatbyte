import {
  ChangeEventHandler,
  FC,
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import InvisibleInput from '@/components/common/InvisibleInput';
import { AddSymbolSVG, CloseSVG } from '@/components/common/Svg';
import useAppStore from '@/store/AppStore';

import { InputAttachment } from './ChatInputBarAttachment';
import {
  SC__SendSvg,
  TH__ChatEditMessageCloseButton,
  TH__ChatEditMessageContainer,
  TH__ChatInputBar,
  TH__ChatInputDecorationContainer,
  TH__ChatInputText,
  TH__ChatInputTextWrapper,
  TH__SendButton,
  TH__UploadAttachmentButton,
} from './styled';

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
      <TH__ChatEditMessageContainer onClick={onClick}>
        <TH__ChatEditMessageCloseButton onClick={onClickClose}>
          <CloseSVG />
        </TH__ChatEditMessageCloseButton>
        Edit Message
      </TH__ChatEditMessageContainer>
      <div />
    </>
  );
};

const ChatInputBar: FC = () => {
  const [input, setInput] = useState('');

  const sendMessage = useAppStore(s => s.sendMessage);
  const attachments = useAppStore(s => s.uploadAttachments);
  const editMessage = useAppStore(s => s.editMessage);
  const cancelEditMessage = useAppStore(s => s.cancelEditMessage);
  const addAttachment = useAppStore(s => s.addUploadAttachments);

  const inputRef = useRef(null);
  const inputAttachmentRef = useRef(null);

  useEffect(() => {
    if (editMessage !== null) {
      setInput(editMessage.message.content);
      if (inputRef.current !== null) {
        const element = inputRef.current as HTMLInputElement;
        element.focus();
      }
    } else {
      setInput('');
    }
  }, [editMessage]);

  const onClickSend = async () => {
    const message = input.trim();
    if (message.length === 0 && attachments.length === 0) return;
    setInput('');
    sendMessage(message);
  };

  const onKeyPressInInput = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onClickSend();
      return;
    } else if (e.key === 'Escape') {
      return cancelEditMessage();
    }
  };

  const onClickAddAttachment = () => {
    if (inputAttachmentRef.current === null) return;
    const element = inputAttachmentRef.current as HTMLInputElement;
    element.click();
  };

  const onAddAttachment: ChangeEventHandler<HTMLInputElement> = e => {
    const targetFiles = e.target.files;
    if (targetFiles === null) return;
    let files = [];
    for (let i = 0; i < targetFiles.length; i++) {
      files.push(targetFiles[i]);
    }
    addAttachment(files);
  };

  return (
    <TH__ChatInputBar>
      {editMessage && <ChatEditMessageDetail />}
      <InputAttachment />
      <TH__ChatInputTextWrapper>
        <TH__ChatInputText
          ref={inputRef}
          placeholder='Type something'
          type='text'
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyPressInInput}
        />
        <TH__ChatInputDecorationContainer>
          <TH__UploadAttachmentButton onClick={onClickAddAttachment}>
            <AddSymbolSVG />
            <InvisibleInput
              ref={inputAttachmentRef}
              onChange={onAddAttachment}
              type='file'
            />
          </TH__UploadAttachmentButton>
        </TH__ChatInputDecorationContainer>
      </TH__ChatInputTextWrapper>
      <TH__SendButton onClick={onClickSend}>
        <SendSymbol />
      </TH__SendButton>
    </TH__ChatInputBar>
  );
};

const SendSymbol: FC = () => {
  return (
    <>
      <SC__SendSvg
        viewBox='0 0 24 24'
        width='32px'
        height='32px'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M10.5004 11.9998H5.00043M4.91577 12.2913L2.58085 19.266C2.39742 19.8139 2.3057 20.0879 2.37152 20.2566C2.42868 20.4031 2.55144 20.5142 2.70292 20.5565C2.87736 20.6052 3.14083 20.4866 3.66776 20.2495L20.3792 12.7293C20.8936 12.4979 21.1507 12.3822 21.2302 12.2214C21.2993 12.0817 21.2993 11.9179 21.2302 11.7782C21.1507 11.6174 20.8936 11.5017 20.3792 11.2703L3.66193 3.74751C3.13659 3.51111 2.87392 3.39291 2.69966 3.4414C2.54832 3.48351 2.42556 3.59429 2.36821 3.74054C2.30216 3.90893 2.3929 4.18231 2.57437 4.72906L4.91642 11.7853C4.94759 11.8792 4.96317 11.9262 4.96933 11.9742C4.97479 12.0168 4.97473 12.0599 4.96916 12.1025C4.96289 12.1506 4.94718 12.1975 4.91577 12.2913Z'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </SC__SendSvg>
    </>
  );
};

export default ChatInputBar;
