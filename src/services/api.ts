import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import {
  API_BASE_URL,
  REQUEST_TIMEOUT,
  STORAGE_KEYS,
} from "../config/apiConfig";
import toast from "react-hot-toast";
import authService from "./authService";

// Create an Axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

// Function to add callbacks to refreshSubscribers array
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Function to call all subscribers with new token
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// Check if token is expired
const isTokenExpired = (): boolean => {
  const expiryTime = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
  if (!expiryTime) return true;

  return new Date() > new Date(expiryTime);
};

// Request interceptor for API calls
axiosInstance.interceptors.request.use(
  async (config) => {
    // Check if token is expired before making a request
    if (
      isTokenExpired() &&
      config.url !== "/auth/refresh" &&
      authService.getRefreshToken()
    ) {
      try {
        // Get a new token
        const tokens = await authService.refreshToken();
        config.headers["Authorization"] = `Bearer ${tokens.accessToken}`;
      } catch (error) {
        // If refresh fails, proceed with the request (it will fail and be caught by response interceptor)
        console.error("Failed to refresh token on request:", error);
      }
    } else {
      const token = authService.getToken();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle unauthorized errors (401)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh"
    ) {
      // If we're already refreshing, add this request to the queue
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(axios(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the token
        const refreshToken = authService.getRefreshToken();
        if (!refreshToken) {
          // No refresh token available, redirect to login
          handleAuthError();
          return Promise.reject(error);
        }

        const tokens = await authService.refreshToken();

        // Notify all subscribers about new token
        onTokenRefreshed(tokens.accessToken);
        isRefreshing = false;

        // Retry the original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }

        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        isRefreshing = false;
        handleAuthError();
        return Promise.reject(refreshError);
      }
    }

    // Handle server errors
    if (error.response?.status === 500) {
      toast.error("Server error. Please try again later.");
    }

    return Promise.reject(error);
  }
);

// Helper function to handle authentication errors
const handleAuthError = () => {
  // Clear local storage
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);

  // No longer using direct window location change to avoid page reload
  // Instead, this will be handled by Redux and React Router
  // The auth state change will trigger the protected route to redirect
  toast.error("Your session has expired. Please log in again.");
};

// Generic request method
const request = async <T = any>(
  method: string,
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axiosInstance({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle specific error messages from server
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
    } else {
      toast.error("An unexpected error occurred");
    }
    throw error;
  }
};

// Export request methods
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    request<T>("get", url, undefined, config),
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    request<T>("post", url, data, config),
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    request<T>("put", url, data, config),
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    request<T>("patch", url, data, config),
  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    request<T>("delete", url, undefined, config),
};

export default api;
