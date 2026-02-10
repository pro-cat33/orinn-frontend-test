import axios, { AxiosInstance, AxiosError } from "axios";
import { storage } from "./storage";

// Use Next.js API proxy to avoid CORS issues
// The proxy route handles all requests server-side
const API_BASE_URL = "https://aletha-proparoxytonic-gearldine.ngrok-free.dev/api/v1";

/**
 * Create axios instance with default configuration
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor to add access token to headers
 */
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = storage.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle token refresh
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = storage.getRefreshToken();
      if (refreshToken) {
        try {
          const response = await apiClient.post("/auth/refresh", {
            refresh_token: refreshToken,
          });

          const { access_token } = response.data;
          storage.setAccessToken(access_token);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed, clear auth and redirect to login
          storage.clearAuth();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
