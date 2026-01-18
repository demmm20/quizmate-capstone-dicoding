import { STORAGE_KEYS } from "../constants/config";

export const getUserFromStorage = () => {
  const raw =
    sessionStorage.getItem(STORAGE_KEYS.user) ||
    sessionStorage.getItem("user"); // fallback legacy
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const getUserKey = () => {
  const u = getUserFromStorage();
  return u?.id || u?.user_id || u?.username || "anon";
};

/**
 * Namespaced key, opsional menerima userKey override.
 * Jika ukey tidak diisi, pakai user aktif dari storage.
 */
export const nsKey = (key, ukey) => `${ukey || getUserKey()}:${key}`;