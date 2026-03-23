import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

import { api, getApiErrorMessage } from "../../api/client";
import {
  AuthTokens,
  AuthUser,
  clearAuthSession,
  getAccessToken,
  getStoredUser,
  setAuthSession,
  setStoredUser,
} from "../../lib/auth";

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (tokens: AuthTokens) => Promise<AuthUser>;
  logout: () => void;
  refreshUser: () => Promise<AuthUser | null>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  const [isLoading, setIsLoading] = useState(Boolean(getAccessToken()));

  async function refreshUser() {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return null;
    }

    try {
      const response = await api.get<AuthUser>("/auth/me");
      setUser(response.data);
      setStoredUser(response.data);
      return response.data;
    } catch {
      clearAuthSession();
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  async function login(tokens: AuthTokens) {
    setAuthSession(tokens, user);
    const profile = await refreshUser();
    if (!profile) {
      throw new Error("Unable to load user profile");
    }
    return profile;
  }

  function logout() {
    clearAuthSession();
    setUser(null);
  }

  useEffect(() => {
    void refreshUser();
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      clearAuthSession();
      setUser(null);
      setIsLoading(false);
    };

    window.addEventListener("guruhome:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("guruhome:unauthorized", handleUnauthorized);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
      refreshUser,
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function useAuthErrorMessage(error: unknown) {
  return getApiErrorMessage(error);
}

