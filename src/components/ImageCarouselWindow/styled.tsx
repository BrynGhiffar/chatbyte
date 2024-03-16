import { BaseHTMLImgProps, ButtonWrapper, DivWrapper } from "@/misc/types";
import { useColorConfig } from "@/store/AppStore/hooks";
import styled from "styled-components";

const SC__ImageCarouselContainer = styled.div`
    display: grid;
    grid-template-columns: 40px auto 40px;
    gap: 10px;
`;

type SC__ImageCarouselImageProps = {
    $width: number;
}

const SC__ImageCarouselImage = styled.img<SC__ImageCarouselImageProps>`
    padding-left: calc((60vw - min(60vw, ${props => props.$width}px)) / 2);
    padding-right: calc((60vw - min(60vw, ${props => props.$width}px)) / 2);
    width: min(60vw, ${props => props.$width}px);
    height: 80vh;
    object-fit: contain;
`;

type SC__ImageCarouselButtonsProps = {
    $backgroundColor: string;
    $borderColor: string;
    $iconColor: string;
}

const SC__ImageCarouselButton = styled.button<SC__ImageCarouselButtonsProps>`
    background-color: transparent;
    border: none;
    cursor: pointer;
    height: 40px;
    padding: 5px;
    background-color: ${props => props.$backgroundColor};
    border: 1px solid ${props => props.$borderColor};
    aspect-ratio: 1 / 1;
    border-radius: 50%;

    > svg {
        aspect-ratio: 1 / 1;
        color: ${props => props.$iconColor};
    }
`;

const SC__ImageCarouselButtonContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const TH__ImageCarouselContainer: DivWrapper = ({ children, ...props }) => {
    return (
        <SC__ImageCarouselContainer { ...props }>
            { children }
        </SC__ImageCarouselContainer>
    );
}

export const TH__ImageCarouselImage: BaseHTMLImgProps<{ $width: number }> = ({ children, ...props }) => {
    return (
        <SC__ImageCarouselImage { ...props }/>
    );
}

export const TH__ImageCarouselButton: ButtonWrapper = ({ children, ...props }) => {
    const backgroundColor = useColorConfig()
        .imageCarousel
        .buttonBackgroundColor;
    const iconColor = useColorConfig()
        .imageCarousel
        .buttonIconColor;
    const borderColor = useColorConfig()
        .imageCarousel
        .buttonBorderColor;
    return (
        <SC__ImageCarouselButton
            $backgroundColor={backgroundColor}
            $iconColor={iconColor}
            $borderColor={borderColor}
            { ...props }
        >
            { children }
        </SC__ImageCarouselButton>
    )
}

export const TH__ImageCarouselButtonContainer: DivWrapper = ({ children, ...props }) => {
    return (
        <SC__ImageCarouselButtonContainer { ...props }>
            { children }
        </SC__ImageCarouselButtonContainer>
    )
}