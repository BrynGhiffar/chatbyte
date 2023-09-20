import { devtools } from "zustand/middleware";
import { AppState } from '../AppStore/type';
import { StoreMutatorIdentifier, StateCreator } from 'zustand';

type Write<T extends object, U extends object> = Omit<T, keyof U> & U

type Cast<T, U> = T extends U ? T : U

export type SendMessage = (receiverId: number, message: string) => void;

declare module 'zustand' {
    interface StoreMutators<S, A> {
        sendMessage: Write<Cast<S, object>, { sendMessage: A }>
    }
}

export type WebsocketMiddleware = <
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  f: StateCreator<AppState, [
    ...Mps, 
    ['sendMessage', SendMessage]
  ], Mcs>,
) => StateCreator<AppState, Mps, [
  ['sendMessage', SendMessage],
  ...Mcs]
  >

export type WebsocketMiddlewareImpl = (
    f: StateCreator<AppState, [], []>,
) => StateCreator<AppState, [], []>;