import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { resetPassword as resetPasswordApi, signIn } from "api/authApi";
import { ResetPasswordPayload, SignInPayload, User } from "models/user.model";

interface AuthContextValue {
  user: User | null;
  login: (payload: SignInPayload) => Promise<string>;
  logout: () => void;
  resetPassword: (payload: ResetPasswordPayload) => Promise<string>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "bookstore_current_user";

const readStoredUser = (): User | null => {
  if (typeof localStorage === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as User;
  } catch (error) {
    console.error("Failed to parse stored user", error);
    return null;
  }
};

const writeStoredUser = (user: User | null) => {
  if (typeof localStorage === "undefined") return;
  if (!user) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(readStoredUser());
  }, []);

  const login = async (payload: SignInPayload) => {
    const response = await signIn(payload);
    setUser(response.user);
    writeStoredUser(response.user);
    return response.message;
  };

  const logout = () => {
    setUser(null);
    writeStoredUser(null);
  };

  const handleResetPassword = async (payload: ResetPasswordPayload) => {
    const response = await resetPasswordApi(payload);
    return response.message;
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      resetPassword: handleResetPassword,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
