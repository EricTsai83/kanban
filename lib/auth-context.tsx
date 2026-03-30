"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type User = {
  name: string;
  email: string;
  avatar: string;
};

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
};

const MOCK_USER: User = {
  name: "Demo User",
  email: "demo@example.com",
  avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c",
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function login() {
    setIsLoading(true);
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 1000),
    );
    setUser(MOCK_USER);
    setIsLoading(false);
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: user !== null, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
