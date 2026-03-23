import axios from "axios";

import { clearAuthSession, getAccessToken } from "../lib/auth";

function resolveApiBaseUrl() {
  const configured = import.meta.env.VITE_API_URL;
  if (configured) {
    return configured;
  }

  if (typeof window !== "undefined") {
    const { hostname, port, protocol } = window.location;
    if (port === "5173") {
      return `${protocol}//${hostname}:8000/api/v1`;
    }
  }

  return "http://localhost:8000/api/v1";
}

export const api = axios.create({
  baseURL: resolveApiBaseUrl(),
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthSession();
      window.dispatchEvent(new Event("guruhome:unauthorized"));
    }
    return Promise.reject(error);
  },
);

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") {
      return detail;
    }
    return error.message || "Request failed";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}

