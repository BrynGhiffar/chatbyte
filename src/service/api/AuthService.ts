import { False, True } from "@/utility/UtilityTypes";
import { z } from "zod";

const LoginResponse = z.object({
    success: z.literal(true),
    payload: z.string()
}).or(z.object({
    success: z.literal(false),
    message: z.string()
}));

type LoginResponse = z.infer<typeof LoginResponse>;

const Login = async (email: string, password: string): Promise<LoginResponse> => {

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const raw = JSON.stringify({
        "email": email,
        "password": password
    });

    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: raw,
        redirect: 'follow'
    };
      
    const response = await fetch("http://localhost:8080/api/auth/login", requestOptions);
    const json = await response.json();
    const parseJson = LoginResponse.safeParse(json);
    if (!parseJson.success) return {
        success: false,
        message: "? LoginResponse schema parsing error"
    };
    return parseJson.data;
};

export const AuthService = {
    Login
};
