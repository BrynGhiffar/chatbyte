import { z } from "zod";

export type ColorConfig = {
    chatListBackgroundColor: string,
    chatListTextColor: string,
    chatListBorderLeftColor: string,
    chatListSeparatorBorderColor: string,
    chatListSeparatorTextColor: string,
    chatListItemHoverColor: string,
    chatListItemSelectedColor: string,
    chatListNavTextColor: string,
    chatListNavBackgroundColor: string,
    chatListNavProfileTextColor: string,
    chatListNavProfileMoreButtonHoverBackgroundColor: string,
    chatListNavSearchBackgroundColor: string,
    chatListNavSearchInnerBackgroundColor: string,
    chatListNavSearchBorderColor: string,
    chatListNavSearchTextColor: string,
    chatListNavButtonColor: string,
    chatListNavPowerButtonColor: string,
    chatListNavButtonSelectedBackgroundColor: string,
    chatListNavButtonSelectedColor: string,
    chatListNavButtonHoverBackgroundColor: string,
    chatListNavButtonHoverColor: string,
    chatNavBackgroundColor: string,
    chatNavTextColor: string,
    chatGridBackgroundColor: string,
    chatBubbleBackgroundColor: string,
    chatBubbleBackgroundColorUserSent: string,
    chatBubbleTextColor: string;
    chatBubbleTextColorUserSent: string;
    chatBubbleCheckmarkRead: string;
    chatBubbleCheckmarkNotRead: string;
    chatInputBackgroundColor: string,
    chatInputInnerBackgroundColor: string,
    chatInputTextColor: string,
    chatEmptyBackgroundColor: string,
    chatInputBorderColor: string,
    chatInputSendButtonColor: string,
    chatInputSendButtonBackgroundColorHover: string,

    popup: {
        borderColor: string,
        backgroundColor: string,
    }

    // settings
    settings: {
        sidebarItemColor: string,
        sidebarBackgroundColor: string,
    }
};

export const ThemeId = z.literal('dark')
    .or(z.literal('light'));

export type ThemeId = z.infer<typeof ThemeId>;

export type Theme = { 
    id: ThemeId;
    color: string;
    config: ColorConfig;
};