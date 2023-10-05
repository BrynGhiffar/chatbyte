import { FC, useRef, useCallback, ChangeEvent, useState, useEffect } from 'react';
import styled from 'styled-components';
import { color, commonCss } from '../Palette';
import { InputField } from '../common/InputField';
import { Button } from '../common/Button';
import { BackButtonSVG, CameraSVG, CloseSVG } from '../common/Svg';
import { LocalStorage } from '@/utility/LocalStorage';
import { useAvatarImage, useToken } from '@/utility/UtilityHooks';
import { useWindow } from '@/store/AppStore/hooks';
import { UserService } from '@/api/http/UserService';
import useAppStore from '@/store/AppStore';

const SettingsWindowStyled = styled.div`
    /* position: relative; */
    ${commonCss.scrollableCss}
    height: 100%;
    width: 100%;
    background-color: ${color.darkBlue};
    position: relative;
`;

const ProfilePictureSectionStyled = styled.div`
    padding-top: 40px;
    height: 30%;
    width: 100%;
    background-color: ${color.darkBlue};
    display: grid;
    align-items: center;
    justify-content: center;
`;

const ImageContainerStyled = styled.div<{imageUrl: string}>`
    aspect-ratio: 1 / 1;
    width: 220px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    background-size: 220px auto;
    background-image: url(${props => props.imageUrl});
    background-repeat: no-repeat;
    background-position: center;
`;

const AttemptBlur = styled.div`
    height: 100%;
    width: 100%;
    display: grid;
    justify-content: center;
    align-items: center;

    transition-duration: 100ms;
    transition-property: all;
    transition-timing-function: ease-in;

    > svg {
        color: ${color.kindaWhite};
        width: 0px;
    }

    :hover {
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
    }

    :hover > svg {
        width: 110px;
        aspect-ratio: 1 / 1;
    }
`;

const InvisibleInput = styled.input`
    position: absolute;
    visibility: hidden;
    width: 0px;
    height: 0px;
`;

type ProfilePictureSectionProps = {
    imageUrl: string
    reloadImage: () => void
}

const ProfilePictureSection: FC<ProfilePictureSectionProps> = props => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { reloadImage } = props;

    const onFileChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files === null) return;
        const file = e.target.files[0];
        if (!file) return;
        const token = LocalStorage.getLoginToken();
        if (!token) return;
        await UserService.uploadUserAvatar(token, file);
        reloadImage();
    }, [reloadImage]);

    return (
        <ProfilePictureSectionStyled>
            <ImageContainerStyled imageUrl={props.imageUrl}>
                <AttemptBlur
                    onClick={() => inputRef.current?.click()}
                >
                    <CameraSVG/>
                    <InvisibleInput
                        ref={inputRef} 
                        type='file'
                        accept='image/*'
                        onChange={onFileChange}
                    />
                </AttemptBlur>
            </ImageContainerStyled>
        </ProfilePictureSectionStyled>
    )
}

const UserDataSectionParentStyled = styled.div`
    display: grid;
    column-gap: 3rem;
    grid-template-columns: 1fr 1fr;
    padding-top: 20px;
    background-color: ${color.darkBlue};
    padding-left: 250px;
    padding-right: 250px;
    padding-bottom: 50px;
`;

const CloseButtonStyled = styled(Button)`
    top: 5px;
    left: 5px;
    position: absolute;
    height: 40px;
    width: 40px;
    aspect-ratio: 1 / 1;
    margin: 0px;
    padding: 0px;
`;

const CloseButton: FC = props => {
    const { popWindow } = useWindow();
    return (
            <CloseButtonStyled onClick={popWindow}>
                {/* <CloseSVG/> */}
                <BackButtonSVG/>
            </CloseButtonStyled>
    )
}


const UserDataSection: FC = props => {
    const { popWindow } = useWindow();
    return (
        <>
            <UserDataSectionParentStyled>
                <InputField 
                    label="Username"
                />
                <InputField 
                    label="Email"
                />
                <InputField 
                    label="Password"
                />
            </UserDataSectionParentStyled>
            <UserDataSectionParentStyled>
                <Button>SAVE</Button>
                <Button onClick={popWindow}>CANCEL</Button>
            </UserDataSectionParentStyled>
        </>
    )
};

type UserDetail = {
    uid: number,
    username: string
}

export const SettingsWindow: FC = props => {
    const uid = useAppStore(s => s.loggedInUserId);
    const [imageUrl, reload] = useAvatarImage(uid);
    return (<SettingsWindowStyled>
        <CloseButton/>
        <ProfilePictureSection imageUrl={imageUrl} reloadImage={reload}/>
        <UserDataSection/>
    </SettingsWindowStyled>)
};