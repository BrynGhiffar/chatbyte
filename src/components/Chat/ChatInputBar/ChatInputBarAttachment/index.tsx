import useAppStore from "@/store/AppStore";
import { FC } from "react";
import { TH__AttachmentDeleteButton, TH__AttachmentItem, TH__AttachmentItemControl, TH__AttachmentViewButton, TH__InputAttachmentContainer } from "./styled";
import { EyeOpenSVG, TrashIconSVG } from "@/components/common/Svg";

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
    <TH__AttachmentItem $image={file}>
      <TH__AttachmentItemControl>
        <TH__AttachmentViewButton>
          <EyeOpenSVG/>
        </TH__AttachmentViewButton>
        <TH__AttachmentDeleteButton onClick={onClickDeleteButton}>
          <TrashIconSVG/>
        </TH__AttachmentDeleteButton>
      </TH__AttachmentItemControl>
    </TH__AttachmentItem>
  )
}

export const InputAttachment: FC = () => {
  const attachments = useAppStore(s => s.uploadAttachments);
  if (attachments.length > 0) {
    return (
      <>
        <TH__InputAttachmentContainer>
        {
          attachments.map(a => (
            <AttachmentItem
              key={a.id}
              id={a.id}
              file={a.file}
            />
          ))
        }
        </TH__InputAttachmentContainer>
        <div/>
      </>
    );
  }
  return <></>
}
