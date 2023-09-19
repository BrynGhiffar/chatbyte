import { z } from "zod"
import { Endpoint, request } from "./Endpoint";

const GetGroupsResponse = z.object({
    success: z.literal(true),
    payload: z.array(z.object({
        id: z.number(),
        name: z.string()
    }))
}).or(z.object({
    success: z.literal(false),
    message: z.string()
}));

const getGroups = async (token: string) => {
    const req = await request(GetGroupsResponse, {
        method: "GET",
        ept: Endpoint.group(),
        headers: { "Authorization": `Bearer ${token}` }
    });
    if (!req.success) return req;
    return req.payload;
}

const GetGroupMessageResponse = z.object({
    success: z.literal(true),
    payload: z.array(z.object({
        content: z.string(),
        groupId: z.number(),
        id: z.number(),
        senderId: z.number(),
        sentAt: z.string()
    }))
}).or(z.object({
    success: z.literal(false),
    message: z.string()
}));

const getGroupMessages = async (groupId: number, token: string) => {
    const req = await request(GetGroupMessageResponse, {
        method: "GET",
        ept: Endpoint.groupMessage(groupId),
        headers: { "Authorization": `Bearer ${token}` }
    });
    if (!req.success) return req;
    return req.payload;
}

export const GroupService = {
    getGroups,
    getGroupMessages
};