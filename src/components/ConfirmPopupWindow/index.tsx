import { useWindow } from "@/store/AppStore/hooks";
import { useLogout } from "@/utility/UtilityHooks";
import { FC, useCallback } from "react";
import { LogoutButton, PopupBottomHalf, PopupButton, PopupContainer, PopupTopHalf } from "./styled";
import { BlurBackgroundCover } from "../common/BackgroundBlurCover";

type PopupClick = { dismiss: () => void }

type ConfirmPopupProps = {
    onClickRightButton: (click: PopupClick) => void,
    onClickLeftButton: (click: PopupClick) => void,
    popupMainLabel: string,
    rightButtonLabel: string,
    leftButtonLabel: string,
}

const Popup: FC<ConfirmPopupProps> = (props) => {
    // const logout = useLogout();
    const { popWindow } = useWindow();

    const click: PopupClick = { 
        dismiss: () => {
            popWindow();
        }
    }
    const onClickRightButton = useCallback(() => {
        props.onClickRightButton(click);
    }, []);
    const onClickLeftButton = useCallback(() => {
        props.onClickLeftButton(click);
    }, [])
    return (
        <PopupContainer>
            <PopupTopHalf>{props.popupMainLabel}</PopupTopHalf>
            <PopupBottomHalf>
                <PopupButton
                    onClick={onClickLeftButton}
                >{props.leftButtonLabel}</PopupButton>
                <LogoutButton 
                    onClick={onClickRightButton}
                >{props.rightButtonLabel}</LogoutButton>
            </PopupBottomHalf>
        </PopupContainer>
    )
}



const ConfirmPopupWindow: FC<ConfirmPopupProps> = (props) => {
    return(
        <BlurBackgroundCover dismissOnClick>
            <Popup
                {...props}
            />
        </BlurBackgroundCover>
    )
}

export default ConfirmPopupWindow;