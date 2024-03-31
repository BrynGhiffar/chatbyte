import { FC, useRef, useState } from 'react';

import { toBase64 } from '@/utility/UtilityFunctions';
import { useAvatarImage } from '@/utility/UtilityHooks';

import styled from 'styled-components';

import { CameraSVG } from './Svg';

const ImageContainerStyled = styled.div<{
  imageUrl: string;
  $diameter: number;
}>`
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
    background-color: rgba(255, 255, 255, 0.2);
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
  onFileChange?: (e: File) => Promise<void>;
};

const ProfileUploadImage: FC<ProfileUploadImageProps> = props => {
  const uid = props.uid ?? 0;
  const [imageUrl, reload] = useAvatarImage(uid);
  const [base64, setBase64] = useState(imageUrl);

  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <ImageContainerStyled
      imageUrl={props.uid ? imageUrl : base64}
      $diameter={props.diameter}
    >
      <AttemptBlur onClick={() => inputRef.current?.click()}>
        <CameraSVG />
        <InvisibleInput
          ref={inputRef}
          type='file'
          accept='image/*'
          onChange={async e => {
            const files = e.target.files;
            if (!files) return;
            const file = files[0];
            if (!file) return;
            if (!props.uid) {
              setBase64((await toBase64(file)) as string);
            }
            if (!props.onFileChange) return;
            await props.onFileChange(file);
            reload();
          }}
        />
      </AttemptBlur>
    </ImageContainerStyled>
  );
};

export default ProfileUploadImage;
