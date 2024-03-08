import { DivProps } from '@/misc/types';
import useAppStore from '@/store/AppStore';
import { HTMLMotionProps, motion } from 'framer-motion';
import { FC, PropsWithChildren, forwardRef } from 'react';
import styled from "styled-components";

const BlurBackgroundCoverStyled = styled(motion.div)`
    width: 100%;
    height: 100%;
    /* background-color: transparent; */
    /* border: 1px solid red; */
    /* backdrop-filter: blur(4px); */
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
`;

type BlurBackgroundCoverProps = PropsWithChildren<{
    dismissOnClick?: boolean;
    key?: string;
} & DivProps>;

export const BlurBackgroundCover: FC<BlurBackgroundCoverProps> = ({ key, children, dismissOnClick, ...props}) => {
    const pop = useAppStore(s => s.popWindow);
    const variants = {
        initial: { opacity: 0, scale: 0.8, backdropFilter: 'blur(0px)' },
        animate: { opacity: 1, scale: 1, backdropFilter: 'blur(4px)' },
        exit: {opacity: 0, scale: 0.8 },
        transition: { type: "easeInOut" }
    };
    return (
        <BlurBackgroundCoverStyled
            key={key}
            variants={variants}
            // initial={{opacity: 0, scale: 0.8, backdropFilter: 'blur(0px)' }}
            // animate={{opacity: 1, scale: 1, backdropFilter: 'blur(4px)' }}
            // exit={{opacity: 0, scale: 0.8 }}
            initial="initial"
            animate="animate"
            exit="exit"
            // transition={{ ease: "easeInOut" }}
            // transition={variants.transition}
            onClick={e => {
                e.stopPropagation();
                if (dismissOnClick) {
                    pop();
                }
            }}
            {...props as HTMLMotionProps<"div">}
        >
            {children}
        </BlurBackgroundCoverStyled>
    )
};