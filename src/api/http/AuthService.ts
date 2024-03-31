import { z } from 'zod';

import { Endpoint, request } from './Endpoint';

const LoginResponse = z
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

type LoginResponse = z.infer<typeof LoginResponse>;

const Login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const req = await request(LoginResponse, {
    method: 'POST',
    ept: Endpoint.authLogin(),
    headers: { 'Content-Type': 'application/json' },
    body: {
      email,
      password,
    },
  });
  if (!req.success) return req;
  return req.payload;
};

const Register = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const req = await request(LoginResponse, {
    method: 'POST',
    ept: Endpoint.authRegister(),
    headers: { 'Content-Type': 'application/json' },
    body: {
      email,
      password,
    },
  });
  if (!req.success) return req;
  return req.payload;
};

const ChangePasswordResponse = z
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

const changePassword = async (
  token: string,
  oldPassword: string,
  newPassword: string
) => {
  const req = await request(ChangePasswordResponse, {
    method: 'PUT',
    ept: Endpoint.changePassword(),
    headers: { 'Content-Type': 'application/json', Authorization: token },
    body: {
      oldPassword,
      newPassword,
    },
  });
  if (!req.success) return req;
  return req.payload;
};

const ValidateTokenResponse = z
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

type ValidateTokenResponse = z.infer<typeof ValidateTokenResponse>;

const validateToken = async (token: string): Promise<ValidateTokenResponse> => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const req = await request(ValidateTokenResponse, {
    method: 'GET',
    ept: Endpoint.authVerifyToken(),
    headers,
  });
  if (!req.success) return req;
  return req.payload;
};

export const AuthService = {
  Login,
  validateToken,
  Register,
  changePassword,
};
