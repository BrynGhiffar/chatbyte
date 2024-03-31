import ConfirmPopupWindow from "@/components/ConfirmPopupWindow";
import useAppStore from "@/store/AppStore";
import { FC } from "react";

type ConfirmDeleteMessagePopupProps = {
    messageId: number
}

export const ConfirmDeleteMessagePopup: FC<ConfirmDeleteMessagePopupProps> = (props) => {
    const deleteMessage = useAppStore(s => s.deleteMessage);
    return(
        <ConfirmPopupWindow
            popupMainLabel="Delete this message?"
            leftButtonLabel="Cancel"
            rightButtonLabel="Delete"
            onClickLeftButton={c => c.dismiss()}
            onClickRightButton={c => {
                deleteMessage(props.messageId);
                c.dismiss();
            }}
        />
    )
}

export default ConfirmDeleteMessagePopup;