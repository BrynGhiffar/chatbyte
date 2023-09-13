import { FC, useContext } from "react";
import styled, { css } from "styled-components";
import { color, colorConfig, commonCss } from "../Palette";
import { useChatListContext, useLogout } from "@/utility/UtilityHooks";
import { WindowContext } from "@/contexts/WindowContext";
import { ContactSVG, ExitSVG, Message2SVG, MessageSVG, PowerSymbolSVG, SettingsSVG } from "../common/Svg";

const ChatListNavStyled = styled.div`
    background-color: ${color.darkBlue};
    display: grid;
    align-items: center;
    padding: 0px 1rem;
    grid-auto-flow: column;
    justify-content: flex-start;
    gap: 10px;
`;

const ChatListNavDoubleColumnParent = styled.div`
    background-color: ${colorConfig.chatListNavBackgroundColor};
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0px 1rem;
`;

const ChatListNavDoubleColumnChild = styled.div<{ $side: "left" | "right" }>`
    background-color: transparent;
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    justify-content: ${props => props.$side === "left" ? "flex-start" : "flex-end"};
    gap: 10px;
`

const ButtonStyled = styled.button<{ $selected: boolean }>`
    outline: none;
    border: none;
    ${commonCss.transition}
    border-radius: 4px;
    height: 25px;
    padding: 2px;
    aspect-ratio: 1 / 1;
    background-color: transparent;
    /* background-color: ${props => props.$selected ? colorConfig.chatListNavButtonSelectedBackgroundColor : 'transparent'}; */
    cursor: pointer;
    > svg {
        color: ${props => props.$selected ? colorConfig.chatListNavButtonSelectedColor : colorConfig.chatListNavButtonColor};;
    }
    :hover {
        > svg {
            color: ${colorConfig.chatListNavButtonHoverColor};
        }
        /* background-color: ${colorConfig.chatListNavButtonHoverBackgroundColor}; */
    }
`;

const PowerButton = styled(ButtonStyled)`
background-color: ${colorConfig.chatListNavPowerButtonColor};
    > svg {
        /* color: ${colorConfig.chatListNavPowerButtonColor}; */
        color: white;
    }
    :hover {
        > svg {
            color: white;
            /* color: ${colorConfig.chatListNavPowerButtonColor}; */
        }
    }
`;

type ButtonProps = {
    selected: boolean;
    onClick: () => void;
};

const MessageButton: FC<ButtonProps> = (props) => {
    return (
        <ButtonStyled
            $selected={props.selected}
            onClick={props.onClick}
        >
            <Message2SVG />
        </ButtonStyled>
    )
};

const ContactButton: FC<ButtonProps> = (props) => {
    return (
        <ButtonStyled
            $selected={props.selected}
            onClick={props.onClick}
        >
            <ContactSVG />
        </ButtonStyled>
    )
};

const SettingsButton: FC<ButtonProps> = props => {
    return (
        <ButtonStyled
            $selected={props.selected}
            onClick={props.onClick}
        >
            <SettingsSVG/>
        </ButtonStyled>
    )
};

const LogoutButton: FC<ButtonProps> = props => {
    return (
        <PowerButton
            $selected={props.selected}
            onClick={props.onClick}
        >
            {/* <ExitSVG/> */}
            <PowerSymbolSVG/>
        </PowerButton>
    );
}

const useList = () => {
    const { state, setList } = useChatListContext();
    return { list: state.list, setList };
}

const ChatListNav: FC = () => {
    const { list, setList } = useList();
    const { push: pushWindow } = useContext(WindowContext);
    const logout = useLogout();
    const onClickMessageButton = () => {
        setList("message");
    };
    const onClickContactButton = () => {
        setList("contact");
    };
    const onClickSettings = () => {
        pushWindow("SETTINGS_WINDOW");
    };
    return (
        <ChatListNavDoubleColumnParent>
            <ChatListNavDoubleColumnChild $side="left">
                <MessageButton
                    selected={list === "message"}
                    onClick={onClickMessageButton}
                />
                <ContactButton
                    selected={list === "contact"}
                    onClick={onClickContactButton}
                />
            </ChatListNavDoubleColumnChild>
            <ChatListNavDoubleColumnChild $side="right">
                <LogoutButton
                    selected={false}
                    onClick={logout}
                />
                <SettingsButton 
                    selected={false} 
                    onClick={onClickSettings}
                />
            </ChatListNavDoubleColumnChild>
        </ChatListNavDoubleColumnParent>
    )
}

export default ChatListNav;