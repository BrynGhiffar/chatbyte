import useAppStore from "@/store/AppStore";
import { useColorConfig, useSelectedContact } from "@/store/AppStore/hooks";
import { useAvatarImage } from "@/utility/UtilityHooks";
import { FC, useState } from "react";
import { TH__ChatListItemContainer } from "../styled";
import { ProfilePicture, ProfilePictureWithStatus } from "@/components/common/ProfilePicture";
import { SC__Description, SC__DescriptionMessage, SC__DescriptionName, SC__DescriptionNotification, SC__DescriptionNotificationIcon, SC__DescriptionTime } from "./styled";

type ConversationItemProps = {
    uid: number;
    type: "DIRECT" | "GROUP";
    name: string;
    time: string;
    message: string;
    unread_count: number;
    online?: boolean;
    deleted: boolean;
};


const ConversationItem: FC<ConversationItemProps> = (props) => {
    const [hover, setHover] = useState(false);
    const unread_count = props.unread_count > 9 ? "9+" : `${props.unread_count}`
    const contact = useSelectedContact();
    const selectContact = useAppStore(s => s.selectContact);
    const selected = props.uid === contact?.id && props.type === contact?.type;
    const chopLength = 15;
    const message = props.message.length > chopLength ? `${props.message.slice(0, chopLength)}...` : props.message;
    const onClickListItem = () => {
        selectContact(props.type, props.uid);
    };
    const [avatarImage, ] = useAvatarImage(props.uid, props.type);
    const backgroundColor = useColorConfig().chatListBackgroundColor;
    const hoverBackgroundColor = useColorConfig().chatListItemHoverColor;
    const selectedBackgroundColor = useColorConfig().chatListItemSelectedColor;
    let statusOutlineColor = backgroundColor;
    if (hover) statusOutlineColor = hoverBackgroundColor;
    if (selected) statusOutlineColor = selectedBackgroundColor;
    let descriptionMessage = message;
    return (
        <TH__ChatListItemContainer
            $selected={selected} 
            onClick={onClickListItem}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {
                props.online !== undefined ? (
                    <ProfilePictureWithStatus 
                        width={60} 
                        imageUrl={avatarImage} 
                        statusOutlineColor={statusOutlineColor}
                        online={props.online}
                    />
                ) : (
                    <ProfilePicture
                        width={60}
                        imageUrl={avatarImage}
                    />
                )
            }
            <SC__Description>
                <SC__DescriptionName>{props.name}</SC__DescriptionName>
                <SC__DescriptionTime>{props.time}</SC__DescriptionTime>
                <SC__DescriptionMessage>{ props.deleted ? <p>{message} <em>Message has been deleted</em></p> : message}</SC__DescriptionMessage>
                <SC__DescriptionNotification>
                    { props.unread_count > 0 ? 
                        (
                            <SC__DescriptionNotificationIcon>
                                {unread_count}
                            </SC__DescriptionNotificationIcon>
                        ) : (<></>)
                    }
                </SC__DescriptionNotification>
            </SC__Description>
        </TH__ChatListItemContainer>
    );
};

export default ConversationItem;