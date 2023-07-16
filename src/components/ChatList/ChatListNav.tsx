import { FC, useContext } from "react";
import styled, { css } from "styled-components";
import { color, commonCss } from "../Palette";
import { useChatListContext } from "@/utility/UtilityHooks";
import { WindowContext } from "@/contexts/WindowContext";

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
    background-color: ${color.darkBlue};
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

const MessageSVG: FC = () => {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 8H16M8 12H13M3 10C3 4.64706 5.11765 3 12 3C18.8824 3 21 4.64706 21 10C21 15.3529 18.8824 17 12 17C11.6592 17 11.3301 16.996 11.0124 16.9876L7 21V16.4939C4.0328 15.6692 3 13.7383 3 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

const ContactSVG: FC = () => {
    return (
        <svg fill="currentColor" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z" /></svg>
    )
}

const SettingsSVG: FC = () => {
    return (
        <svg viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="System" transform="translate(-1200.000000, 0.000000)">
                    <g id="settings_2_line" transform="translate(1200.000000, 0.000000)">
                        <path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" id="MingCute" fill-rule="nonzero">
                        </path>
                        <path d="M18,4 C18,3.44772 17.5523,3 17,3 C16.4477,3 16,3.44772 16,4 L16,5 L4,5 C3.44772,5 3,5.44772 3,6 C3,6.55228 3.44772,7 4,7 L16,7 L16,8 C16,8.55228 16.4477,9 17,9 C17.5523,9 18,8.55228 18,8 L18,7 L20,7 C20.5523,7 21,6.55228 21,6 C21,5.44772 20.5523,5 20,5 L18,5 L18,4 Z M4,11 C3.44772,11 3,11.4477 3,12 C3,12.5523 3.44772,13 4,13 L6,13 L6,14 C6,14.5523 6.44772,15 7,15 C7.55228,15 8,14.5523 8,14 L8,13 L20,13 C20.5523,13 21,12.5523 21,12 C21,11.4477 20.5523,11 20,11 L8,11 L8,10 C8,9.44772 7.55228,9 7,9 C6.44772,9 6,9.44772 6,10 L6,11 L4,11 Z M3,18 C3,17.4477 3.44772,17 4,17 L16,17 L16,16 C16,15.4477 16.4477,15 17,15 C17.5523,15 18,15.4477 18,16 L18,17 L20,17 C20.5523,17 21,17.4477 21,18 C21,18.5523 20.5523,19 20,19 L18,19 L18,20 C18,20.5523 17.5523,21 17,21 C16.4477,21 16,20.5523 16,20 L16,19 L4,19 C3.44772,19 3,18.5523 3,18 Z" id="形状" fill="currentColor">
                        </path>
                    </g>
                </g>
            </g>
        </svg>
    );
}

const ButtonStyled = styled.button<{ $selected: boolean }>`
    outline: none;
    border: none;
    ${commonCss.transition}
    border-radius: 4px;
    height: 25px;
    padding: 2px;
    aspect-ratio: 1 / 1;
    background-color: ${props => props.$selected ? color.lightBlue : color.darkBlue};
    cursor: pointer;
    > svg {
        color: white;
    }
    :hover {
        background-color: ${color.lightBlue};
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
            <MessageSVG />
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
}

const useList = () => {
    const { state, setList } = useChatListContext();
    return { list: state.list, setList };
}

const ChatListNav: FC = () => {
    const { list, setList } = useList();
    const { push: pushWindow } = useContext(WindowContext);
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
                <SettingsButton 
                    selected={false} 
                    onClick={onClickSettings}
                />
            </ChatListNavDoubleColumnChild>
        </ChatListNavDoubleColumnParent>
    )
}

export default ChatListNav;