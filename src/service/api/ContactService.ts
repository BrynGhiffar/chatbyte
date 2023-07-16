import { z } from "zod";
import { BackendEndpoint, Endpoint, request } from "./Endpoint";

const GetContactResponse = z.object({
    success: z.literal(true),
    payload: z.array(
        z.object({
            id: z.number().positive(),
            email: z.string(),
            username: z.string()
        })
    )
}).or(z.object({
    success: z.literal(false),
    message: z.string()
}));

type GetContactResponse = z.infer<typeof GetContactResponse>;

const GetContactRecentResponse = z.object({
    success: z.literal(true),
    payload: z.array(
        z.object({
            contact_id: z.number(),
            content: z.string(),
            sent_at: z.string(),
            unread_count: z.number(),
            username: z.string()
        })
    )
}).or(z.object({
    success: z.literal(false),
    message: z.string()
}));

type GetContactRecentResponse = z.infer<typeof GetContactRecentResponse>;


const getContacts = async (token: string): Promise<GetContactResponse> => {
    const res = await request(GetContactResponse, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
        ept: Endpoint.contacts()
    });
    if (!res.success) return res;
    return res.payload;
};

const getContactsRecent = async (token: string): Promise<GetContactRecentResponse> => {
    const res = await request(GetContactRecentResponse, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}`},
        ept: Endpoint.contactsRecent()
    });
    if (!res.success) return res;
    return res.payload;
}

export const ContactService = {
    getContacts,
    getContactsRecent
};