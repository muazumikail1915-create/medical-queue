import axios from 'axios';
import { useToastStore } from '../store/useToastStore';

export const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach Bearer token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('medqueue_token') || 'mock-jwt-token-12345';
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';

    if (status === 401) {
      useToastStore.getState().addToast({
        type: 'error',
        title: 'Session Expired',
        message: 'Please sign in again to continue.',
      });
    } else if (status === 403) {
      useToastStore.getState().addToast({
        type: 'error',
        title: 'Access Denied',
        message: 'You do not have permission to perform this action.',
      });
    } else if (status >= 500) {
      useToastStore.getState().addToast({
        type: 'error',
        title: 'Server Error',
        message: 'Hospital server temporarily unavailable. Retry shortly.',
      });
    } else if (error.code === 'ECONNABORTED' || error.message.includes('Network Error')) {
      useToastStore.getState().addToast({
        type: 'warning',
        title: 'Network Timeout',
        message: 'Check your internet connection and try again.',
      });
    }

    return Promise.reject(error);
  }
);
