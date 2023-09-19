import { FC, useCallback, useContext } from 'react';
import { BlurBackgroundCover } from '../common/BackgroundBlurCover';
import styled from 'styled-components';
import { GenericBottomPopupButton, GenericPopupContainer } from '../common/new/Popup';
import { VerticalStackContainer } from '../common/StackContainer';
import ProfileUploadImage from '../common/ProfileUploadImage';
import { InputField, InputFieldSearchableDropDown } from '../common/new/InputField';
import { WindowContext } from '@/contexts/WindowContext';
import { color } from '../Palette';

const PopupContainer = styled(GenericPopupContainer)`
    width: 500px;
    height: 600px;
    overflow: visible;

    display: grid;
    grid-template-rows: auto 50px;
`;

const PopupTitle = styled.h1`
    padding-top: 1rem;
    padding-bottom: 1rem;
`;

const DoubleColumn = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
`;

const CancelButton = styled(GenericBottomPopupButton)`
    border-bottom-left-radius: 10px;
    :hover {
        background-color: red;
        color: white;
    }
`;

const CreateGroupButton = styled(GenericBottomPopupButton)`
    border-bottom-right-radius: 10px;
    :hover {
        background-color: ${color.chatBlue};
        color: white;
    }
`;

export const CreateGroupWindow: FC = () => {
    const { pop } = useContext(WindowContext);
    const onClickCancel = useCallback(() => {
        pop();
    }, [pop]);
    return (
        <BlurBackgroundCover>
            <PopupContainer onClick={e => e.stopPropagation()}>
                <VerticalStackContainer $gap={10}>
                    <PopupTitle>Create Group</PopupTitle>
                    <ProfileUploadImage diameter={100}/>
                    <InputField label='Group Name' placeholder='Awesome Group...'/>
                    <InputFieldSearchableDropDown label="Members" placeholder=''/>
                </VerticalStackContainer>
                <DoubleColumn>
                    <CancelButton
                        onClick={onClickCancel}
                    >Cancel</CancelButton>
                    <CreateGroupButton>Create</CreateGroupButton>
                </DoubleColumn>
            </PopupContainer>
        </BlurBackgroundCover>
    )
};