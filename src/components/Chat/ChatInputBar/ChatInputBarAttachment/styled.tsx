import { commonCss } from '@/components/Palette';
import { DivWrapper } from '@/misc/types';
import { useColorConfig } from '@/store/AppStore/hooks';
import styled from 'styled-components';

// █▀ ▀█▀ █▄█ █░░ █▀▀ █▀▄
// ▄█ ░█░ ░█░ █▄▄ ██▄ █▄▀

type SC__InputAttachmentContainerProps = {
    $backgroundColor: string,
    $borderColor: string
}

export const SC__InputAttachmentContainer = styled.div<SC__InputAttachmentContainerProps>`
  padding: 0.5rem;
  background-color: ${props => props.$backgroundColor};
  border: 1px solid ${props => props.$borderColor};
  border-radius: 5px;
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
`

type SC__AttachmentItemProps = {
  $image: string,
  $backgroundColor: string,
}

export const SC__AttachmentItem = styled.div<SC__AttachmentItemProps>`
  height: 130px;
  width: 110px;
  background-image: url(${props => props.$image});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  /* background-color: #1e1d1d; */
  background-color: ${props => props.$backgroundColor};
  position: relative;
  border-radius: 5px;
`;

type SC__AttachmentItemControl = {
    $backgroundColor: string;
    $borderColor: string;
};

export const SC__AttachmentItemControl = styled.div<SC__AttachmentItemControl>`
  /* background-color: #3a3b3e; */
  /* border: 1px solid #1f1f1f; */
  background-color: ${props => props.$backgroundColor};
  border: 1px solid ${props => props.$borderColor};
  border-radius: 5px;
  position: absolute;
  top: -2px;
  right: -2px;
  height: 20px;
  width: 40px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
`;

type SC__AttachmentControlItems = {
    $backgroundHoverColor: string;
    $iconColor: string;
};

export const SC__AttachmentControlItems = styled.div<SC__AttachmentControlItems>`
  ${commonCss.transition}
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  :hover {
    /* background-color: #29292c; */
    background-color: ${props => props.$backgroundHoverColor};
  }
  > svg {
    /* color: white; */
    color: ${props => props.$iconColor};
  }
`;

export const SC__AttachmentDeleteButton = styled(SC__AttachmentControlItems)`
  :hover {
    background-color: red;
  }
`;

export const SC__AttachmentViewButton = styled(SC__AttachmentControlItems)`
  > svg {
    height: 17px;
    aspect-ratio: 1 / 1;
  }
`;

// ▀█▀ █░█ █▀▀ █▀▄▀█ █▀▀ █▀▄
// ░█░ █▀█ ██▄ █░▀░█ ██▄ █▄▀

export const TH__InputAttachmentContainer: DivWrapper = ({ children, ...props }) => {
    const backgroundColor = useColorConfig()
        .chatInput
        .uploadAttachment
        .backgroundColor;
    const borderColor = useColorConfig()
        .chatInput
        .uploadAttachment
        .borderColor;
    return (
        <SC__InputAttachmentContainer
            $backgroundColor={backgroundColor}
            $borderColor={borderColor}
            { ...props }
        >
            { children }
        </SC__InputAttachmentContainer>
    )
}

// SC__AttachmentItem
export const TH__AttachmentItem: DivWrapper<{ $image: string }> = ({ children, ...props }) => {
    const backgroundColor = useColorConfig()
        .chatInput
        .uploadAttachment
        .itemBackgroundColor;
    return (
        <SC__AttachmentItem
            $backgroundColor={backgroundColor}
            { ...props }
        >
            { children }
        </SC__AttachmentItem>
    )
};

// SC__AttachmentItemControl
export const TH__AttachmentItemControl: DivWrapper = ({ children, ...props }) => {
    const backgroundColor = useColorConfig()
        .chatInput
        .uploadAttachment
        .buttonBackgroundColor;
    const borderColor = useColorConfig()
        .chatInput
        .uploadAttachment
        .buttonBorderColor;
    return (
        <SC__AttachmentItemControl
            $backgroundColor={backgroundColor}
            $borderColor={borderColor}
            { ...props }
        >
            { children }
        </SC__AttachmentItemControl>
    );
};

// SC__AttachmentDeleteButton
export const TH__AttachmentDeleteButton: DivWrapper = ({ children, ...props }) => {
    const backgroundHoverColor = useColorConfig()
        .chatInput
        .uploadAttachment
        .buttonHoverBackgroundColor;
    
    const iconColor = useColorConfig()
        .chatInput
        .uploadAttachment
        .buttonIconColor
    return (
        <SC__AttachmentDeleteButton
            $backgroundHoverColor={backgroundHoverColor}
            $iconColor={iconColor}
            { ...props }
        >
            { children }
        </SC__AttachmentDeleteButton>
    )
}


export const TH__AttachmentViewButton: DivWrapper = ({ children, ...props }) => {
    const backgroundHoverColor = useColorConfig()
        .chatInput
        .uploadAttachment
        .buttonHoverBackgroundColor;
    
    const iconColor = useColorConfig()
        .chatInput
        .uploadAttachment
        .buttonIconColor;
    return (
        <SC__AttachmentViewButton
            $backgroundHoverColor={backgroundHoverColor}
            $iconColor={iconColor}
            { ...props }
        >
            { children }
        </SC__AttachmentViewButton>
    )
};