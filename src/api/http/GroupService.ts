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
};

const GroupConversationDetail = z.object({
    content: z.string(),
    deleted: z.boolean(),
    sentAt: z.string(),
    username: z.string()
});

export type GroupConversationDetail = z.infer<typeof GroupConversationDetail>;

const GroupConversation = z.object({
    groupId: z.number(),
    groupName: z.string(),
    unreadMessage: z.number(),
    detail: z.null().or(GroupConversationDetail),
});

export type GroupConversation = z.infer<typeof GroupConversation>;

const GetGroupsRecentResponse = z.object({
    success: z.literal(true),
    payload: z.array(GroupConversation)
}).or(z.object({
    success: z.literal(false),
    message: z.string(),
}));

const getGroupsRecent = async (token: string) => {
    const req = await request(GetGroupsRecentResponse, {
        method: "GET",
        ept: Endpoint.groupRecent(),
        headers: { "Authorization": `Bearer ${token}`}
    });
    if (!req.success) return req;
    return req.payload;
};

const UpdateGroupReadMessageResponse = z.object({
    success: z.literal(true),
    payload: z.string(),
}).or(z.object({
    success: z.literal(false),
    message: z.string()
}));

const updateReadMessage = async (token: string, groupId: number) => {
    const req = await request(UpdateGroupReadMessageResponse, {
        method: "PUT", 
        ept: Endpoint.groupRead(groupId),
        headers: { "Authorization": `Bearer ${token}` },
        body: undefined,
    });
    if (!req.success) return req;
    return req.payload;
}

const GetGroupMessageResponse = z.object({
    success: z.literal(true),
    payload: z.array(z.object({
        content: z.string(),
        groupId: z.number(),
        username: z.string(),
        id: z.number(),
        senderId: z.number(),
        sentAt: z.string(),
        deleted: z.boolean(),
        edited: z.boolean(),
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
};

export type GetGroupMessageResponse = z.infer<typeof GetGroupMessageResponse>;

const CreateGroupResponse = z.object({
    success: z.literal(true),
    payload: z.string()
}).or(z.object({
    success: z.literal(false),
    message: z.string()
}));

const createGroup = async (token: string, name: string, members: number[], image: File | null = null) => {
    const form = new FormData();
    if (image) {
        form.append("profilePicture", image);
    }
    form.append("groupName", name);
    form.append("members", ` ${members.join(",")}`);
    
    const req = await request(CreateGroupResponse, {
        method: "POST",
        ept: Endpoint.group(),
        headers: { "Authorization": `Bearer ${token}`},
        body: form
    });
    if (!req.success) return req;
    return req.payload;
}

export const GroupService = {
    getGroups,
    getGroupMessages,
    createGroup,
    getGroupsRecent,
    updateReadMessage
};