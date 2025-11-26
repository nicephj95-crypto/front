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