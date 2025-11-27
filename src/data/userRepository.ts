import { ResetPasswordPayload, SignUpPayload, User } from "../models/user.model";

interface StoredUser extends User {
  password: string;
}

const STORAGE_KEY = "bookstore_users";

const readUsers = (): StoredUser[] => {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch (error) {
    console.error("Failed to parse users from storage", error);
    return [];
  }
};

const writeUsers = (users: StoredUser[]) => {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

const toPublicUser = ({ password, ...user }: StoredUser): User => user;

const findUserByEmail = (email: string): StoredUser | undefined => {
  const users = readUsers();
  return users.find(user => user.email === email);
};

export const createUser = (payload: SignUpPayload): User => {
  const users = readUsers();
  if (users.some(user => user.email === payload.email)) {
    throw new Error("이미 가입된 이메일입니다.");
  }

  const trimmedName = payload.name.trim();
  const trimmedEmail = payload.email.trim();

  const newUser: StoredUser = {
    id: Date.now(),
    name: trimmedName,
    email: trimmedEmail,
    password: payload.password,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  writeUsers(users);

  return toPublicUser(newUser);
};

export const listUsers = (): User[] => {
  return readUsers().map(toPublicUser);
};

export const authenticateUser = (email: string, password: string): User => {
  const user = findUserByEmail(email);
  if (!user) {
    throw new Error("존재하지 않는 사용자입니다.");
  }

  if (user.password !== password) {
    throw new Error("비밀번호가 일치하지 않습니다.");
  }

  return toPublicUser(user);
};

export const resetUserPassword = ({ email, newPassword }: ResetPasswordPayload): string => {
  const users = readUsers();
  const targetIndex = users.findIndex(user => user.email === email);

  if (targetIndex === -1) {
    throw new Error("등록되지 않은 이메일입니다.");
  }

  users[targetIndex] = { ...users[targetIndex], password: newPassword };
  writeUsers(users);

  return "비밀번호가 성공적으로 변경되었습니다.";
};
