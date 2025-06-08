import { useContext, useEffect, useState } from 'react';
// import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import { useUpdateEffect } from 'usehooks-ts';
import { z } from 'zod';

import { Endpoint, WebSocketEndpoint } from '@/api/http/Endpoint';
import { useSnackbar } from '@/store/AppStore/hooks';
import { useToken } from '@/utility/UtilityHooks';

export const WebSocketIncomingMessage = z.object({
  content: z.string(),
  receiverUid: z.number(),
});

type GroupMessage = {
  groupId: number;
  content: string;
};

export type WebSocketIncomingMessage = z.infer<typeof WebSocketIncomingMessage>;

export const WebSocketMessageNotification = z.object({});

export const WebSocketOutgoingMessage = z
  .object({
    type: z.literal('MESSAGE_NOTIFICATION'),
    id: z.number(),
    senderUid: z.number(),
    receiverUid: z.number(),
    content: z.string(),
    sentAt: z.string(),
    isUser: z.boolean(),
    receiverRead: z.boolean(),
  })
  .or(
    z.object({
      type: z.literal('READ_NOTIFICATION'),
      senderUid: z.number(),
      receiverUid: z.number(),
    })
  )
  .or(
    z.object({
      type: z.literal('empty'),
    })
  )
  .or(
    z.object({
      type: z.literal('ERROR_NOTIFICATION'),
      message: z.string(),
    })
  )
  .or(
    z.object({
      type: z.literal('GROUP_MESSAGE_NOTIFICATION'),
      id: z.number(),
      senderId: z.number(),
      groupId: z.number(),
      content: z.string(),
      sentAt: z.string(),
    })
  );

export type WebSocketOutgoingMessage = z.infer<typeof WebSocketOutgoingMessage>;

const useRawDataWebSocket = () => {
  const token = useToken();
  const ept = `${WebSocketEndpoint()}${Endpoint.webSocket(token)}`;
  // const { sendMessage: sendMessageRaw, lastMessage: lastMessageRaw } = useWebSocket(ept, { share: true });
  // return { sendMessageRaw, lastMessageRaw };
};

export const useSocket = () => {
  // const { sendMessageRaw, lastMessageRaw } = useRawDataWebSocket();
  const { pushError } = useSnackbar();
  const [lastMessageSocket, setLastMessage] =
    useState<WebSocketOutgoingMessage>({ type: 'empty' });

  // useUpdateEffect(() => {
  //     if (!lastMessageRaw?.data) return;
  //     const lastMessageJson = JSON.parse(lastMessageRaw?.data);
  //     const parseLastMessageRaw = WebSocketOutgoingMessage.safeParse(lastMessageJson);
  //     if (parseLastMessageRaw.success) {
  //         setLastMessage(_ => parseLastMessageRaw.data);
  //     } else {
  //         console.error("---- Failed parsing websocket notification -----")
  //         console.error(lastMessageJson);
  //         pushError("There was an issue parsing a message notification");
  //     }
  //     return;
  // }, [lastMessageRaw]);

  // const sendMessageSocket = (message: WebSocketIncomingMessage) => {
  //     sendMessageRaw(JSON.stringify({
  //         type: "SEND_MESSAGE",
  //         receiverUid: message.receiverUid,
  //         message: message.content
  //     }));
  // };

  // const sendGroupMessage = (message: GroupMessage) => {
  //     sendMessageRaw(JSON.stringify({
  //         type: "SEND_GROUP_MESSAGE",
  //         groupId: message.groupId,
  //         message: message.content
  //     }));
  // }
  // return { sendMessageSocket, sendGroupMessage, lastMessageSocket };
};
