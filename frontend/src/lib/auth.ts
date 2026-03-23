export type UserRole = "parent" | "tutor" | "admin";

export type AuthUser = {
  id: number;
  full_name: string;
  email: string | null;
  phone: string;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
};

export type AuthTokens = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  role: UserRole;
};

const ACCESS_TOKEN_KEY = "guruhome-access-token";
const REFRESH_TOKEN_KEY = "guruhome-refresh-token";
const USER_KEY = "guruhome-user";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setAuthSession(tokens: AuthTokens, user?: AuthUser | null) {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function clearAuthSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    clearAuthSession();
    return null;
  }
}

export function setStoredUser(user: AuthUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getDashboardRoute(role: UserRole) {
  if (role === "parent") {
    return "/parent-dashboard";
  }
  if (role === "tutor") {
    return "/tutor-dashboard";
  }
  return "/admin-dashboard";
}

