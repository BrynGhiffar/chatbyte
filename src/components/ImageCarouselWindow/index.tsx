import { FC, useState, useCallback, useEffect, Suspense, MouseEvent } from "react"
import { BlurBackgroundCover } from "../common/BackgroundBlurCover"
import styled from "styled-components";
import { ChevronLeftSVG, ChevronRightSVG } from "../common/Svg";

type ImageCarouselProps = {
    imageSrcs: string[]
};

const SC__ImageContainer = styled.div`
    display: grid;
    grid-template-columns: 40px auto 40px;
    gap: 10px;
`;

type SC__ImageProps = {
    $width: number;
}

const SC__Image = styled.img<SC__ImageProps>`
    padding-left: calc((60vw - min(60vw, ${props => props.$width}px)) / 2);
    padding-right: calc((60vw - min(60vw, ${props => props.$width}px)) / 2);
    width: min(60vw, ${props => props.$width}px);
    height: 80vh;
    object-fit: contain;
`;

const SC__Button = styled.button`
    background-color: transparent;
    border: none;
    cursor: pointer;
    height: 40px;
    padding: 5px;
    background-color: #0f0f0f;
    border: 1px solid #1f1f1f;
    aspect-ratio: 1 / 1;
    /* outline: 1px solid red; */
    border-radius: 50%;

    > svg {
        aspect-ratio: 1 / 1;
        color: white;
    }
`;

const SC__ButtonContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const toImageElement = async (src: string) => {
    const newImage = new Image();
    newImage.src = src
    await newImage.decode();
    return newImage;
}

const ImageCarrousel: FC<ImageCarouselProps> = (props) => {
    const [index, setIndex] = useState(0);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const nextImage = useCallback((e: MouseEvent) => {
        e.stopPropagation();
        setIndex(prev => prev >= props.imageSrcs.length - 1 ? prev : prev + 1);
    }, [setIndex])

    const previousImage = useCallback((e: MouseEvent) => {
        e.stopPropagation();
        setIndex(prev => prev <= 0 ? prev : prev - 1);
    }, [setIndex]);


    useEffect(
        () => {
            const run = async() => {
                const newImages = props.imageSrcs.map(toImageElement);
                const imageRes = await Promise.all(newImages);
                setImages(imageRes);
            };
            run();
        },
        [setImages]
    );

    return (
        <SC__ImageContainer>
            <SC__ButtonContainer>
            <SC__Button onClick={previousImage}>
                <ChevronLeftSVG/>
            </SC__Button>
            </SC__ButtonContainer>
            {
                (images.length > index) && (
                    <SC__Image
                        src={images[index].src}
                        $width={images[index].width}
                    />
                )
            }
            <SC__ButtonContainer>
                <SC__Button onClick={nextImage}>
                    <ChevronRightSVG/>
                </SC__Button>
            </SC__ButtonContainer>
        </SC__ImageContainer>
    )
};

const ImageCarouselWindow: FC<ImageCarouselProps> = (props) => {
    

    return (
        <BlurBackgroundCover dismissOnClick>
            <ImageCarrousel {...props} />
        </BlurBackgroundCover>
    )
}

export default ImageCarouselWindow;