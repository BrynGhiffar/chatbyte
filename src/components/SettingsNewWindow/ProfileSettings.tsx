import styled from "styled-components";
import { Button } from "../common/new/Button";
import { FC, useContext, useCallback, ChangeEvent, useState } from "react";
import { WindowContext } from "@/contexts/WindowContext";
import ProfileUploadImage from "../common/ProfileUploadImage";
import { InputField } from "../common/new/InputField";
import { useChatProfile, useToken } from "@/utility/UtilityHooks";
import { LocalStorage } from "@/utility/LocalStorage";
import { UserService } from "@/service/api/UserService";
import { SnackbarContext } from "../common/Snackbar";


const ProfileDetailContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    width: 100%;
`;

const ProfileTitle = styled.h1`
    padding-left: 1rem;
`;


const ButtonProfile = styled(Button)`
    width: 90%;
`;

const ChangePasswordButton = styled(ButtonProfile)`
    :hover {
        background-color: #ff0000;
        color: white;
    }
`;

export const ProfileSettings: FC = () => {
    const { push } = useContext(WindowContext);
    const { pushError, pushSuccess } = useContext(SnackbarContext);
    const token = useToken();
    const [userId, username] = useChatProfile();
    const [newUsername, setNewUsername] = useState("");
    const onClickChangePassword = useCallback(() => {
        push("CHANGE_PASSWORD");
    }, [push]);
    const onFileChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files === null) return;
        const file = e.target.files[0];
        if (!file) return;
        await UserService.uploadUserAvatar(token, file);
    }, [token]);
    const onClickChangeUsername = useCallback(async () => {
        const res = await UserService.changeUserName(token, newUsername);
        if (res.success) {
            pushSuccess(res.payload);
            return;
        } else {
            pushError(res.message)
            return;
        }
    }, [pushSuccess, pushError, newUsername, token]);
    return (
        <>
            <ProfileTitle>
                Profile
            </ProfileTitle>
            <ProfileDetailContainer>
                <ProfileUploadImage
                    diameter={100}
                    uid={userId}
                    onFileChange={onFileChange}
                />
                <InputField
                    value={newUsername}
                    onValueChange={v => setNewUsername(v)}
                    label="Username" 
                    placeholder={username}
                />
                <ButtonProfile onClick={onClickChangeUsername}>Change Username</ButtonProfile>
                <ChangePasswordButton onClick={onClickChangePassword}>Change Password</ChangePasswordButton>
            </ProfileDetailContainer>
        </>
    )
};

