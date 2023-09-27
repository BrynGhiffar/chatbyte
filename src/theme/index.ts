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
        chatGridBackgroundColor: '#ffffff',
        chatBubbleBackgroundColor: '#ededed',
        chatBubbleBackgroundColorUserSent: '#d8e2ff',
        chatInputBackgroundColor: '#ffffff',
        chatEmptyBackgroundColor: '#ffffff',
        chatInputBorderColor: 'rgb(200,200,200)',
        chatInputSendButtonColor: 'gray',
        chatInputSendButtonBackgroundColorHover: 'rgba(100, 100, 100, 0.3)',
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
        chatGridBackgroundColor: '#ffffff',
        chatBubbleBackgroundColor: '#ededed',
        chatBubbleBackgroundColorUserSent: '#d8e2ff',
        chatInputBackgroundColor: '#ffffff',
        chatEmptyBackgroundColor: '#151515',
        chatInputBorderColor: 'rgb(200,200,200)',
        chatInputSendButtonColor: 'gray',
        chatInputSendButtonBackgroundColorHover: 'rgba(100, 100, 100, 0.3)',
    }
};

const AllThemes: Theme[] = [
    LightTheme,
    DarkTheme
]

export default AllThemes;