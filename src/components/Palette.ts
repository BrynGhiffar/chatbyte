import { css } from 'styled-components';

export const color = {
  darkBlue: '#233142',
  lightBlue: '#455d7a',
  seaGreen: '#42b883',
  kindaWhite: '#e3e3e3',
  chatBlue: '#3d72ff',
  white: '#ffffff',
};

export const colorConfig = {
  chatListBackgroundColor: '#ffffff',
  chatListTextColor: '#000000',
  chatListBorderLeftColor: 'rgb(200, 200, 200)',
  chatListSeparatorBorderColor: 'rgb(200,200,200)',
  chatListSeparatorTextColor: 'rgb(150,150,150)',
  chatListItemHoverColor: '#eff4ff',
  chatListItemSelectedColor: '#eff4ff',
  chatListNavTextColor: '#ffffff',
  chatListNavBackgroundColor: color.chatBlue,
  chatListNavSearchBackgroundColor: color.white,
  chatListNavSearchBorderColor: 'rgb(200,200,200)',
  chatListNavButtonColor: color.white,
  chatListNavPowerButtonColor: '#f05d23',
  chatListNavButtonSelectedBackgroundColor: 'rgba(100, 100, 100, 0.5)',
  chatListNavButtonSelectedColor: '#00204a',
  chatListNavButtonHoverBackgroundColor: 'rgba(100, 100, 100, 0.5)',
  chatListNavButtonHoverColor: '#00204a',
  chatNavBackgroundColor: color.chatBlue,
  chatGridBackgroundColor: '#ffffff',
  chatBubbleBackgroundColor: '#ededed',
  chatBubbleBackgroundColorUserSent: '#d8e2ff',
  chatInputBackgroundColor: '#ffffff',
  chatEmptyBackgroundColor: '#ffffff',
  chatInputBorderColor: 'rgb(200,200,200)',
  chatInputSendButtonColor: 'gray',
  chatInputSendButtonBackgroundColorHover: 'rgba(100, 100, 100, 0.3)',
};

export const font = {
  appleFont:
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
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
  `,
};
