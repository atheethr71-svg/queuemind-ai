import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_URL } from './constants';

const apiBase = API_URL ? (API_URL.endsWith('/api/v1') ? API_URL : `${API_URL}/api/v1`) : '/api/v1';

export const apiClient = axios.create({
  baseURL: apiBase,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Request Interceptor ─────────────────────────────────────────────────────

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('queuemind_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ────────────────────────────────────────────────────

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    // Graceful response handling
    return Promise.reject(error);
  }
);

// ─── Typed API Helpers ───────────────────────────────────────────────────────

export async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const cleanUrl = url.replace(/^\/api\/v1/, '');
  const response = await apiClient.get<T>(cleanUrl, { params });
  return response.data;
}

export async function post<T>(url: string, data?: unknown): Promise<T> {
  const cleanUrl = url.replace(/^\/api\/v1/, '');
  const response = await apiClient.post<T>(cleanUrl, data);
  return response.data;
}

export async function put<T>(url: string, data?: unknown): Promise<T> {
  const cleanUrl = url.replace(/^\/api\/v1/, '');
  const response = await apiClient.put<T>(cleanUrl, data);
  return response.data;
}

export async function patch<T>(url: string, data?: unknown): Promise<T> {
  const cleanUrl = url.replace(/^\/api\/v1/, '');
  const response = await apiClient.patch<T>(cleanUrl, data);
  return response.data;
}

export async function del<T>(url: string): Promise<T> {
  const cleanUrl = url.replace(/^\/api\/v1/, '');
  const response = await apiClient.delete<T>(cleanUrl);
  return response.data;
}

export default apiClient;

export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    me: '/auth/me',
    logout: '/auth/logout',
    forgotPassword: '/auth/forgot-password',
  },
  dashboard: {
    overview: '/dashboard/overview',
    trends: '/dashboard/trends',
  },
  queues: {
    list: '/queues',
    detail: (id: string | number) => `/queues/${id}`,
    history: (id: string | number) => `/queues/${id}/history`,
  },
  counters: {
    list: '/counters',
    create: '/counters',
    update: (id: string | number) => `/counters/${id}`,
    simulate: '/counters/simulate',
    applyRecommendation: '/counters/apply-recommendation',
  },
  detection: {
    image: '/detection/image',
    history: '/detection/history',
  },
  predictions: {
    waitingTime: '/predictions/waiting-time',
  },
  alerts: {
    list: '/alerts',
    acknowledge: (id: string | number) => `/alerts/${id}/acknowledge`,
    acknowledgeAll: '/alerts/acknowledge-all',
  },
  agent: {
    chat: '/agent/chat',
  },
  analytics: {
    overview: '/analytics/overview',
    peakHours: '/analytics/peak-hours',
    export: '/analytics/export',
  },
  locations: {
    list: '/locations',
    facilities: '/locations/facilities',
  },
};
