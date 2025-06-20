import { AuthService } from '@/api/http/AuthService';
import { ContactService } from '@/api/http/ContactService';
import { GroupService } from '@/api/http/GroupService';
import MessageService from '@/api/http/MessageService';
import {
  UserService,
  avatarImageGroupUrl,
  avatarImageUrl,
} from '@/api/http/UserService';
import AllThemes, { LightTheme } from '@/theme';
import { LocalStorage } from '@/utility/LocalStorage';
import { formatDate } from '@/utility/UtilityFunctions';

import { WebsocketMiddlewareType } from '../WebsocketMiddleware/type';
import {
  AppStateGet,
  AppStateSet,
  Contact,
  Conversation,
  GroupContact,
  GroupConversation,
} from './type';

const setFetchInitialFailed = (set: AppStateSet) =>
  set(s => ({ ...s, type: 'ERROR_FETCHING_INITIAL_USER_DATA' }));

export const pushSnackbarError = (set: AppStateSet, message: string) => {
  const id = Math.floor(Math.random() * 1_000);
  set(s => ({
    ...s,
    snackbarMessage: [...s.snackbarMessage, { id, message, type: 'failure' }],
  }));
};

export const pushSnackbarSuccess = (set: AppStateSet, message: string) => {
  const id = Math.floor(Math.random() * 1_000);
  set(s => ({
    ...s,
    snackbarMessage: [...s.snackbarMessage, { id, message, type: 'success' }],
  }));
};

export const getUserToken = async (
  set: AppStateSet
): Promise<string | null> => {
  const token = LocalStorage.getLoginToken();
  if (!token) {
    // pushSnackbarError(set, "Token is missing");
    set(s => ({ ...s, type: 'MISSING_TOKEN' }));
    return null;
  }
  const res = await AuthService.validateToken(token);
  if (!res.success) {
    set(s => ({ ...s, type: 'INVALID_TOKEN' }));
    return null;
  }
  return token;
};

export const popWindow = (set: AppStateSet) =>
  set(s => {
    const windowStack = s.windowStack;
    if (windowStack.length >= 2) {
      return {
        ...s,
        windowStack: windowStack.slice(0, windowStack.length - 1),
      };
    }
    return s;
  });

export const fetchSetGroupContact = async (set: AppStateSet, token: string) => {
  const resGetGroups = await GroupService.getGroups(token);
  if (!resGetGroups.success) {
    pushSnackbarError(set, resGetGroups.message);
    return;
  }

  const groupContacts: GroupContact[] = resGetGroups.payload.map(c => ({
    type: 'GROUP',
    id: c.id,
    name: c.name,
    urlProfile: avatarImageGroupUrl(c.id)(0),
  }));

  set({ groupContacts });
};

export const fetchSetGroupConversations = async (
  set: AppStateSet,
  token: string
) => {
  const resGetGroupConv = await GroupService.getGroupsRecent(token);
  if (!resGetGroupConv.success) {
    pushSnackbarError(set, resGetGroupConv.message);
    return;
  }

  const groupConversations: GroupConversation[] = resGetGroupConv.payload.map(
    c => {
      if (c.detail) {
        return {
          type: 'GROUP',
          id: c.groupId,
          name: c.groupName,
          urlProfile: avatarImageGroupUrl(c.groupId)(0),
          lastMessageContent: `${c.detail.username}: ${c.detail.content}`,
          lastMessageTime: formatDate(c.detail.sentAt),
          unreadCount: c.unreadMessage,
          deleted: c.detail.deleted,
        };
      }
      return {
        type: 'GROUP',
        id: c.groupId,
        name: c.groupName,
        urlProfile: avatarImageGroupUrl(c.groupId)(0),
        lastMessageContent: 'No messages.',
        lastMessageTime: '',
        unreadCount: c.unreadMessage,
        deleted: false,
      };
    }
  );

  set({ groupConversations });
};

export const fetchSetUserDetails = async (set: AppStateSet, token: string) => {
  const resUserDetails = await UserService.getUserDetails(token);
  if (!resUserDetails.success) {
    pushSnackbarError(set, resUserDetails.message);
    return;
  }
  const { user_id, username } = resUserDetails.payload;
  set({ loggedInUserId: user_id, loggedInUsername: username });
};

export const fetchSetDirectContacts = async (
  set: AppStateSet,
  token: string
) => {
  const resContacts = await ContactService.getContacts(token);
  if (!resContacts.success) {
    pushSnackbarError(set, resContacts.message);
    return;
  }
  const directContacts: Contact[] = resContacts.payload.map(c => ({
    type: 'DIRECT',
    name: c.username,
    id: c.id,
    urlProfile: avatarImageUrl(c.id)(0),
  }));
  set({ contacts: directContacts });
};

export const fetchSetDirectConversations = async (
  set: AppStateSet,
  token: string
) => {
  const resConversations = await ContactService.getContactsRecent(token);
  if (!resConversations.success) {
    pushSnackbarError(set, resConversations.message);
    return;
  }
  const conversations: Conversation[] = resConversations.payload.map(c => ({
    type: 'DIRECT',
    id: c.contactId,
    name: c.username,
    lastMessageTime: formatDate(c.sentAt),
    lastMessageContent: c.lastMessage,
    unreadCount: c.unreadCount,
    deleted: c.deleted,
  }));
  set({ conversations });
};

export const fetchSetMessageRead = async (
  set: AppStateSet,
  get: AppStateGet,
  websocket: WebsocketMiddlewareType,
  token: string,
  contact: Contact | GroupContact
) => {
  if (contact.type === 'DIRECT') {
    websocket.readDirectMessage(contact.id);
  } else if (contact.type === 'GROUP') {
    websocket.readGroupMessage(contact.id);
  }
  const newConversations = get().conversations.map(c => {
    if (c.type === contact.type && c.id === contact.id) {
      return { ...c, unreadCount: 0 };
    }
    return c;
  });
  const newGroupConversations = get().groupConversations.map(c => {
    if (c.type === contact.type && c.id === contact.id) {
      return { ...c, unreadCount: 0 };
    }
    return c;
  });
  set({
    conversations: newConversations,
    groupConversations: newGroupConversations,
  });
};

export const fetchSetDirectMessage = async (
  set: AppStateSet,
  get: AppStateGet,
  token: string,
  contact: Contact
) => {
  const resGetMessage = await MessageService.getMessage(token, contact.id);
  if (!resGetMessage.success) {
    pushSnackbarError(set, resGetMessage.message);
    return;
  }
  const contactKey = `${contact.type}-${contact.id}`;
  const messages = resGetMessage.payload.map(m => ({
    id: m.id,
    senderId: m.senderId,
    content: m.content,
    isUser: m.senderId === get().loggedInUserId,
    senderName: '',
    time: formatDate(m.sentAt), // Need to format according to timezone %H:%M
    receiverRead: m.read,
    deleted: m.deleted,
    edited: m.edited,
    attachmentIds: m.attachments.map(at => at.id),
  }));
  const messageMapNew = structuredClone(get().message);
  messageMapNew[contactKey] = messages;
  set({ message: messageMapNew });
};

export const fetchSetGroupMessage = async (
  set: AppStateSet,
  get: AppStateGet,
  token: string,
  contact: GroupContact
) => {
  const resGetGroupMessage = await GroupService.getGroupMessages(
    contact.id,
    token
  );
  if (!resGetGroupMessage.success) {
    pushSnackbarError(set, resGetGroupMessage.message);
    return;
  }
  const contactKey = `${contact.type}-${contact.id}`;
  const messages = resGetGroupMessage.payload.map(m => ({
    id: m.id,
    receiverRead: true,
    isUser: m.senderId === get().loggedInUserId,
    senderId: m.senderId,
    senderName: m.username,
    time: formatDate(m.sentAt), // need to change to format according to user timezone %H:%M
    content: m.content,
    deleted: m.deleted,
    edited: m.edited,
    attachmentIds: m.attachments.map(at => at.id),
  }));
  const messageMapNew = structuredClone(get().message);
  messageMapNew[contactKey] = messages;
  set({ message: messageMapNew });
};

export const initializeTheme = (set: AppStateSet) => {
  const themeId = LocalStorage.getTheme();
  if (themeId === null) {
    set({ theme: LightTheme });
    LocalStorage.setTheme(LightTheme.id);
    return;
  }
  const theme = AllThemes.find(th => th.id === themeId);
  if (!theme) {
    set({ theme: LightTheme });
    LocalStorage.setTheme(LightTheme.id);
    return;
  }
  set({ theme });
  return;
};
