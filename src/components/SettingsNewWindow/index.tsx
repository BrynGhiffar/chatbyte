import { FC, useCallback, useRef, useState, PropsWithChildren } from "react";
import styled from "styled-components";
import { commonCss, font } from "../Palette";
import { BlurBackgroundCover } from "../common/BackgroundBlurCover";
import { ProfileSettings } from "./ProfileSettings";
import { ThemeSettings } from "./ThemeSettings";
import { SessionSettings } from "./SessionSettings";
import useAppStore from "@/store/AppStore";
import { TH__SidebarContainer, TH__SidebarItemContainer } from "./styled";
import { TH__GenericPopupContainer } from "../common/new/Popup";

const PopupContainer = styled(TH__GenericPopupContainer)`
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
        <TH__SidebarItemContainer
            $focusBgColor="rgba(200,200,200,0.2)"
            $selected={props.selected}
            onClick={props.onClick}
        >
            {props.children}
        </TH__SidebarItemContainer> 
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
            <TH__SidebarContainer>
                <TH__SidebarItemContainer>Settings</TH__SidebarItemContainer>
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
                <TH__SidebarItemContainer
                    $focusBgColor="rgba(255,0,0,0.9)"
                    $selected={false}
                    onClick={onClickLogout}
                >
                    Log Out
                </TH__SidebarItemContainer>
            </TH__SidebarContainer>
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