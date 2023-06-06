import { z } from "zod";
const GetMessageResponse = z.object({
    success: z.literal(true),
    payload: z.array(
        z.object({
            id: z.number(),
            receiverId: z.number(),
            senderId: z.number(),
            isUser: z.boolean(),
            content: z.string(),
            time: z.string()
        })
    )
})
.or(z.object({
    success: z.literal(false),
    message: z.string()
}));


type GetMessageResponse = z.infer<typeof GetMessageResponse>;

const getMessage = async (token: string, receiverUid: number): Promise<GetMessageResponse> => {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${token}`);
    
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
    };
    
    const res = await fetch(`http://localhost:8080/api/message?receiverUid=${receiverUid}`, requestOptions);
    const json = await res.json();
    const parsedJson = GetMessageResponse.safeParse(json);
    if (!parsedJson.success) {
        // console.log(parsedJson.error)
        return ({
            success: false,
            message: "? Failed parsing schema"
        });
    }

    return parsedJson.data;
};

const MessageService = {
    getMessage
};

export default MessageService;