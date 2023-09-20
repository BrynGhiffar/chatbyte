import { Endpoint, WebSocketEndpoint } from "@/service/api/Endpoint";
import { SendMessage, WebsocketMiddleware, WebsocketMiddlewareImpl } from "./type";
import { Mutate, StoreApi } from 'zustand';
import { LocalStorage } from "@/utility/LocalStorage";


const websocketImpl: WebsocketMiddlewareImpl = (f) => (set, get, _store) => {
    type T = ReturnType<typeof f>;
    const token = LocalStorage.getLoginToken();
    const store = _store as Mutate<StoreApi<T>, [['sendMessage', SendMessage]]>;


    if (!token) {
        set(s => ({...s, type: "MISSING_TOKEN"}));
        store.sendMessage = (receiverId: number, message: string) => {};
        return f(set, get, _store);
    }
    const wsConn = new WebSocket(`${WebSocketEndpoint()}${Endpoint.webSocket(token)}`);
    wsConn.onmessage = (evt) => {
        
    };
    // store.sendMessage = ;
    return f(set, get, _store);
}

export const websocket = websocketImpl as unknown as WebsocketMiddleware;