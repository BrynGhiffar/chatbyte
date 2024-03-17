import { FC, useCallback } from "react";
import useAppStore from "@/store/AppStore";
import { useAvatarImage } from "@/utility/UtilityHooks";
import { ProfilePictureWithStatus } from "../common/ProfilePicture";
import { useColorConfig } from "@/store/AppStore/hooks";
import { TH__SidebarButton, TH__SidebarContainer, TH__SidebarContainerBottom, TH__SidebarContainerTop } from "./styled";
import { DoubleCaretLeftSVG, DoubleCaretRightSVG, SettingsSVG, SlidersSVG } from "../common/Svg";
import { ButtonMouseEvent, DivMouseEvent } from "@/misc/types";



const Sidebar: FC = () => {
    const userId = useAppStore(s => s.loggedInUserId);
    const [avatarImage] = useAvatarImage(userId);
    const backgroundColor = useColorConfig().settings.sidebarBackgroundColor;
    const pushWindow = useAppStore(s => s.pushWindow);
    const [ showChatList, toggleShowChatList ] = useAppStore(s => ([ s.showChatList, s.toggleShowChatList]))
    const onClickSettingsButtons = useCallback((e: ButtonMouseEvent) => {
      e.stopPropagation();
      pushWindow({ type: "SETTINGS_WINDOW" });
    }, [pushWindow]);
    return (
        <TH__SidebarContainer>
            <TH__SidebarContainerTop>
              <ProfilePictureWithStatus
                  imageUrl={avatarImage} 
                  statusOutlineColor={backgroundColor}
                  online
                  width={40}
              />
            </TH__SidebarContainerTop>
            <TH__SidebarContainerBottom>
                <TH__SidebarButton onClick={toggleShowChatList}>
                    { showChatList ? <DoubleCaretLeftSVG/> : <DoubleCaretRightSVG/> }
                </TH__SidebarButton>
                <TH__SidebarButton onClick={onClickSettingsButtons}>
                    <SlidersSVG/>
                </TH__SidebarButton>
            </TH__SidebarContainerBottom>
        </TH__SidebarContainer>
    )
}

export default Sidebar;