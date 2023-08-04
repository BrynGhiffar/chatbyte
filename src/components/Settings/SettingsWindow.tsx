import { FC, useRef, useCallback, ChangeEvent, useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { color, commonCss } from '../Palette';
import { InputField } from '../common/InputField';
import { Button } from '../common/Button';
import { CloseSVG } from '../common/Svg';
import { WindowContext } from '@/contexts/WindowContext';
import { UserService, avatarImageUrl } from '@/service/api/UserService';
import { LocalStorage } from '@/utility/LocalStorage';
import { useAvatarImage } from '@/utility/UtilityHooks';

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
    height: 220px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    background-size: contain;
    background-image: url(${props => props.imageUrl});
`;

const CameraSVG: FC = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clip-rule="evenodd" d="M3.46447 3.46447C2 4.92893 2 7.28595 2 12C2 16.714 2 19.0711 3.46447 20.5355C4.92893 22 7.28595 22 12 22C16.714 22 19.0711 22 20.5355 20.5355C22 19.0711 22 16.714 22 12C22 7.28595 22 4.92893 20.5355 3.46447C19.0711 2 16.714 2 12 2C7.28595 2 4.92893 2 3.46447 3.46447ZM7.25 12C7.25 9.37665 9.37665 7.25 12 7.25C14.6234 7.25 16.75 9.37665 16.75 12C16.75 14.6234 14.6234 16.75 12 16.75C9.37665 16.75 7.25 14.6234 7.25 12ZM8.75 12C8.75 10.2051 10.2051 8.75 12 8.75C13.7949 8.75 15.25 10.2051 15.25 12C15.25 13.7949 13.7949 15.25 12 15.25C10.2051 15.25 8.75 13.7949 8.75 12Z" fill="currentColor"/>
    </svg>
)

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

    const onFileChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files === null) return;
        const file = e.target.files[0];
        if (!file) return;
        const token = LocalStorage.getLoginToken();
        if (!token) return;
        await UserService.uploadUserAvatar(token, file);
        props.reloadImage();
    }, []);

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
    const { pop: popWindow } = useContext(WindowContext);
    return (
            <CloseButtonStyled onClick={popWindow}>
                <CloseSVG/>
            </CloseButtonStyled>
    )
}


const UserDataSection: FC = props => {
    const { pop: popWindow } = useContext(WindowContext);
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
    const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
    useEffect(() => {
        const run = async () => {
            const token = LocalStorage.getLoginToken();
            if (!token) return;
            const res = await UserService.getUserDetails(token);
            if (!res.success) return;
            setUserDetail(_ => res.payload);
        };
        run();
    }, [setUserDetail]);
    const uid = userDetail !== null ? userDetail.uid : null;
    const [imageUrl, reload] = useAvatarImage(uid);
    return (<SettingsWindowStyled>
        <CloseButton/>
        <ProfilePictureSection imageUrl={imageUrl} reloadImage={reload}/>
        <UserDataSection/>
    </SettingsWindowStyled>)
};