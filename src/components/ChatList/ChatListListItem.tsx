import styled from "styled-components";
import { color, commonCss } from "@/components/Palette";
import { ProfilePicture } from "@/components/common/ProfilePicture";
import { FC } from "react";
import { useChatListContext } from "@/utility/UtilityHooks";

const ChatListListItemStyled = styled.div<{ $selected: boolean }>`
  ${commonCss.transition}
  height: 80px;
  background-color: ${props => props.$selected ? color.darkBlue : color.lightBlue};
  color: white;
  display: grid;
  grid-template-columns: 60px 1fr;
  align-items: center;
  gap: 0.9rem;
  padding-left: 0.5rem;
  cursor: pointer;
  user-select: none;

  :hover {
    background-color: ${color.darkBlue};
  }

  > * {
    height: 60px;
  }
`;

const Description = styled.div`
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 1fr;
    padding-right: 1rem;
`;

const AlignCenterSpan = styled.span`
    display: flex;
    align-items: center;
`;

const AlignCenterEndSpan = styled(AlignCenterSpan)`
    justify-content: end;
`

const DescriptionName = styled(AlignCenterSpan)`
    font-weight: bold;
`;

const DescriptionTime = styled(AlignCenterEndSpan)``;

const DescriptionMessage = AlignCenterSpan;

const DescriptionNotification = AlignCenterEndSpan;

const DescriptionNotificationIcon = styled.div`
    height: 1.3rem;
    aspect-ratio: 1 / 1;
    background-color: ${color.seaGreen}; 
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.8rem;
`;

export const ChatListListItem: FC = () => {
    return (
        <ChatListListItemStyled $selected={false}>
            <ProfilePicture width={60} />
            <Description>
                <DescriptionName>Jack</DescriptionName>
                <DescriptionTime>10:55</DescriptionTime>
                <DescriptionMessage>Hello World</DescriptionMessage>
                <DescriptionNotification>
                    <DescriptionNotificationIcon>
                        9+
                    </DescriptionNotificationIcon>
                </DescriptionNotification>
            </Description>
        </ChatListListItemStyled>
    );
};

const ChatContactName = styled.span`
    display: grid;
    align-content: center;
    font-weight: bold;
`;

type ChatContactListItemProps = {
    uid: number;
    name: string
};

const useCurrentContactUid = () => {
    const { state } = useChatListContext();
    if (state.selectedContact)
    {
        return state.selectedContact.uid;
    }
    return null;
}

export const ChatContactListItem: FC<ChatContactListItemProps> = (props) => {
    const uid = useCurrentContactUid();
    const { selectContact } = useChatListContext();
    const selected = uid === props.uid;
    const onClickListItem = () => {
        selectContact(props.uid);
    };
    return (
        <ChatListListItemStyled $selected={selected} onClick={onClickListItem}>
            <ProfilePicture width={60}/>
            <ChatContactName>{props.name}</ChatContactName>
        </ChatListListItemStyled>
    )
}