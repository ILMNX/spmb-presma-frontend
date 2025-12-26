import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosError } from 'axios';
import { getToken, clearAuth } from '../stores/authStore';

// Get API URL from environment or use default
const API_BASE_URL = import.meta.env.PUBLIC_API_URL;
const IS_DEV = import.meta.env.DEV;

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // Only log in development
    if (IS_DEV) {
      console.error('[API Request Error]', error.message);
    }
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Only log in development - avoid exposing sensitive data
    if (IS_DEV) {
      console.error('[API Response Error]', {
        status: error.response?.status,
        url: error.config?.url,
      });
    }

    if (error.response?.status === 401) {
      clearAuth();
      
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// API wrapper using fetch
export const api = {
  get: <T = any>(endpoint: string, config?: { responseType?: string }) => {
    if (config?.responseType === 'blob') {
      return requestBlob(endpoint);
    }
    return request<T>(endpoint, { method: 'GET' });
  },
  
  post: <T = any>(endpoint: string, data?: any) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  put: <T = any>(endpoint: string, data?: any) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  patch: <T = any>(endpoint: string, data?: any) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  delete: <T = any>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
};

// Generic API response interface
interface ApiResponse<T = any> {
  status: number;
  data: T;
}

async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    const data = await response.json();

    if (response.status === 401) {
      clearAuth();
      
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      
      throw new Error('Unauthorized');
    }

    return {
      status: response.status,
      data,
    };
  } catch (error) {
    // Only log in development
    if (IS_DEV) {
      console.error('[API Error]', {
        endpoint,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    throw error;
  }
}

async function requestBlob(endpoint: string): Promise<{ status: number; data: Blob }> {
  const token = getToken();
  
  const headers: Record<string, string> = {
    'Accept': 'application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    method: 'GET',
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Request failed`);
  }

  const blob = await response.blob();
  return {
    status: response.status,
    data: blob,
  };
}

export default api;