import { FC, useRef, useState, Ref } from "react";
import ChatNavigation from "./ChatNavigation";
import ChatGrid from "./ChatGrid";
import ChatInputBar from "./ChatInputBar";
import EmptyChatWindow from "./EmptyChatWindow";
import { useSelectedContact, useSnackbar, useWindow } from "@/store/AppStore/hooks";
import { TH__ChatWindow } from "./styled";
import Dropzone, { FileRejection, useDropzone } from "react-dropzone";
import { BlurBackgroundCover } from "../common/BackgroundBlurCover";
import { logDebug } from "@/utility/Logger";
import useAppStore from "@/store/AppStore";
import { filterSupportedAttachments } from "@/utility/UtilityFunctions";
import InvisibleInput from "../common/InvisibleInput";

const Chat: FC = () => {
  const contact = useSelectedContact();
  const [dragOver, setDragOver] = useState(false);
  const addAttachment = useAppStore(s => s.addUploadAttachments);
  const { pushError } = useSnackbar();

  const onDragEnter = () => {
    logDebug("Drag enter");
    setDragOver(true);
  }

  const onDragLeave = () => {
    logDebug("Drag leave");
    setDragOver(false);
  }

  const onDrop: (<T extends File>(acceptedFiles: T[], fileRejections: FileRejection[]) => void) = (acceptedFiles) => {
    setDragOver(false);
    addAttachment(acceptedFiles);
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    noClick: true, 
    noDragEventsBubbling: true, 
    onDragEnter, 
    onDrop,
  });

  if (contact) {
    return (
            <TH__ChatWindow 
              {...getRootProps()}
              highlight={false}
            >
              <ChatNavigation/>
              <ChatGrid/>
              <ChatInputBar />
              {
                dragOver && (
                  <BlurBackgroundCover
                    onDragLeave={onDragLeave}
                  ></BlurBackgroundCover>
                )
              }
              <InvisibleInput {...getInputProps()}/>
            </TH__ChatWindow>
    )
  }
  return (
    <EmptyChatWindow/>
  );
}

export default Chat;