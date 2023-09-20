import styled from "styled-components";
import { font } from "../Palette";
import { FC, useCallback } from "react";
import { useLogout } from "@/utility/UtilityHooks";
import { BlurBackgroundCover } from "../common/BackgroundBlurCover";
import { GenericBottomPopupButton, GenericPopupContainer } from "../common/new/Popup";


const PopupTopHalf = styled.div`
    display: flex;
    justify-content: center;
    background-color: transparent;
    align-items: center;
    font-family: ${font.appleFont};
    font-size: 1.5rem;
`;

const PopupBottomHalf = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    background-color: transparent;
`;

const PopupButton = GenericBottomPopupButton;

const PopupContainer = styled(GenericPopupContainer)`
    height: 18vh;
    width: 300px;
    display: grid;
    grid-template-rows: 2fr 1fr;
`;

const LogoutButton = styled(PopupButton)`
    :hover {
        background-color: #ff0000;
        color: white;
    }
`;

const Popup: FC = () => {
    const logout = useLogout();
    const onClickLogout = useCallback(() => {
        logout();
    }, [logout]);
    return (
        <PopupContainer>
            <PopupTopHalf>Do you want to logout?</PopupTopHalf>
            <PopupBottomHalf>
                <PopupButton>CANCEL</PopupButton>
                <LogoutButton onClick={onClickLogout}>LOGOUT</LogoutButton>
            </PopupBottomHalf>
        </PopupContainer>
    )
}

type DivMouseEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;

export const PopupLogoutWindow: FC = () => {
    return(
        <BlurBackgroundCover dismissOnClick>
            <Popup/>
        </BlurBackgroundCover>
    )
}