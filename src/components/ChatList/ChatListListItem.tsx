import styled, { css } from "styled-components";
import { color, colorConfig, commonCss } from "@/components/Palette";
import { ProfilePicture, ProfilePictureWithStatus } from "@/components/common/ProfilePicture";
import { FC } from "react";
import { useAvatarImage } from "@/utility/UtilityHooks";
import { useAppStore } from "@/store/AppStore/store";
import { useSelectedContact } from "@/store/AppStore/hooks";

const ChatListListItemStyled = styled.div<{ $selected: boolean }>`
  ${commonCss.transition}
  height: 80px;
  background-color: ${props => props.$selected ? colorConfig.chatListItemSelectedColor : 'transparent'};
  color: ${colorConfig.chatListTextColor};
  display: grid;
  grid-template-columns: 60px 1fr;
  align-items: center;
  gap: 0.9rem;
  padding-left: 0.5rem;
  cursor: pointer;
  user-select: none;

  :hover {
    background-color: ${colorConfig.chatListItemHoverColor};
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
    type: "DIRECT" | "GROUP";
    name: string;
    time: string;
    message: string;
    unread_count: number;
    online?: boolean;
};

export const ChatListListItem: FC<ChatListListItemProps> = (props) => {
    const unread_count = props.unread_count > 9 ? "9+" : `${props.unread_count}`
    const contact = useSelectedContact();
    const selectContact = useAppStore(s => s.selectContact);
    const selected = props.uid === contact?.id && props.type === contact?.type;
    const chopLength = 15;
    const message = props.message.length > chopLength ? `${props.message.slice(0, 15)}...` : props.message;
    const onClickListItem = () => {
        selectContact(props.type, props.uid);
    };
    const [avatarImage, ] = useAvatarImage(props.uid, props.type);
    return (
        <ChatListListItemStyled $selected={selected} onClick={onClickListItem}>
            {
                props.online !== undefined ? (
                    <ProfilePictureWithStatus 
                        width={60} 
                        imageUrl={avatarImage} 
                        statusOutlineColor={colorConfig.chatListBackgroundColor}
                        online={props.online}
                    />
                ) : (
                    <ProfilePicture
                        width={60}
                        imageUrl={avatarImage}
                    />
                )
            }
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
    type: "DIRECT" | "GROUP";
    name: string;
    online: boolean;
};

export const ChatContactListItem: FC<ChatContactListItemProps> = (props) => {
    const selectContact = useAppStore(s => s.selectContact);
    const selected = false;
    const onClickListItem = () => {
        selectContact(props.type, props.uid);
    };
    const [avatarImage, ] = useAvatarImage(props.uid);
    return (
        <ChatListListItemStyled $selected={selected} onClick={onClickListItem}>
            <ProfilePictureWithStatus
                online={props.online}
                width={60} 
                imageUrl={avatarImage} 
                statusOutlineColor={colorConfig.chatListBackgroundColor}
            />
            <ChatContactName>{props.name}</ChatContactName>
        </ChatListListItemStyled>
    )
}