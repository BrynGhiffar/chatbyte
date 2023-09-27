import { FC, useCallback, useState } from 'react';
import { BlurBackgroundCover } from '../common/BackgroundBlurCover';
import styled from 'styled-components';
import { GenericBottomPopupButton, TH__GenericPopupContainer } from '../common/new/Popup';
import { VerticalStackContainer } from '../common/StackContainer';
import ProfileUploadImage from '../common/ProfileUploadImage';
import { InputField, InputFieldSearchableDropDown } from '../common/new/InputField';
import { color } from '../Palette';
import { useToken } from '@/utility/UtilityHooks';
import { useSnackbar, useWindow } from '@/store/AppStore/hooks';
import useAppStore from '@/store/AppStore';

const PopupContainer = styled(TH__GenericPopupContainer)`
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
    const { popWindow: pop } = useWindow();
    const { pushSuccess, pushError } = useSnackbar();
    const token = useToken();
    const [ groupName, setGroupName ] = useState("");
    const contacts = useAppStore(s => s.contacts);
    const createChatGroup = useAppStore(s => s.createChatGroup);
    const options = contacts.map(c => ({ id: c.id, label: `${c.name}`, value: `${c.id}`}));
    const [image, setImage] = useState<File | null>(null);
    const [ selected, setSelected ] = useState<number[]>([]);
    const onClickCancel = useCallback(() => {
        pop();
    }, [pop]);

    const onClickCreate = useCallback(async () => {
        await createChatGroup(groupName, selected, image);
    }, [groupName, selected, image, createChatGroup]);

    return (
        <BlurBackgroundCover>
            <PopupContainer onClick={e => e.stopPropagation()}>
                <VerticalStackContainer $gap={10}>
                    <PopupTitle>Create Group</PopupTitle>
                    <ProfileUploadImage diameter={100} onFileChange={async (f) => setImage(f)}/>
                    <InputField 
                        label='Group Name' 
                        placeholder='Awesome Group...' 
                        value={groupName}
                        onValueChange={setGroupName}
                    />
                    <InputFieldSearchableDropDown 
                        label="Members" 
                        placeholder=''
                        options={options}
                        onChangeSelection={setSelected}
                    />
                </VerticalStackContainer>
                <DoubleColumn>
                    <CancelButton
                        onClick={onClickCancel}
                    >Cancel</CancelButton>
                    <CreateGroupButton
                        onClick={onClickCreate}
                    >Create</CreateGroupButton>
                </DoubleColumn>
            </PopupContainer>
        </BlurBackgroundCover>
    )
};