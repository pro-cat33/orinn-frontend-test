import apiClient from "./api";
import { storage, getOrCreateDeviceId } from "./storage";

/**
 * Auth API response types
 */
export interface AuthResponse {
  user_id: string;
  device_id: string;
  access_token: string;
  refresh_token: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  device_id: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface OAuthRequest {
  provider: string;
  id_token: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface RefreshResponse {
  access_token: string;
}

export interface PasswordResetRequestRequest {
  email: string;
}

export interface PasswordResetRequestResponse {
  message: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  new_password: string;
}

export interface PasswordResetConfirmResponse {
  message: string;
}

/**
 * Save auth data to storage
 */
const saveAuthData = (data: AuthResponse): void => {
  storage.setAccessToken(data.access_token);
  storage.setRefreshToken(data.refresh_token);
  storage.setDeviceId(data.device_id);
  storage.setUserId(data.user_id);
};

/**
 * Auth API functions
 */
export const authApi = {
  /**
   * Register a new user
   */
  register: async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    // const deviceId = getOrCreateDeviceId();
    const response = await apiClient.post<AuthResponse>("/auth/register", {
      email,
      password
    } as RegisterRequest);

    saveAuthData(response.data);
    return response.data;
  },

  /**
   * Login with email and password
   */
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/login", {
      email,
      password,
    } as LoginRequest);

    saveAuthData(response.data);
    return response.data;
  },

  /**
   * OAuth login/register
   */
  oauth: async (
    provider: string,
    idToken: string
  ): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/oauth", {
      provider,
      id_token: idToken,
    } as OAuthRequest);

    saveAuthData(response.data);
    return response.data;
  },

  /**
   * Refresh access token
   */
  refresh: async (refreshToken: string): Promise<RefreshResponse> => {
    const response = await apiClient.post<RefreshResponse>("/auth/refresh", {
      refresh_token: refreshToken,
    } as RefreshRequest);

    storage.setAccessToken(response.data.access_token);
    return response.data;
  },

  /**
   * Request password reset email
   */
  requestPasswordReset: async (
    email: string
  ): Promise<PasswordResetRequestResponse> => {
    const response = await apiClient.post<PasswordResetRequestResponse>(
      "/auth/password-reset/request",
      {
        email,
      } as PasswordResetRequestRequest
    );

    return response.data;
  },

  /**
   * Confirm password reset with token
   */
  confirmPasswordReset: async (
    token: string,
    newPassword: string
  ): Promise<PasswordResetConfirmResponse> => {
    const response = await apiClient.post<PasswordResetConfirmResponse>(
      "/auth/password-reset/confirm",
      {
        token,
        new_password: newPassword,
      } as PasswordResetConfirmRequest
    );

    return response.data;
  },

  /**
   * Logout (clear local storage)
   */
  logout: (): void => {
    storage.clearAuth();
  },
};
