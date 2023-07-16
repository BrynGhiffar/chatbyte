import { FC, PropsWithChildren } from "react";
import styled from "styled-components";

const BlurStyled = styled.div`
    position: absolute;
    height: 100vh;
    width: 100vw;    
    color: black;
    z-index: 10;
`;

const Blur: FC<PropsWithChildren> = (props) => {
    return (
        <BlurStyled>
            {props.children}
        </BlurStyled>
    )
};

export default Blur;