import styled from "styled-components";

export const VerticalStackContainer = styled.div<{ $gap?: number }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${props => props.$gap}px;
`;

export const HorizontalStackContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
`;