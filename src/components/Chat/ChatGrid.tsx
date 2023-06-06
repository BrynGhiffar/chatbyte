import styled from "styled-components";
import { commonCss } from "@/components/Palette";

const ChatGrid = styled.div`
    ${commonCss.transition}
    ${commonCss.scrollableCss}
    /* overflow-y: hidden; */
    overflow-x: hidden;
`;

export default ChatGrid;