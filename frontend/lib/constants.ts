// API and WebSocket URL constants
export const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || '';
export const DEMO_MODE = true;
export const APP_NAME = 'QueueMind AI';

export const ROUTES = {
  HOME: '/',
  LANDING: '/landing',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  DASHBOARD: '/dashboard',
  OVERVIEW: '/dashboard/overview',
  MONITOR: '/dashboard/monitor',
  DETECTION: '/dashboard/detection',
  PREDICTIONS: '/dashboard/predictions',
  ANALYTICS: '/dashboard/analytics',
  COUNTERS: '/dashboard/counters',
  SIMULATOR: '/dashboard/simulator',
  LOCATIONS: '/dashboard/locations',
  AGENT: '/dashboard/agent',
  ALERTS: '/dashboard/alerts',
  SETTINGS: '/dashboard/settings',
} as const;

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
