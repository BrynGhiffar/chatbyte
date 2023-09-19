import { useAvatarImage } from "@/utility/UtilityHooks";
import { useRef, FC, useEffect, ChangeEvent } from 'react';
import styled from "styled-components";
import { CameraSVG } from "./Svg";

const ImageContainerStyled = styled.div<{imageUrl: string, $diameter: number}>`
    aspect-ratio: 1 / 1;
    width: ${props => props.$diameter}px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    background-size: ${props => props.$diameter}px auto;
    background-image: url(${props => props.imageUrl});
    background-repeat: no-repeat;
    background-position: center;
    border: 3px solid #ededed;
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
        width: 0px;
        color: black;
    }

    :hover {
        background-color: rgba(255,255,255,0.2);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
    }

    :hover > svg {
        width: 50px;
        aspect-ratio: 1 / 1;
    }
`;

const InvisibleInput = styled.input`
    position: absolute;
    visibility: hidden;
    width: 0px;
    height: 0px;
`;

type ProfileUploadImageProps = {
    diameter: number;
    uid?: number;
    onFileChange?: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
}

const ProfileUploadImage: FC<ProfileUploadImageProps> = (props) => {
    const uid = props.uid ?? -1;
    const [imageUrl, reload] = useAvatarImage(uid);
    const inputRef = useRef<HTMLInputElement>(null);
    return (
        <ImageContainerStyled imageUrl={imageUrl} $diameter={props.diameter}>
        <AttemptBlur
            onClick={() => inputRef.current?.click()}
        >
            <CameraSVG/>
            <InvisibleInput
                ref={inputRef} 
                type='file'
                accept='image/*'
                onChange={async (e) => {
                    if (!props.onFileChange) return;
                    await props.onFileChange(e);
                    reload();
                }}
            />
        </AttemptBlur>
    </ImageContainerStyled>
    );
};

export default ProfileUploadImage;