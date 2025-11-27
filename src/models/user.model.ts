export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

export interface SignUpResponse {
  user: User;
  message: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignInResponse {
  user: User;
  message: string;
}

export interface ResetPasswordPayload {
  email: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}
