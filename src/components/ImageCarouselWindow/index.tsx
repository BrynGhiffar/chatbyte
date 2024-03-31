import { FC, MouseEvent, useCallback, useEffect, useState } from "react";
import { BlurBackgroundCover } from "../common/BackgroundBlurCover";
import { ChevronLeftSVG, ChevronRightSVG } from "../common/Svg";
import { TH__ImageCarouselButton, TH__ImageCarouselButtonContainer, TH__ImageCarouselContainer, TH__ImageCarouselImage } from "./styled";

type ImageCarouselProps = {
    imageSrcs: string[]
};

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
        <TH__ImageCarouselContainer>
            <TH__ImageCarouselButtonContainer>
                <TH__ImageCarouselButton onClick={previousImage}>
                    <ChevronLeftSVG/>
                </TH__ImageCarouselButton>
            </TH__ImageCarouselButtonContainer>
            {
                (images.length > index) && (
                    <TH__ImageCarouselImage
                        src={images[index].src}
                        $width={images[index].width}
                    />
                )
            }
            <TH__ImageCarouselButtonContainer>
                <TH__ImageCarouselButton onClick={nextImage}>
                    <ChevronRightSVG/>
                </TH__ImageCarouselButton>
            </TH__ImageCarouselButtonContainer>
        </TH__ImageCarouselContainer>
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