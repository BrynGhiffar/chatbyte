import { devtools } from "zustand/middleware";
import { AppState, AppStateGet, AppStateSet } from '../AppStore/type';
import { StoreMutatorIdentifier, StateCreator, Mutate, StoreApi } from 'zustand';
import { z } from "zod";

type Write<T extends object, U extends object> = Omit<T, keyof U> & U

type Cast<T, U> = T extends U ? T : U

export type SendMessage = (receiverId: number, message: string) => void;
export type SendGroupMessage = (groupId: number, message: string) => void;
export type WsConnect = (set: AppStateSet, get: AppStateGet, token: string) => void;
export type WsDisconnect = () => void;


declare module 'zustand' {
    interface StoreMutators<S, A> {
        sendMessage: Write<Cast<S, object>, { sendMessage: A }>,
        sendGroupMessage: Write<Cast<S, object>, { sendGroupMessage: A }>,
        wsConnect: Write<Cast<S, object>, { wsConnect: A }>,
        wsDisconnect: Write<Cast<S, object>, { wsDisconnect: A }>,
    }
}

export type WebSocketMiddlewareMethods = [
  ['sendMessage', SendMessage],
  ['sendGroupMessage', SendGroupMessage],
  ['wsConnect', WsConnect],
  ['wsDisconnect', WsDisconnect],
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
});

export const WebSocketGroupMessageNotification = z.object({
  type: z.literal("GROUP_MESSAGE_NOTIFICATION"),
  id: z.number(),
  senderId: z.number(),
  username: z.string(),
  groupId: z.number(),
  content: z.string(),
  sentAt: z.string()
});


export const WebSocketOutgoingMessage = z
  .object({ type: z.literal("empty") })
  .or(WebSocketMessageNotification)
  .or(WebSocketReadNotification)
  .or(WebSocketErrorNotification)
  .or(WebSocketGroupMessageNotification)
;


export type WebSocketOutgoingMessage = z.infer<typeof WebSocketOutgoingMessage>;
export type WebSocketGroupMessageNotification = z.infer<typeof WebSocketGroupMessageNotification>;
export type WebSocketMessageNotification = z.infer<typeof WebSocketMessageNotification>;
export type WebSocketReadNotification = z.infer<typeof WebSocketReadNotification>;
export type WebSocketErrorNotification = z.infer<typeof WebSocketErrorNotification>;