import { z } from 'zod';

import { BackendEndpoint, Endpoint, request } from './Endpoint';

export const avatarImageUrl = (uid: number) => (randNum: number) =>
  `${BackendEndpoint()}${Endpoint.userAvatar(uid)}?random=${randNum}`;
export const avatarImageGroupUrl = (groupId: number) => (randNum: number) =>
  `${BackendEndpoint()}${Endpoint.groupAvatar(groupId)}?random=${randNum}`;

const GetUserDetailsResponse = z
  .object({
    success: z.literal(true),
    payload: z.object({
      user_id: z.number(),
      username: z.string(),
    }),
  })
  .or(
    z.object({
      success: z.literal(false),
      message: z.string(),
    })
  );

type GetUserDetailsResponse = z.infer<typeof GetUserDetailsResponse>;

const getUserDetails = async (token: string) => {
  const res = await request(GetUserDetailsResponse, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    ept: Endpoint.userDetails(),
  });

  if (!res.success) return res;
  return res.payload;
};

const UploadUserAvatarResponse = z
  .object({
    success: z.literal(true),
    message: z.string(),
  })
  .or(
    z.object({
      success: z.literal(false),
      message: z.string(),
    })
  );

const uploadUserAvatar = async (token: string, blob: File) => {
  const res = await request(UploadUserAvatarResponse, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: blob,
    ept: Endpoint.postUserAvatar(),
  });
  return res;
};

const ChangeUserNameResponse = z
  .object({
    success: z.literal(true),
    payload: z.string(),
  })
  .or(
    z.object({
      success: z.literal(false),
      message: z.string(),
    })
  );

const changeUserName = async (token: string, newUsername: string) => {
  const res = await request(ChangeUserNameResponse, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    ept: Endpoint.updateUser(),
    body: {
      username: newUsername,
    },
  });
  if (!res.success) return res;
  return res.payload;
};

export const UserService = {
  getUserDetails,
  uploadUserAvatar,
  changeUserName,
};
