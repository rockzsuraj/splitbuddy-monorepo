// apiClient.ts
import axios from "axios";
import type { AxiosError } from "axios";
import { getAuthRefreshToken, getAuthToken } from '../lib/storage';
import { refreshAccessToken } from "./services/authservice";
import { CustomAxiosRequestConfig } from "../types/type";
import { getBaseUrl } from "@/config/api";
import { logger } from "@/devtools/Logger";

export const apiClient = axios.create({
  timeout: 10000,
});

export async function initApiClient() {
  const baseUrl = await getBaseUrl();
  apiClient.defaults.baseURL = baseUrl;
}
// Request interceptor to add JWT token to headers
apiClient.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  console.log('API Request:', config.method?.toUpperCase(), config.url);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for global error handling and token refresh
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Success:', response.config.method?.toUpperCase(), response.config.url, response.status);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    
    // Log API error
    logger.logApiError(error, `${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`);

    if (error.response?.status === 401) {
      // ❌ If this request opts out of refresh, just reject
      if (originalRequest.skipAuthRefresh) {
        return Promise.reject(error);
      }

      if (!originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = await getAuthRefreshToken();
          if (refreshToken) {
            const refreshResponse = await refreshAccessToken(refreshToken);
            const newAccessToken = refreshResponse.data.data.accessToken;

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          logger.logApiError(refreshError, 'Token Refresh');
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);
export default apiClient;