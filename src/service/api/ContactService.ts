import { z } from "zod";

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

const getContacts = async (): Promise<GetContactResponse> => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const requestOptions: RequestInit = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
    };

    const res = await fetch("http://localhost:8080/api/contacts", requestOptions);
    const json = await res.json();
    const parseJson = GetContactResponse.safeParse(json);
    if (!parseJson.success) return {
        success: false,
        message: "? Failed parsing schema"
    };
    return parseJson.data;
};

export const ContactService = {
    getContacts
};