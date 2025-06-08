import { createContext } from 'react';

export type Window =
  | 'CHAT_WINDOW'
  | 'SETTINGS_WINDOW'
  | 'LOGOUT_CONFIRM'
  | 'CHANGE_PASSWORD'
  | 'CREATE_GROUP_WINDOW';

type WindowContext = {
  windowStack: Window[];
  push: (window: Window) => void;
  pop: () => void;
  top: Window;
};

export const WindowContext = createContext<WindowContext>({
  windowStack: [],
  push: (window: Window) => {},
  pop: () => {},
  top: 'CHAT_WINDOW',
});
