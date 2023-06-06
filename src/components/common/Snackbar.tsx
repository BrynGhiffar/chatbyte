import { Dispatch, FC, PropsWithChildren, createContext, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { color, commonCss, font } from "../Palette";
import { useEffectOnce, useTimeout, useUpdateEffect } from "usehooks-ts";

type SnackbarContextType = {
    push: (message: string) => void
};

export const SnackbarContext = createContext<SnackbarContextType>({ 
    push: (message: string) => {}
});

export const SnackbarProvider: FC<PropsWithChildren> = (props) => {
    const [ data, setData ] = useState({ message: "", open: false });
    const push = (message: string) => {
        setData(_ => ({
            message: message,
            open: true,
        }));
    };
    const onClose = () => {
        setData(m => ({
            ...m,
            open: false,
        }));
    }
    return (
        <SnackbarContext.Provider value={{ push }}>
            {props.children}
            <Snackbar 
                open={data.open} 
                message={data.message} 
                onClose={onClose}
            />
        </SnackbarContext.Provider>
    )
}

const AppearAnimation = keyframes`
    from {
        opacity: 0;
    }

    to {
        opactiy: 1;
    }
`;

const DisappearAnimation = keyframes`
    from {
        opacity: 1;
    }

    to {
        opacity: 0;
    }
`;

const SnackbarStyled = styled.div<{ $open: boolean }>`
    position: absolute;
    bottom: 10px;
    left: 10px;
    height: 50px;
    min-width: 300px;
    display: none;
    /* background-color: #0079FF; */
    /* background-color: #CD1818; */
    /* background-color: #1B9C85; */
    /* background-color: ${color.seaGreen}; */
    /* background-color: #060505; */
    background-color:#f95959 ;
    border-radius: 4px;
    display: grid;
    grid-template-columns: auto 50px;
    box-shadow: 0px 0px 5px 3px rgba(0, 0, 0, 0.2);
    /* animation-name: ${props => props.$open ? AppearAnimation : DisappearAnimation}; */
    /* animation-duration: 1s; */

    transition: visibility 200ms linear, opacity 200ms linear;
    ${
        props => props.$open ? css`
            visibility: visible;
            opacity: 1;
        ` : css`
            visibility: hidden;
            opacity: 0;
            /* transition: visibility 0s linear 200ms, opacity 200ms linear; */
        `
    }
`;

const CloseSnackbarButton = styled.button`
    ${commonCss.transition}
    outline: none;
    border: none;
    background-color: transparent;
    cursor: pointer;
    :hover {
        background-color: rgba(0, 0, 0, 0.2);
    }
    display: grid;
    align-content: center;
    justify-content: center;

    > svg {
        height: 25px;
        /* color: #CD1818; */
        color: black;
    }
`;

const CloseSVG: FC = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z" fill="currentColor"/></svg>
);

const SnackbarDescription = styled.div`
    display: grid;
    align-content: center;
    padding: 0 1rem;
    font-family: ${font.appleFont};
    /* font-size: 0.8rem; */
`;

type SnackbarProps = {
    open?: boolean;
    timeout?: number;
    onClose?: () => void;
    message?: string;
}

const Snackbar: FC<SnackbarProps> = (props) => {
    const open = props.open ?? false;
    const timeout = props.timeout ?? 4000;
    const onClose = props.onClose ?? (() => {});

    useEffectOnce(() => {
        if (open) {
            const id = setTimeout(onClose, timeout);
            return () => {
                clearInterval(id);
            };
        }
    })

    useUpdateEffect(() => {
        if (open) {
            const id = setTimeout(onClose, timeout);
            return () => {
                clearInterval(id);
            };
        }
    }, [open]);

    return (
        // open ? 
        // (
        <SnackbarStyled $open={open}>
            <SnackbarDescription>
                {props.message ?? ""}
            </SnackbarDescription>
            <CloseSnackbarButton onClick={onClose}>
                <CloseSVG/>
            </CloseSnackbarButton>
        </SnackbarStyled>
        // )
        // : (
        //     <></>
        // )
    );
};

export default Snackbar;