import { FC } from "react";
import styled from "styled-components";
import { color, commonCss } from "../Palette";

const ChatListNavStyled = styled.div`
    background-color: ${color.darkBlue};
    display: grid;
    align-items: center;
    padding: 0px 1rem;
    grid-auto-flow: column;
    justify-content: flex-start;
    gap: 10px;
`;

const MessageSVG: FC = () => {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 8H16M8 12H13M3 10C3 4.64706 5.11765 3 12 3C18.8824 3 21 4.64706 21 10C21 15.3529 18.8824 17 12 17C11.6592 17 11.3301 16.996 11.0124 16.9876L7 21V16.4939C4.0328 15.6692 3 13.7383 3 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

const ContactSVG: FC = () => {
    return (
        <svg fill="currentColor" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z"/></svg>
    )
}

const ButtonStyled = styled.button`
    outline: none;
    border: none;
    ${commonCss.transition}
    border-radius: 4px;
    height: 25px;
    padding: 2px;
    aspect-ratio: 1 / 1;
    background-color: ${color.darkBlue};
    cursor: pointer;
    > svg {
        color: white;
    }
    :hover {
        background-color: ${color.lightBlue};
    }
`;

const MessageButton: FC = () => {
    return (
        <ButtonStyled>
            <MessageSVG/>
        </ButtonStyled>
    )
};

const ContactButton: FC = () => {
    return (
        <ButtonStyled>
            <ContactSVG/>
        </ButtonStyled>
    )
};

const ChatListNav: FC = () => {
    return (<ChatListNavStyled>
        <MessageButton/>
        <ContactButton/>
    </ChatListNavStyled>)
}

export default ChatListNav;