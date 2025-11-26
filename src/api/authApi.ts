import { createUser } from "../data/userRepository";
import { SignUpPayload, SignUpResponse } from "../models/user.model";

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const signUp = async (payload: SignUpPayload): Promise<SignUpResponse> => {
  await wait(400);
  const user = createUser(payload);
  return {
    user,
    message: `${user.name}님, 회원가입이 완료되었습니다.`,
  };
};
