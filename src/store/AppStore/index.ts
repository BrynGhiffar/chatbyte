import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { GroupService } from '@/api/http/GroupService';
import AllThemes, { LightTheme } from '@/theme';
import { ThemeId } from '@/theme/type';
import { LocalStorage } from '@/utility/LocalStorage';
import { logDebug } from '@/utility/Logger';
import {
  filterSupportedAttachments,
  toBase64,
} from '@/utility/UtilityFunctions';

import { websocket } from '../WebsocketMiddleware/middleware';
import { WebSocketMiddlewareMethods } from '../WebsocketMiddleware/type';
import {
  AppState,
  AppStateSet,
  AppStateState,
  Contact,
  ContactType,
  Conversation,
  GroupContact,
  GroupConversation,
  Window,
} from './type';
import {
  fetchSetDirectContacts,
  fetchSetDirectConversations,
  fetchSetDirectMessage,
  fetchSetGroupContact,
  fetchSetGroupConversations,
  fetchSetGroupMessage,
  fetchSetMessageRead,
  fetchSetUserDetails,
  getUserToken,
  initializeTheme,
  popWindow,
  pushSnackbarError,
  pushSnackbarSuccess,
} from './utility';

const setInitialData = (
  set: AppStateSet,
  userId: number,
  username: string,
  contacts: Contact[],
  groupContacts: GroupContact[],
  conversations: Conversation[],
  groupConversations: GroupConversation[]
) =>
  set(s => ({
    ...s,
    type: 'NORMAL',
    loggedInUserId: userId,
    loggedInUsername: username,
    groupContacts,
    contacts,
    conversations,
    groupConversations,
  }));

const initialState: AppStateState = {
  type: 'LOGGED_OUT',
  uploadAttachments: [],
  editMessage: null,
  snackbarMessage: [],
  loggedInUserId: 0,
  loggedInUsername: '',
  chatlistSearch: '',
  groupContacts: [],
  contacts: [],
  groupConversations: [],
  conversations: [],
  windowStack: [{ type: 'CHAT_WINDOW' }],
  message: {},
  onlineUserMap: {},
  selectedContact: null,
  showChatList: true,
  theme: AllThemes.find(th => th.id === LocalStorage.getTheme()) ?? LightTheme,
};

const useAppStore = create<
  AppState,
  [['zustand/devtools', never], ...WebSocketMiddlewareMethods]
>(
  devtools(
    websocket((set, get, api) => ({
      ...initialState,
      fetchInitialData: async () => {
        set({ ...initialState });
        initializeTheme(set);
        const token = await getUserToken(set);
        if (!token) {
          return;
        }
        api.websocket.wsDisconnect();
        api.websocket.wsConnect(set, get, token);
        // Error handling needs to be added here.
        await Promise.all([
          fetchSetGroupContact(set, token),
          fetchSetGroupConversations(set, token),
          fetchSetUserDetails(set, token),
          fetchSetDirectContacts(set, token),
          fetchSetDirectConversations(set, token),
        ]);
        logDebug('Finish fetching contacts and conversations');
        await Promise.all(
          get().contacts.map(contact =>
            fetchSetDirectMessage(set, get, token, contact)
          )
        );
        await Promise.all(
          get().groupContacts.map(group =>
            fetchSetGroupMessage(set, get, token, group)
          )
        );
        set({ type: 'NORMAL' });
      },
      selectContact: async (type: ContactType, id: number) => {
        const token = await getUserToken(set);
        if (!token) return;
        const allContacts = [...get().contacts, ...get().groupContacts];
        const contactIndex = allContacts.findIndex(
          c => c.type === type && c.id === id
        );
        const contactExist = contactIndex !== -1;
        if (!contactExist) {
          pushSnackbarError(set, 'Contact not found');
          return;
        }
        const contact = allContacts[contactIndex];
        await fetchSetMessageRead(set, get, api.websocket, token, contact);
        set({
          selectedContact: contact,
          editMessage: null,
          uploadAttachments: [],
        });
      },
      addUploadAttachments: async files => {
        const newAttachments = filterSupportedAttachments(files).map(
          async file => {
            const id = Math.floor(Math.random() * 1000);
            const fileB64 = await toBase64(file);
            return {
              id,
              file: fileB64,
            };
          }
        );
        const att = await Promise.all(newAttachments);
        console.log('appstore', att);
        set({ uploadAttachments: get().uploadAttachments.concat(att) });
      },
      removeAttachmentById: (id: number) => {
        const newAttachments = get().uploadAttachments.filter(f => f.id !== id);
        set({ uploadAttachments: newAttachments });
      },
      sendMessage: (message: string) => {
        const selectedContact = get().selectedContact;
        if (!selectedContact) return;
        const editMessage = get().editMessage;
        if (editMessage) {
          if (selectedContact.type === 'DIRECT') {
            api.websocket.editDirectMessage(editMessage.message.id, message);
          } else if (selectedContact.type === 'GROUP') {
            api.websocket.editGroupMessage(editMessage.message.id, message);
          }
          set({ editMessage: null });
          return;
        }
        if (selectedContact.type === 'GROUP') {
          api.websocket.sendGroupMessage(
            selectedContact.id,
            message,
            get().uploadAttachments
          );
        } else if (selectedContact.type === 'DIRECT') {
          api.websocket.sendMessage(
            selectedContact.id,
            message,
            get().uploadAttachments
          );
        }
        set({ uploadAttachments: [] });
        return;
      },
      deleteMessage: (messageId: number) => {
        if (get().selectedContact?.type === 'DIRECT') {
          api.websocket.deleteMessage(messageId);
        } else {
          api.websocket.deleteGroupMessage(messageId);
        }
      },
      setEditMessage: (messageId: number, scrollIntoView: () => void) => {
        const selectedContact = get().selectedContact;
        if (selectedContact === null) return;
        const messages =
          get().message[`${selectedContact.type}-${selectedContact.id}`];
        const message = messages.find(m => m.id === messageId);
        if (!message) return;

        set({ editMessage: { message, scrollIntoView } });
      },
      cancelEditMessage: () => {
        set({ editMessage: null });
      },
      createChatGroup: async (
        name: string,
        members: number[],
        profilePicture: File | null
      ) => {
        const token = await getUserToken(set);
        if (!token) {
          return;
        }
        const resCreateGroup = await GroupService.createGroup(
          token,
          name,
          members,
          profilePicture
        );
        if (resCreateGroup.success) {
          pushSnackbarSuccess(set, 'Successfully created group');
          await fetchSetGroupContact(set, token);
          await fetchSetGroupConversations(set, token);
          await Promise.all(
            get().groupContacts.map(group =>
              fetchSetGroupMessage(set, get, token, group)
            )
          );
          popWindow(set);
        } else {
          pushSnackbarError(set, resCreateGroup.message);
        }
      },
      // Snackbar methods
      pushSnackbarSuccess: (message: string) =>
        pushSnackbarSuccess(set, message),
      pushSnackbarError: (message: string) => pushSnackbarError(set, message),
      removeSnackbarMessage: (id: number) => {
        set(s => ({
          ...s,
          snackbarMessage: s.snackbarMessage.filter(m => m.id !== id),
        }));
      },

      // Window methods
      pushWindow: (window: Window) =>
        set(s => ({ ...s, windowStack: [...s.windowStack, window] })),
      popWindow: () => popWindow(set),
      top: () => get().windowStack[get().windowStack.length - 1],

      onChangeChatListSearch: search =>
        set(s => ({ ...s, chatlistSearch: search })),

      // Show hide chatlist
      toggleShowChatList: () => {
        set(s => ({ ...s, showChatList: !s.showChatList }));
      },
      // contact online status
      isUserOnline: (userId: number) => {
        const isOnline = get().onlineUserMap[userId] ?? false;
        return isOnline;
      },
      // Themes
      setTheme: (themeId: ThemeId) => {
        const theme = AllThemes.find(th => th.id === themeId);
        if (!theme) return;
        LocalStorage.setTheme(themeId);
        set({ theme });
      },
      // Logout
      logout: (cleanup: () => void) => {
        LocalStorage.removeLoginToken();
        api.websocket.wsDisconnect();
        set({ ...initialState, type: 'LOGGED_OUT' });
        cleanup();
      },
    }))
  )
);

export default useAppStore;
