import { FC, useCallback, useRef, useState, PropsWithChildren } from "react";
import styled from "styled-components";
import { commonCss, font } from "../Palette";
import { BlurBackgroundCover } from "../common/BackgroundBlurCover";
import { GenericPopupContainer } from "../common/new/Popup";
import { SidebarContainer, SidebarItemContainer } from "./Sidebar";
import { ProfileSettings } from "./ProfileSettings";
import { ThemeSettings } from "./ThemeSettings";
import { SessionSettings } from "./SessionSettings";
import useAppStore from "@/store/AppStore";

const PopupContainer = styled(GenericPopupContainer)`
    height: 80vh;
    width: 600px;
    display: grid;
    grid-template-columns: 1fr 3fr;
`;

const MenuListContentContainer = styled.div`
    padding-top: 1rem;
    overflow-y: scroll;
    font-family: ${font.appleFont};
    ${commonCss.scrollableCss}
`;

type SidebarItemNormalContainerProps = PropsWithChildren<{
    selected?: boolean;
    onClick?: () => void;
}>;

const SidebarItemNormalContainer: FC<SidebarItemNormalContainerProps> = (props) => {
    return (
        <SidebarItemContainer
            $focusBgColor="rgba(200,200,200,0.2)"
            $selected={props.selected}
            onClick={props.onClick}
        >
            {props.children}
        </SidebarItemContainer> 
    );
}

type SettingsSection = "PROFILE" | "THEME" | "SESSION";

const Popup: FC = () => {
    const [section, setSection] = useState<SettingsSection>("PROFILE");
    const pushWindow = useAppStore(s => s.pushWindow);
    const onClickProfileSection = useCallback(() => {
        setSection("PROFILE");
    }, [setSection]);
    const onClickThemeSection = useCallback(() => {
        setSection("THEME");
    }, [setSection]);
    const onClickSesionSection = useCallback(() => {
        setSection("SESSION");
    }, [setSection]);
    const onClickLogout = useCallback(() => {
        pushWindow("LOGOUT_CONFIRM");
    }, [pushWindow]);
    return (
        <PopupContainer onClick={e => e.stopPropagation()}>
            <SidebarContainer>
                <SidebarItemContainer>Settings</SidebarItemContainer>
                <SidebarItemNormalContainer
                    selected={section === "PROFILE"}
                    onClick={onClickProfileSection}
                >
                    Profile
                </SidebarItemNormalContainer>
                <SidebarItemNormalContainer
                    selected={section === "THEME"}
                    onClick={onClickThemeSection}
                >
                    Theme
                </SidebarItemNormalContainer>
                <SidebarItemNormalContainer
                    selected={section === "SESSION"}
                    onClick={onClickSesionSection}
                >
                    Session
                </SidebarItemNormalContainer>
                <SidebarItemContainer
                    $focusBgColor="rgba(255,0,0,0.9)"
                    $selected={false}
                    onClick={onClickLogout}
                >
                    Log Out
                </SidebarItemContainer>
            </SidebarContainer>
            <MenuListContentContainer>
                {section === "PROFILE" && <ProfileSettings/>}
                {section === "THEME" && <ThemeSettings/>}
                {section === "SESSION" && <SessionSettings/>}
            </MenuListContentContainer>
        </PopupContainer>
    )
}


const SettingsNewWindow: FC = () => {
    return (
        <BlurBackgroundCover dismissOnClick>
            <Popup/>
        </BlurBackgroundCover>
    )
};

export default SettingsNewWindow;