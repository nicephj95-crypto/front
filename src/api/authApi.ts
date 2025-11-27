import { authenticateUser, createUser, resetUserPassword } from "../data/userRepository";
import {
  ResetPasswordPayload,
  ResetPasswordResponse,
  SignInPayload,
  SignInResponse,
  SignUpPayload,
  SignUpResponse,
} from "../models/user.model";

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const signUp = async (payload: SignUpPayload): Promise<SignUpResponse> => {
  await wait(400);
  const user = createUser(payload);
  return {
    user,
    message: `${user.name}님, 회원가입이 완료되었습니다.`,
  };
};

export const signIn = async (payload: SignInPayload): Promise<SignInResponse> => {
  await wait(300);
  const user = authenticateUser(payload.email.trim(), payload.password);
  return {
    user,
    message: `${user.name}님, 다시 만나서 반가워요!`,
  };
};

export const resetPassword = async (
  payload: ResetPasswordPayload,
): Promise<ResetPasswordResponse> => {
  await wait(300);
  const message = resetUserPassword(payload);
  return { message };
};
