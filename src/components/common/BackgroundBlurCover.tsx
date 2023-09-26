import { WindowContext } from '@/contexts/WindowContext';
import { useAppStore } from '@/store/AppStore/store';
import { motion } from 'framer-motion';
import { FC, PropsWithChildren } from 'react';
import styled from "styled-components";

const BlurBackgroundCoverStyled = styled(motion.div)`
    width: 100%;
    height: 100%;
    /* background-color: transparent; */
    /* border: 1px solid red; */
    /* backdrop-filter: blur(4px); */
    
    display: flex;
    justify-content: center;
    align-items: center;
`;

type BlurBackgroundCoverProps = PropsWithChildren<{
    dismissOnClick?: boolean;
}>;

export const BlurBackgroundCover: FC<BlurBackgroundCoverProps> = (props) => {
    const pop = useAppStore(s => s.popWindow);
    return (
        <BlurBackgroundCoverStyled
            initial={{opacity: 0, scale: 0.8, backdropFilter: 'blur(0px)'}}
            animate={{opacity: 1, scale: 1, backdropFilter: 'blur(4px)'}}
            exit={{opacity: 0}}
            transition={{ ease: "easeInOut", }}
            onClick={e => {
                e.stopPropagation();
                if (props.dismissOnClick) {
                    pop();
                }
            }}
        >
            {props.children}
        </BlurBackgroundCoverStyled>
    )
};