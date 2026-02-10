/**
 * Storage utilities for tokens and device ID
 */

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const DEVICE_ID_KEY = "device_id";
const USER_ID_KEY = "user_id";

export const storage = {
  // Access Token
  getAccessToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setAccessToken: (token: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  removeAccessToken: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },

  // Refresh Token
  getRefreshToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (token: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  removeRefreshToken: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  // Device ID
  getDeviceId: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(DEVICE_ID_KEY);
  },

  setDeviceId: (deviceId: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  },

  removeDeviceId: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(DEVICE_ID_KEY);
  },

  // User ID
  getUserId: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(USER_ID_KEY);
  },

  setUserId: (userId: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(USER_ID_KEY, userId);
  },

  removeUserId: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(USER_ID_KEY);
  },

  // Clear all auth data
  clearAuth: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(DEVICE_ID_KEY);
    localStorage.removeItem(USER_ID_KEY);
  },
};

/**
 * Generate or retrieve device ID
 */
export const getOrCreateDeviceId = (): string => {
  if (typeof window === "undefined") {
    return "";
  }

  let deviceId = storage.getDeviceId();
  if (!deviceId) {
    // Generate a simple UUID v4
    deviceId =
      "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    storage.setDeviceId(deviceId);
  }
  return deviceId;
};
