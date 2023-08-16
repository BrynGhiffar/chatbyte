import { Dispatch, FC, PropsWithChildren, createContext, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { color, commonCss, font } from "../Palette";
import { useEffectOnce, useTimeout, useUpdateEffect } from "usehooks-ts";
import { CloseSVG } from "./Svg";
import { motion, AnimatePresence } from "framer-motion";

type SnackbarContextType = {
    push: (message: string) => void
};

type SnackbarMessage = {
    id: number;
    message: string;
}

export const SnackbarContext = createContext<SnackbarContextType>({ 
    push: (message: string) => {}
});

export const SnackbarProvider: FC<PropsWithChildren> = (props) => {
    const [ data, setData ] = useState<SnackbarMessage[]>([]);
    const push = (message: string) => {
        const id = Math.floor(Math.random() * 1_000);
        const snackbarMessage = { id, message }
        setData(prev => ([snackbarMessage, ...prev]));
    };
    const onClose = (id: number) => {
        return () => {
            setData(prev => prev.filter(ob => ob.id !== id));
        }
    }
    return (
        <SnackbarContext.Provider value={{ push }}>
            {props.children}
            <SnackbarContainerStyled>
                <AnimatePresence mode="popLayout">
                    {
                        data.map(ob => (
                            <Snackbar 
                                key={ob.id}
                                message={ob.message} 
                                onClose={onClose(ob.id)}
                            />
                        ))
                    }
                </AnimatePresence>
            </SnackbarContainerStyled>
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


const SnackbarContainerStyled = styled.div`
    position: absolute;
    bottom: 10px;
    left: 10px;
    top: 10px;
    min-width: 300px;
    /* outline: 1px solid red; */
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 10px;
    grid-template-rows: auto;
`;

const SnackbarStyled = styled(motion.div)`
    height: 50px;
    min-width: 300px;
    display: none;
    background-color:#f95959 ;
    border-radius: 4px;
    display: grid;
    grid-template-columns: auto 50px;
    box-shadow: 0px 0px 5px 3px rgba(0, 0, 0, 0.2);
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


const SnackbarDescription = styled.div`
    display: grid;
    align-content: center;
    padding: 0 1rem;
    font-family: ${font.appleFont};
    /* font-size: 0.8rem; */
`;

type SnackbarProps = {
    timeout?: number;
    onClose?: () => void;
    message?: string;
}

const Snackbar: FC<SnackbarProps> = (props) => {
    const timeout = props.timeout ?? 4000;
    const onClose = props.onClose ?? (() => {});

    useEffectOnce(() => {
        const id = setTimeout(onClose, timeout);
        return () => {
            clearInterval(id);
        };
    });

    return (
        <SnackbarStyled
            layout
            initial={{opacity: 0, scale: 0.8 }}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0, scale: 0.8}}
            transition={{ ease: "easeInOut" }}
        >
            <SnackbarDescription>
                {props.message ?? ""}
            </SnackbarDescription>
            <CloseSnackbarButton onClick={onClose}>
                <CloseSVG/>
            </CloseSnackbarButton>
        </SnackbarStyled>
    );
};

export default Snackbar;