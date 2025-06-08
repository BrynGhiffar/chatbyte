import { formatDate } from '@/utility/UtilityFunctions';

import {
  AppStateGet,
  AppStateSet,
  Contact,
  GroupContact,
} from '../AppStore/type';
import {
  WebSocketGroupMessageNotification,
  WebSocketMessageNotification,
} from './type';

export const pushDirectMessageNotification = (
  set: AppStateSet,
  get: AppStateGet,
  message: WebSocketMessageNotification,
  contact: Contact
) => {
  const messageMap = structuredClone(get().message);
  messageMap[`DIRECT-${contact.id}`].push({
    id: message.id,
    senderId: message.senderUid,
    content: message.content,
    isUser: message.isUser,
    receiverRead: message.receiverRead,
    senderName: '',
    time: formatDate(message.sentAt), // Need to change format according to user local timezone. %H:%M
    deleted: false,
    edited: false,
    attachmentIds: message.attachments.map(at => at.id),
  });
  set(s => ({ ...s, message: messageMap }));
};

export const pushGroupMessageNotification = (
  set: AppStateSet,
  get: AppStateGet,
  message: WebSocketGroupMessageNotification,
  contact: GroupContact
) => {
  const messageMap = structuredClone(get().message);
  messageMap[`GROUP-${message.groupId}`].push({
    id: message.id,
    senderId: message.senderId,
    content: message.content,
    isUser: get().loggedInUserId === message.senderId,
    receiverRead: false,
    senderName: message.username,
    time: formatDate(message.sentAt), // Need to change according to timezone format
    deleted: false,
    edited: false,
    attachmentIds: message.attachments.map(at => at.id),
  });
  set({ message: messageMap });
};

export const isContactSelected = (
  get: AppStateGet,
  contact: Contact | GroupContact
) => {
  return (
    get().selectedContact?.id === contact.id &&
    get().selectedContact?.type === contact.type
  );
};
