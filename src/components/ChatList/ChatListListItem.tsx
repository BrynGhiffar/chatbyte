import styled from "styled-components";
import { color, commonCss } from "@/components/Palette";
import { ProfilePicture } from "@/components/common/ProfilePicture";
import { FC } from "react";
import { useAvatarImage, useChatListContext, useSelectContact } from "@/utility/UtilityHooks";
import { avatarImageUrl } from "@/service/api/UserService";

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

type ChatListListItemProps = {
    uid: number;
    name: string;
    time: string;
    message: string;
    unread_count: number;
};

export const ChatListListItem: FC<ChatListListItemProps> = (props) => {
    const unread_count = props.unread_count > 9 ? "9+" : `${props.unread_count}`
    const uid = useCurrentContactUid();
    const selectContact = useSelectContact();
    const selected = uid === props.uid;
    const chopLength = 15;
    const message = props.message.length > chopLength ? `${props.message.slice(0, 15)}...` : props.message;
    const onClickListItem = () => {
        selectContact(props.uid);
    };
    const [avatarImage, ] = useAvatarImage(props.uid);
    return (
        <ChatListListItemStyled $selected={selected} onClick={onClickListItem}>
            <ProfilePicture width={60} imageUrl={avatarImage}/>
            <Description>
                <DescriptionName>{props.name}</DescriptionName>
                <DescriptionTime>{props.time}</DescriptionTime>
                <DescriptionMessage>{message}</DescriptionMessage>
                <DescriptionNotification>
                    { props.unread_count > 0 ? 
                        (
                            <DescriptionNotificationIcon>
                                {unread_count}
                            </DescriptionNotificationIcon>
                        ) : (<></>)
                    }
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
    const selectContact = useSelectContact();
    const selected = uid === props.uid;
    const onClickListItem = () => {
        selectContact(props.uid);
    };
    const [avatarImage, ] = useAvatarImage(props.uid);
    return (
        <ChatListListItemStyled $selected={selected} onClick={onClickListItem}>
            <ProfilePicture width={60} imageUrl={avatarImage}/>
            <ChatContactName>{props.name}</ChatContactName>
        </ChatListListItemStyled>
    )
}