import { z } from 'zod';

import { Endpoint, request } from './Endpoint';

const GetMessageResponse = z
  .object({
    success: z.literal(true),
    payload: z.array(
      z.object({
        id: z.number(),
        receiverId: z.number(),
        senderId: z.number(),
        // isUser: z.boolean(),
        content: z.string(),
        sentAt: z.string(),
        read: z.boolean(),
        deleted: z.boolean(),
        edited: z.boolean(),
        attachments: z.array(
          z.object({
            id: z.number(),
          })
        ),
      })
    ),
  })
  .or(
    z.object({
      success: z.literal(false),
      message: z.string(),
    })
  );

type GetMessageResponse = z.infer<typeof GetMessageResponse>;

const SetMessageReadResponse = z
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

type SetMessageReadResponse = z.infer<typeof SetMessageReadResponse>;

const getMessage = async (
  token: string,
  receiverUid: number
): Promise<GetMessageResponse> => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const req = await request(GetMessageResponse, {
    method: 'GET',
    ept: Endpoint.getMessage(receiverUid),
    headers,
  });
  if (!req.success) return req;
  return req.payload;
};

const setMessagesRead = async (
  token: string,
  contactId: number
): Promise<SetMessageReadResponse> => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const res = await request(SetMessageReadResponse, {
    method: 'PUT',
    ept: 'DEPRECATED', // Endpoint.readMessage(contactId),
    headers,
    body: {},
  });

  // if (!res.success) return res;
  // return res.payload;
  return { success: false, message: 'API IS DEPRECATED' };
};

const MessageService = {
  getMessage,
  setMessagesRead,
};

export default MessageService;
