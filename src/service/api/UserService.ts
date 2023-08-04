import { BackendEndpoint, Endpoint, request } from "./Endpoint";
import { z } from "zod";

export const avatarImageUrl = (uid: number) => `${BackendEndpoint()}${Endpoint.userAvatar(uid)}`;

const GetUserDetailsResponse = z.object({
    success: z.literal(true),
    payload: z.object({
        uid: z.number(),
        username: z.string(),
    })
}).or(z.object({
    success: z.literal(false),
    message: z.string()
}));

type GetUserDetailsResponse = z.infer<typeof GetUserDetailsResponse>;

const getUserDetails = async (token: string) => {
    const res = await request(GetUserDetailsResponse, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}`},
        ept: Endpoint.userDetails(),
    });

    if (!res.success) return res;
    return res.payload;
};

const UploadUserAvatarResponse = z.object({
    success: z.literal(true),
    message: z.string()
}).or(z.object({
    success: z.literal(false),
    message: z.string()
}));

const uploadUserAvatar = async (token: string, blob: File) => {
    const res = await request(UploadUserAvatarResponse, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`},
        body: blob,
        ept: Endpoint.postUserAvatar(),
    });
    return res;

};

export const UserService = {
    getUserDetails,
    uploadUserAvatar
};