import { WindowContext } from '@/contexts/WindowContext';
import { FC, PropsWithChildren, useContext } from 'react';
import styled from "styled-components";

const BlurBackgroundCoverStyled = styled.div`
    width: 100%;
    height: 100%;
    background-color: transparent;
    backdrop-filter: blur(4px);
    display: flex;
    justify-content: center;
    align-items: center;
`;

type BlurBackgroundCoverProps = PropsWithChildren<{
    dismissOnClick?: boolean;
}>;

export const BlurBackgroundCover: FC<BlurBackgroundCoverProps> = (props) => {
    const { pop } = useContext(WindowContext);
    return (
        <BlurBackgroundCoverStyled
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