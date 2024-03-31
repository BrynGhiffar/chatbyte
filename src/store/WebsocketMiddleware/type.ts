import { } from "zustand/middleware";
import { AppState, AppStateGet, AppStateSet, Attachment, Write } from '../AppStore/type';
import { StoreMutatorIdentifier, StateCreator, Mutate, StoreApi } from 'zustand';
import { z } from "zod";


type Cast<T, U> = T extends U ? T : U

export type ReadDirectMessage = (receiverId: number) => void;
export type ReadGroupMessage = (groupId: number) => void;
export type SendMessage = (receiverId: number, message: string, attachments: Attachment[]) => void;
export type SendGroupMessage = (groupId: number, message: string, attachments: Attachment[]) => void;
export type WsConnect = (set: AppStateSet, get: AppStateGet, token: string) => void;
export type DeleteMessage = (messageId: number) => void;
export type EditMessage = (messageId: number, editedMessage: string) => void;
export type WsDisconnect = () => void;

export type WebsocketMiddlewareType = {
  readDirectMessage: ReadDirectMessage,
  readGroupMessage: ReadGroupMessage,
  sendMessage: SendMessage,
  sendGroupMessage: SendGroupMessage,
  deleteMessage: DeleteMessage,
  deleteGroupMessage: DeleteMessage,
  editDirectMessage: EditMessage,
  editGroupMessage: EditMessage,
  wsConnect: WsConnect,
  wsDisconnect: WsDisconnect
}

declare module 'zustand' {
    interface StoreMutators<S, A> {
        websocket: Write<Cast<S, object>, { websocket: A }>,
    }
}

export type WebSocketMiddlewareMethods = [
  ['websocket', WebsocketMiddlewareType],
];

export type WebsocketMiddleware = <
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  f: StateCreator<AppState, [ ...Mps, ...WebSocketMiddlewareMethods], Mcs>,
) => StateCreator<AppState, Mps, [ ...WebSocketMiddlewareMethods, ...Mcs ]>

export type WebsocketMiddlewareImpl = (
    f: StateCreator<AppState, [], []>,
) => StateCreator<AppState, [], []>;

export type StoreType = Mutate<StoreApi<ReturnType<StateCreator<AppState, [], []>>>, WebSocketMiddlewareMethods>;

export const WebSocketReadNotification = z.object({
  type: z.literal("READ_NOTIFICATION"),
  senderUid: z.number(),
  receiverUid: z.number(),    
});

export const WebSocketErrorNotification = z.object({
  type: z.literal("ERROR_NOTIFICATION"),
  message: z.string()
});

export const WebSocketMessageNotification = z.object({
  type: z.literal("MESSAGE_NOTIFICATION"),
  id: z.number(),
  senderUid: z.number(),
  receiverUid: z.number(),
  content: z.string(),
  sentAt: z.string(),
  isUser: z.boolean(),
  receiverRead: z.boolean(),
  attachments: z.array(z.object({
    id: z.number()
  }))
});

export const WebSocketGroupMessageNotification = z.object({
  type: z.literal("GROUP_MESSAGE_NOTIFICATION"),
  id: z.number(),
  senderId: z.number(),
  username: z.string(),
  groupId: z.number(),
  content: z.string(),
  sentAt: z.string(),
  attachments: z.array(z.object({
    id: z.number()
  }))
});

export const DeleteDirectMessageNotification = z.object({
  type: z.literal("DELETE_DIRECT_MESSAGE_NOTIFICATION"),
  contactId: z.number(),
  messageId: z.number()
});


export const DeleteGroupMessageNotification = z.object({
  type: z.literal("DELETE_GROUP_MESSAGE_NOTIFICATION"),
  groupId: z.number(),
  messageId: z.number()
});

export const EditDirectMessageNotification = z.object({
  type: z.literal("UPDATE_DIRECT_MESSAGE_NOTIFICATION"),
  contactId: z.number(),
  messageId: z.number(),
  content: z.string()
});

export const EditGroupMessageNotification = z.object({
  type: z.literal("UPDATE_GROUP_MESSAGE_NOTIFICATION"),
  groupId: z.number(),
  messageId: z.number(),
  content: z.string()
});

export const WebSocketOutgoingMessage = z
  .object({ type: z.literal("empty") })
  .or(WebSocketMessageNotification)
  .or(WebSocketReadNotification)
  .or(WebSocketErrorNotification)
  .or(WebSocketGroupMessageNotification)
  .or(DeleteDirectMessageNotification)
  .or(DeleteGroupMessageNotification)
  .or(EditDirectMessageNotification)
  .or(EditGroupMessageNotification)
;


export type WebSocketOutgoingMessage = z.infer<typeof WebSocketOutgoingMessage>;
export type WebSocketGroupMessageNotification = z.infer<typeof WebSocketGroupMessageNotification>;
export type WebSocketMessageNotification = z.infer<typeof WebSocketMessageNotification>;
export type WebSocketReadNotification = z.infer<typeof WebSocketReadNotification>;
export type WebSocketErrorNotification = z.infer<typeof WebSocketErrorNotification>;