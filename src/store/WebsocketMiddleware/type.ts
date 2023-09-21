import { devtools } from "zustand/middleware";
import { AppState } from '../AppStore/type';
import { StoreMutatorIdentifier, StateCreator } from 'zustand';
import { z } from "zod";

type Write<T extends object, U extends object> = Omit<T, keyof U> & U

type Cast<T, U> = T extends U ? T : U

export type SendMessage = (receiverId: number, message: string) => void;
export type SendGroupMessage = (groupId: number, message: string) => void;

declare module 'zustand' {
    interface StoreMutators<S, A> {
        sendMessage: Write<Cast<S, object>, { sendMessage: A }>,
        sendGroupMessage: Write<Cast<S, object>, {sendGroupMessage: A}>
    }
}

export type WebsocketMiddleware = <
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  f: StateCreator<AppState, [
    ...Mps, 
    ['sendMessage', SendMessage],
    ['sendGroupMessage', SendGroupMessage]
], Mcs>,
) => StateCreator<AppState, Mps, [
  ['sendMessage', SendMessage],
  ['sendGroupMessage', SendGroupMessage],
  ...Mcs
]>

export type WebsocketMiddlewareImpl = (
    f: StateCreator<AppState, [], []>,
) => StateCreator<AppState, [], []>;

export const WebSocketOutgoingMessage = z.object({
  type: z.literal("MESSAGE_NOTIFICATION"),
  id: z.number(),
  senderUid: z.number(),
  receiverUid: z.number(),
  content: z.string(),
  sentAt: z.string(),
  isUser: z.boolean(),
  receiverRead: z.boolean(),
}).or(z.object({
  type: z.literal("READ_NOTIFICATION"),
  senderUid: z.number(),
  receiverUid: z.number(),
})).or(z.object({
  type: z.literal("empty")
})).or(z.object({
  type: z.literal("ERROR_NOTIFICATION"),
  message: z.string()
})).or(z.object({
  type: z.literal("GROUP_MESSAGE_NOTIFICATION"),
  id: z.number(),
  senderId: z.number(),
  groupId: z.number(),
  content: z.string(),
  sentAt: z.string()
}));

export type WebSocketOutgoingMessage = z.infer<typeof WebSocketOutgoingMessage>;