import { z } from "zod";


export const BackendEndpoint = (): string | null => {
    const host = z.string().safeParse(import.meta.env.VITE_BACKEND_HOST);
    const schema = z.string().safeParse(import.meta.env.VITE_BACKEND_SCHEMA);
    const base_path = z.string().safeParse(import.meta.env.VITE_BACKEND_BASE_PATH);
    const port = z.string().safeParse(import.meta.env.VITE_BACKEND_PORT);
    if (!host.success) return null;
    if (!schema.success) return null;
    if (!base_path.success) return null;
    if (!port.success) return null;
    return `${schema.data}://${host.data}:${port.data}${base_path.data}`
}

export const WebSocketEndpoint = (): string | null => {
    const host = z.string().safeParse(import.meta.env.VITE_BACKEND_HOST);
    const schema = z.string().safeParse(import.meta.env.VITE_BACKEND_WS_SCHEMA);
    const base_path = z.string().safeParse(import.meta.env.VITE_BACKEND_BASE_PATH);
    const port = z.string().safeParse(import.meta.env.VITE_BACKEND_PORT);
    if (!host.success) return null;
    if (!schema.success) return null;
    if (!base_path.success) return null;
    if (!port.success) return null;
    return `${schema.data}://${host.data}:${port.data}${base_path.data}`
}

export class Endpoint {
    static getMessage = (receiverUid: number) => `/message?receiverUid=${receiverUid}`;
    static readMessage = (receiverUid: number) => `/message/read?receiverUid=${receiverUid}`;
    static contacts = () => "/contacts";
    static contactsRecent = () => "/contacts/recent";
    static authLogin = () => "/auth/login";
    static authRegister = () => "/auth/register";
    static changePassword = () => `/auth/change-password`;
    static authVerifyToken = () => "/auth/valid-token";
    static messageWebSocket = (token: string) => `/message/ws?token=${token}`;
    static webSocket = (token: string) => `/ws?token=${token}`;
    static userAvatar = (uid: number) => `/user/avatar/${uid}`;
    static postUserAvatar = () => `/user/avatar`;
    static userDetails = () => `/user/details`;
    static updateUser = () => `/user`;
    static group = () => "/group";
    static groupRecent = () => "/group/recent";
    static groupRead = (groupId: number) => `/group/read/${groupId}`;
    static groupMessage = (groupId: number) => `/group/message/${groupId}`;
    static groupAvatar = (groupId: number) => `/group/image/${groupId}`;
}


type KeyStringValueString = { [key: string ]: string; };

type RequestWithBody = { method: "POST" | "PUT", ept: string, headers: KeyStringValueString, body: any };
type Request = { method: "GET" | "DELETE", ept: string, headers: KeyStringValueString };

export const request = async <T extends z.ZodTypeAny>(parser: T, request: RequestWithBody | Request): Promise<{ success: true, payload: z.infer<T>} | { success: false, message: string }> => {
    const backendEndpoint = BackendEndpoint();
    if (!backendEndpoint) {
        return { success: false, message: "MISSING_BACKEND_ENDPOINTS" };
    }
    const headers = new Headers();
    for (const key in request.headers) {
        const value = request.headers[key];
        headers.append(key, value);
    }
    let response: Response | null = null;
    if (request.method === "POST" || request.method === "PUT") {
        let body = request.body;
        if (!(body instanceof File) && !(body instanceof FormData)) {
            body = JSON.stringify(body);
        }
        const requestOptions: RequestInit = {
            method: request.method,
            headers,
            body,
            redirect: 'follow',
        }
        try {
            response = await fetch(`${backendEndpoint}${request.ept}`, requestOptions);
        } catch (err) {
            return { success: false, message: String(err) }
        }

    } else if (request.method === "GET" || request.method === "DELETE") {
        const requestOptions: RequestInit = {
            method: request.method,
            headers,
            redirect: 'follow',
        }
        try { 
            response = await fetch(`${backendEndpoint}${request.ept}`, requestOptions);
        } catch (err) {
            return { success: false, message: String(err)}
        }
    }
    if (!response) return { success: false, message: "UNKNOWN_METHOD" };
    const json = await response.json();
    const safeParse = parser.safeParse(json);
    if (!safeParse.success) return { success: false, message: `FAILED_PARSING_RESPONSE: ${JSON.stringify(json)}` };
    return { success: true, payload: safeParse.data };
}