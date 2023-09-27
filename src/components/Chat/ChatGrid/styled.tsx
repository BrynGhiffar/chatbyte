import { commonCss } from "@/components/Palette";
import styled from "styled-components";

export const SC__ChatGrid = styled.div`
    ${commonCss.transition}
    ${commonCss.scrollableCss}
    /* overflow-y: hidden; */
    overflow-x: hidden;
`;
