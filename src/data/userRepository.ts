import { SignUpPayload, User } from "../models/user.model";

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

  const { password, ...publicUser } = newUser;
  return publicUser;
};

export const listUsers = (): User[] => {
  return readUsers().map(({ password, ...user }) => user);
};
