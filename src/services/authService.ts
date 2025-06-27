import api from "./api";
import { STORAGE_KEYS } from "../config/apiConfig";

// Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    plantsCount: number;
    likesCount: number;
    savedCount: number;
    badges: string[];
  };
  accessToken: string;
  refreshToken: string;
}

class AuthService {
  // Login user
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", data);

    // Store tokens and user data
    this.setAuthData(response);

    return response;
  }

  // Register new user
  async signup(data: SignupRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", data);

    // Store tokens and user data
    this.setAuthData(response);

    return response;
  }

  // Request password reset
  async forgotPassword(
    data: ForgotPasswordRequest
  ): Promise<{ success: boolean; message: string }> {
    return api.post<{ success: boolean; message: string }>(
      "/auth/forgot-password",
      data
    );
  }

  // Reset password with token
  async resetPassword(
    data: ResetPasswordRequest
  ): Promise<{ success: boolean; message: string }> {
    return api.post<{ success: boolean; message: string }>(
      "/auth/reset-password",
      data
    );
  }

  // Refresh token
  async refreshToken(): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await api.post<{
      accessToken: string;
      refreshToken: string;
    }>("/auth/refresh", { refreshToken });

    // Update tokens in storage
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);

    return response;
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage
      this.clearAuthData();
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Get access token
  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  // Get refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  // Get current user data
  getCurrentUser(): any {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  }

  // Set authentication data in storage
  private setAuthData(response: AuthResponse): void {
    if (response.accessToken) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.accessToken);
    }

    if (response.refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
    }

    if (response.user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
    }

    // Set token expiry time (assuming tokens expire in 1 hour)
    const expiryTime = new Date();
    expiryTime.setHours(expiryTime.getHours() + 1);
    localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toISOString());
  }

  // Clear authentication data from storage
  private clearAuthData(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
  }
}

export const authService = new AuthService();
export default authService;
