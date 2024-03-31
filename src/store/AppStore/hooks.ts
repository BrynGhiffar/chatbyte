import { Theme, ThemeId } from "@/theme/type";
import useAppStore from ".";

export const useWindow = () => useAppStore(s => ({ 
    top: s.windowStack[s.windowStack.length - 1],
    pushWindow: s.pushWindow,
    popWindow: s.popWindow
}));

export const useSnackbar = () => useAppStore(s => ({
    pushSuccess: s.pushSnackbarSuccess,
    pushError: s.pushSnackbarError
}));

export const useSelectedContact = () => useAppStore(s => s.selectedContact);

export const useSelectedContactMessages = () => useAppStore(s => {
    const selectedContact = s.selectedContact;
    if (!selectedContact) return [];
    const key = `${selectedContact.type}-${selectedContact.id}`;
    const messages = s.message[key] ?? [];
    return messages;
});

export const useChatListSearch = (): [string, (search: string) => void] => useAppStore(s => [s.chatlistSearch, s.onChangeChatListSearch]);

export const useTheme = (): [Theme, (themeId: ThemeId) => void] => useAppStore(s => [s.theme, s.setTheme]);

export const useColorConfig = () => useAppStore(s => s.theme.config);