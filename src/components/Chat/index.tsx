import { FC, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';

import useAppStore from '@/store/AppStore';
import { useSelectedContact, useSnackbar } from '@/store/AppStore/hooks';
import { logDebug } from '@/utility/Logger';

import { BlurBackgroundCover } from '@components/common/BackgroundBlurCover';
import InvisibleInput from '@components/common/InvisibleInput';

import ChatGrid from './ChatGrid';
import ChatInputBar from './ChatInputBar';
import ChatNavigation from './ChatNavigation';
import EmptyChatWindow from './EmptyChatWindow';
import { TH__ChatWindow } from './styled';

const Chat: FC = () => {
  const contact = useSelectedContact();
  const [dragOver, setDragOver] = useState(false);
  const addAttachment = useAppStore(s => s.addUploadAttachments);
  const { pushError } = useSnackbar();

  const onDragEnter = () => {
    logDebug('Drag enter');
    setDragOver(true);
  };

  const onDragLeave = () => {
    logDebug('Drag leave');
    setDragOver(false);
  };

  const onDrop: <T extends File>(
    acceptedFiles: T[],
    fileRejections: FileRejection[]
  ) => void = acceptedFiles => {
    setDragOver(false);
    addAttachment(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    noClick: true,
    noDragEventsBubbling: true,
    onDragEnter,
    onDrop,
  });

  if (contact) {
    return (
      <TH__ChatWindow {...getRootProps()} highlight={false}>
        <ChatNavigation />
        <ChatGrid />
        <ChatInputBar />
        {dragOver && (
          <BlurBackgroundCover onDragLeave={onDragLeave}></BlurBackgroundCover>
        )}
        <InvisibleInput {...getInputProps()} />
      </TH__ChatWindow>
    );
  }
  return <EmptyChatWindow />;
};

export default Chat;
