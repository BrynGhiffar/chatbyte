import { ThemeId } from '@/theme/type';

export const LocalStorage = {
  setLoginToken: (token: string) => {
    localStorage.setItem('USER_TOKEN', token);
  },
  getLoginToken: () => {
    return localStorage.getItem('USER_TOKEN');
  },
  removeLoginToken: () => {
    return localStorage.removeItem('USER_TOKEN');
  },
  setTheme: (themeId: ThemeId) => {
    localStorage.setItem('THEME', themeId);
  },
  getTheme: (): ThemeId | null => {
    const theme = localStorage.getItem('THEME');
    if (!theme) return null;
    const res = ThemeId.safeParse(theme);
    if (res.success) return res.data;
    return null;
  },
};
