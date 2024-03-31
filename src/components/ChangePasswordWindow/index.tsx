import { AuthService } from '@/api/http/AuthService';
import { useSnackbar, useWindow } from '@/store/AppStore/hooks';
import { useToken } from '@/utility/UtilityHooks';
import { FC, useCallback, useState } from 'react';
import styled from 'styled-components';
import { BlurBackgroundCover } from '../common/BackgroundBlurCover';
import { VerticalStackContainer } from '../common/StackContainer';
import { InputField } from '../common/new/InputField';
import { GenericBottomPopupButton, TH__GenericPopupContainer } from '../common/new/Popup';

const PopupContainer = styled(TH__GenericPopupContainer)`
    height: 280px;
    width: 400px;
    display: grid;
    grid-template-rows: 4fr 1fr;
`;

const PopupContainerTopHalfStyled = styled(VerticalStackContainer)`
    gap: 10px;
`;

const PopupContainerBottomHalfStyled = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
`;

const PopupButton = GenericBottomPopupButton;

const ChangePasswordButton = styled(PopupButton)`
    :hover {
        background-color: red;
        color: white;
    }
`;

const PopupContainerTitle = styled.h1`
    padding-top: 1rem;
    padding-bottom: 1rem;
    font-size: 1.5rem;
    text-align: center;
`;

const PopupWindow: FC = () => {
    const { pushError, pushSuccess } = useSnackbar();
    const { popWindow: pop } = useWindow();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const token = useToken();
    const onClickCancel = useCallback(() => {
        pop();
    }, [pop]);
    const onClickChangePassword = useCallback(async () => {
        const res = await AuthService.changePassword(token, oldPassword, newPassword);
        if (res.success) {
            pushSuccess(res.payload);
            pop();
        } else {
            pushError(res.message);
        }
    }, [newPassword, oldPassword, token, pushError, pushSuccess, pop]);
    return (
        <PopupContainer onClick={e => e.stopPropagation()}>
            <PopupContainerTopHalfStyled>
                <PopupContainerTitle>Change Password</PopupContainerTitle>
                <InputField
                    label="Old Password"
                    placeholder="old password"
                    value={oldPassword}
                    onValueChange={setOldPassword}
                />
                <InputField
                    label="New Password" 
                    placeholder="new password"
                    value={newPassword}
                    onValueChange={setNewPassword}
                />
            </PopupContainerTopHalfStyled>
            <PopupContainerBottomHalfStyled>
                <PopupButton onClick={onClickCancel}>Cancel</PopupButton>
                <ChangePasswordButton onClick={onClickChangePassword}>Change Password</ChangePasswordButton>
            </PopupContainerBottomHalfStyled>
        </PopupContainer>
    )
};


const ChangePasswordWindow: FC = () => {
    return (
        <BlurBackgroundCover dismissOnClick>
            <PopupWindow/>
        </BlurBackgroundCover>
    );
}

export default ChangePasswordWindow;