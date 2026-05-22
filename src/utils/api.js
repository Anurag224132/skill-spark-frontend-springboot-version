import axios from 'axios';
import { toast } from 'react-hot-toast';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || process.env.REACT_APP_API_BASE_URL,
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors (e.g., unauthorized, forbidden, internal errors)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check if the request configuration explicitly asks to skip global error handling
    const skipGlobal = error.config?.headers?.['X-Skip-Global-Error-Handler'] === 'true' || error.config?.skipGlobalError;

    if (!skipGlobal) {
      const response = error.response;
      const status = response?.status;
      const message = response?.data?.message || response?.data?.error || response?.data?.msg || error.message || 'An unexpected error occurred';

      if (status === 401) {
        // Unauthorized: clear token and redirect
        localStorage.removeItem('token');
        toast.error('Session expired. Please log in again.');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      } else if (status === 403) {
        toast.error('You do not have permission to perform this action.');
      } else if (status === 404) {
        toast.error('Requested resource not found.');
      } else if (status === 500) {
        toast.error('Internal server error. Please try again later.');
      } else if (!response || error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        toast.error('Network error. Please check your internet connection.');
      } else {
        toast.error(message);
      }

      // Mark the error so global handlers (like React Query) know it was already toasted
      error.globalHandled = true;
    }

    return Promise.reject(error);
  }
);

export default api;

