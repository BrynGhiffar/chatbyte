import { css } from "styled-components";

export const color = {
    darkBlue: '#233142',
    lightBlue: '#455d7a',
    seaGreen: '#42b883',
    kindaWhite: '#e3e3e3'
};

export const font = {
    appleFont: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
};

export const commonCss = {
    transition: css`
        transition: all 200ms cubic-bezier(0.075, 0.82, 0.165, 1);
    `,
    scrollableCss: css`
        scrollbar-width: thin;
        scrollbar-color: transparent transparent;

        &:hover {
            scrollbar-color: rgba(155, 155, 155, 0.5) transparent;
        }

        &:hover::-webkit-scrollbar-thumb {
            background-color: rgba(155, 155, 155, 0.5);
        }

        &::-webkit-scrollbar {
            width: 6px;
        }
        &::-webkit-scrollbar-track {
            background: transparent;
        }
        &::-webkit-scrollbar-thumb {
            transition: all 200ms ease-in-out;
            background-color: transparent;
            border-radius: 20px;
            border: transparent;
        }
    `
};