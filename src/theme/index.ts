import { color } from "@/components/Palette";
import { ColorConfig, Theme } from "./type";

export const LightTheme: Theme = {
    id: "light",
    color: "white",
    config: {
        chatListBackgroundColor: '#ffffff',
        chatListTextColor: '#000000',
        chatListBorderLeftColor: 'rgb(200, 200, 200)',
        chatListSeparatorBorderColor: 'rgb(200,200,200)',
        chatListSeparatorTextColor: 'rgb(150,150,150)',
        chatListItemHoverColor: "#eff4ff",
        chatListItemSelectedColor: "#eff4ff",
        chatListNavTextColor: '#ffffff',
        chatListNavBackgroundColor: color.chatBlue,
        chatListNavProfileTextColor: 'white',
        chatListNavProfileMoreButtonHoverBackgroundColor: '#2a4fb2',
        chatListNavSearchBackgroundColor: color.white,
        chatListNavSearchInnerBackgroundColor: color.white,
        chatListNavSearchBorderColor: 'rgb(200,200,200)',
        chatListNavSearchTextColor: 'black',
        chatListNavButtonColor: color.white,
        chatListNavPowerButtonColor: '#f05d23',
        chatListNavButtonSelectedBackgroundColor: 'rgba(100, 100, 100, 0.5)',
        chatListNavButtonSelectedColor: '#00204a',
        chatListNavButtonHoverBackgroundColor: 'rgba(100, 100, 100, 0.5)',
        chatListNavButtonHoverColor: '#00204a',
        chatNavBackgroundColor: color.chatBlue,
        chatNavTextColor: 'white',
        chatGridBackgroundColor: '#ffffff',
        chatBubbleBackgroundColor: color.kindaWhite,
        chatBubbleBackgroundColorUserSent: '#d8e2ff',
        chatBubbleTextColor: 'black',
        chatBubbleTextColorUserSent: 'black',
        chatBubbleCheckmarkNotRead: 'gray',
        chatBubbleCheckmarkRead: '#118a7e',
        chatInputBackgroundColor: '#ffffff',
        chatInputInnerBackgroundColor: '#ffffff',
        chatInputTextColor: 'black',
        chatEmptyBackgroundColor: '#ffffff',
        chatInputBorderColor: 'rgb(200,200,200)',
        chatInputSendButtonColor: 'gray',
        chatInputSendButtonBackgroundColorHover: 'rgba(100, 100, 100, 0.3)',

        chatBubble: {
            trashIconBackgroundColor: color.kindaWhite,
            trashIconColor: 'black',
            trashIconBorderColor: 'transparent'
        },

        popup: {
            borderColor: '#ededed',
            backgroundColor: "white",
        },

        settings: {
            sidebarBackgroundColor: color.chatBlue,
            sidebarItemColor: 'white'
        }
    }
};

export const DarkTheme: Theme = {
    id: "dark",
    color: "#222831",
    config: {
        chatListBackgroundColor: '#151515',
        chatListTextColor: '#ffffff',
        chatListBorderLeftColor: '#1e1d1d',
        chatListSeparatorBorderColor: '#1e1d1d',
        chatListSeparatorTextColor: 'rgb(150,150,150)',
        chatListItemHoverColor: "#3a3b3e",
        chatListItemSelectedColor: "#3a3b3e",
        chatListNavTextColor: '#ffffff',
        chatListNavBackgroundColor: color.chatBlue,
        chatListNavProfileTextColor: 'white',
        chatListNavProfileMoreButtonHoverBackgroundColor: '#3a3b3e',
        chatListNavSearchBackgroundColor: "#151515",
        chatListNavSearchInnerBackgroundColor: "#0f0f0f",
        chatListNavSearchBorderColor: '#1f1f1f',
        chatListNavSearchTextColor: 'white',
        chatListNavButtonColor: color.white,
        chatListNavPowerButtonColor: '#f05d23',
        chatListNavButtonSelectedBackgroundColor: 'rgba(100, 100, 100, 0.5)',
        chatListNavButtonSelectedColor: '#00204a',
        chatListNavButtonHoverBackgroundColor: 'rgba(100, 100, 100, 0.5)',
        chatListNavButtonHoverColor: '#00204a',
        chatNavBackgroundColor: '#1e1d1d',
        chatNavTextColor: 'white',
        chatGridBackgroundColor: '#151515',
        chatBubbleBackgroundColor: '#393a3d',
        chatBubbleBackgroundColorUserSent: '#3d72ff',
        chatBubbleTextColor: 'white',
        chatBubbleTextColorUserSent: 'white',
        chatBubbleCheckmarkNotRead: 'white',
        chatBubbleCheckmarkRead: 'white',
        chatInputBackgroundColor: '#151515',
        chatInputInnerBackgroundColor: '#0f0f0f',
        chatInputTextColor: 'white',
        chatEmptyBackgroundColor: '#151515',
        chatInputBorderColor: '#1f1f1f',
        chatInputSendButtonColor: 'gray',
        chatInputSendButtonBackgroundColorHover: 'rgba(100, 100, 100, 0.3)',

        chatBubble: {
            trashIconBackgroundColor: '#0f0f0f',
            trashIconColor: 'white',
            trashIconBorderColor: 'transparent'
        },

        popup: {
            borderColor: '#1e1d1d',
            // borderColor: 'red',
            backgroundColor: 'white'
        },

        settings: {
            sidebarBackgroundColor: '#1e1d1d',
            sidebarItemColor: 'white'
        }
    }
};

const AllThemes: Theme[] = [
    LightTheme,
    DarkTheme
]

export default AllThemes;