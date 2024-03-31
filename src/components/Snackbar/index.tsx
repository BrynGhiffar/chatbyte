import useAppStore from "@/store/AppStore";
import { AnimatePresence, motion } from "framer-motion";
import { FC, PropsWithChildren, createContext } from "react";
import styled, { keyframes } from "styled-components";
import { useEffectOnce } from "usehooks-ts";
import { commonCss, font } from "../Palette";
import { CloseSVG } from "../common/Svg";

type SnackbarType = "success" | "failure";

type SnackbarContextType = {
    pushError: (message: string) => void
    pushSuccess: (message: string) => void
};

type SnackbarMessage = {
    id: number;
    message: string;
    type: SnackbarType;
}

const SnackbarContext = createContext<SnackbarContextType>({ 
    pushError: (message: string) => {},
    pushSuccess: (message: string) => {},
});

export const SnackbarProvider: FC<PropsWithChildren> = (props) => {
    const [snackbarMessage, removeMessage] = useAppStore(s => [s.snackbarMessage, s.removeSnackbarMessage]);
    const onClose = (id: number) => () => removeMessage(id);
    return (
        <>
            {props.children}
            <SnackbarContainerStyled>
                <AnimatePresence mode="popLayout">
                    {
                        snackbarMessage.map(ob => (
                            <Snackbar 
                                key={ob.id}
                                message={ob.message} 
                                onClose={onClose(ob.id)}
                                type={ob.type}
                            />
                        ))
                    }
                </AnimatePresence>
            </SnackbarContainerStyled>
        </>
    );
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
    pointer-events: none;
    > *{
        pointer-events: auto;
    }
`;

const SnackbarStyled = styled(motion.div)<{backgroundColor: string}>`
    height: 50px;
    min-width: 300px;
    display: none;
    background-color:${props => props.backgroundColor} ;
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
    type?: SnackbarType;
    onClose?: () => void;
    message?: string;
}

const Snackbar: FC<SnackbarProps> = (props) => {
    const timeout = props.timeout ?? 4000;
    const onClose = props.onClose ?? (() => {});
    const type = props.type ?? "failure";
    const backgroundColor = type === "failure" ? "#f95959" : "#42b883";

    useEffectOnce(() => {
        const id = setTimeout(onClose, timeout);
        return () => {
            clearInterval(id);
        };
    });

    return (
        <SnackbarStyled
            backgroundColor={backgroundColor}
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