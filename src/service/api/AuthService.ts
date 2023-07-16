import { z } from "zod";
import { Endpoint, request } from "./Endpoint";

const LoginResponse = z.object({
    success: z.literal(true),
    payload: z.string()
}).or(z.object({
    success: z.literal(false),
    message: z.string()
}));

type LoginResponse = z.infer<typeof LoginResponse>;

const Login = async (email: string, password: string): Promise<LoginResponse> => {
    const req = await request(LoginResponse, {
        method: "POST",
        ept: Endpoint.authLogin(),
        headers: { "Content-Type": "application/json" },
        body: {
            email, password
        }
    });
    if (!req.success) return req;
    return req.payload;
};

export const AuthService = {
    Login
};
