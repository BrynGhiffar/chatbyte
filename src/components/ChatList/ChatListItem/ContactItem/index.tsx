import { ProfilePictureWithStatus } from "@/components/common/ProfilePicture";
import useAppStore from "@/store/AppStore";
import { useColorConfig } from "@/store/AppStore/hooks";
import { useAvatarImage } from "@/utility/UtilityHooks";
import { FC, useState } from "react";
import { TH__ChatListItemContainer } from "../styled";
import { SC__ChatContactName } from "./styled";

type ContactItemProps = {
    uid: number;
    type: "DIRECT" | "GROUP";
    name: string;
    online: boolean;
};

const ContactItem: FC<ContactItemProps> = (props) => {
    const [hover, setHover] = useState(false);
    const selectContact = useAppStore(s => s.selectContact);
    const selected = false;
    const onClickListItem = () => {
        selectContact(props.type, props.uid);
    };
    const [avatarImage, ] = useAvatarImage(props.uid);
    const backgroundColor = useColorConfig().chatListBackgroundColor;
    const hoverBackgroundColor = useColorConfig().chatListItemHoverColor;
    return (
        <TH__ChatListItemContainer
            $selected={selected} 
            onClick={onClickListItem}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <ProfilePictureWithStatus
                online={props.online}
                width={60} 
                imageUrl={avatarImage} 
                statusOutlineColor={(hover || selected) ? hoverBackgroundColor : backgroundColor}
            />
            <SC__ChatContactName>{props.name}</SC__ChatContactName>
        </TH__ChatListItemContainer>
    )
}

export default ContactItem;