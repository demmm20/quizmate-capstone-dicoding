import { STORAGE_KEYS } from "../constants/config";

export const cleanLegacyAuth = () => {
  ["token", "user"].forEach((k) => {
    sessionStorage.removeItem(k);
    localStorage.removeItem(k);
  });
};

export const saveAuth = (user, token) => {
  cleanLegacyAuth();
  if (token) sessionStorage.setItem(STORAGE_KEYS.authToken, token);
  if (user) sessionStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
};

export const loadAuth = () => {
  const token =
    sessionStorage.getItem(STORAGE_KEYS.authToken) ||
    sessionStorage.getItem("token"); // legacy fallback
  const rawUser =
    sessionStorage.getItem(STORAGE_KEYS.user) ||
    sessionStorage.getItem("user"); // legacy fallback
  let user = null;
  try {
    user = rawUser ? JSON.parse(rawUser) : null;
  } catch {
    user = null;
  }
  return { token, user };
};

export const clearAuth = () => {
  sessionStorage.removeItem(STORAGE_KEYS.authToken);
  sessionStorage.removeItem(STORAGE_KEYS.user);
  cleanLegacyAuth();
};