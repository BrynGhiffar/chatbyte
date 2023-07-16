import { z } from "zod";


export const BackendEndpoint = (): string | null => {
    const host = z.string().safeParse(import.meta.env.VITE_BACKEND_HOST);
    const schema = z.string().safeParse(import.meta.env.VITE_BACKEND_SCHEMA);
    const base_path = z.string().safeParse(import.meta.env.VITE_BACKEND_BASE_PATH);
    const port = z.string().safeParse(import.meta.env.VITE_BACKEND_PORT);
    if (!host.success) return null
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
}


type KeyStringValueString = { [key: string ]: string; };

type RequestWithBody = { method: "POST" | "PUT", ept: string, headers: KeyStringValueString, body: object };
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
        const body = request.body === undefined ? request.body : JSON.stringify(request.body);
        const requestOptions: RequestInit = {
            method: request.method,
            headers,
            body,
            redirect: 'follow',
        }
        response = await fetch(`${backendEndpoint}${request.ept}`, requestOptions);

    } else if (request.method === "GET" || request.method === "DELETE") {
        const requestOptions: RequestInit = {
            method: request.method,
            headers,
            redirect: 'follow',
        }
        response = await fetch(`${backendEndpoint}${request.ept}`, requestOptions);
    }
    if (!response) return { success: false, message: "UNKNOWN_METHOD" };
    const json = await response.json();
    const safeParse = parser.safeParse(json);
    if (!safeParse.success) return { success: false, message: "FAILED_PARSING_RESPONSE" };
    return { success: true, payload: safeParse.data };
}