import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
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

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response) {
      // Handle different error status codes
      switch (response.status) {
        case 401:
          // Only clear token and redirect if not on login page
          if (!window.location.pathname.includes('/login')) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            toast.error('Session expired. Please login again.');
          }
          break;
        case 403:
          // Forbidden
          toast.error('You do not have permission to perform this action.');
          break;
        case 404:
          // Not found
          toast.error('Resource not found.');
          break;
        case 422:
          // Validation error
          if (response.data?.detail) {
            const errors = response.data.detail;
            if (Array.isArray(errors)) {
              errors.forEach((err) => {
                toast.error(`${err.loc.join('.')}: ${err.msg}`);
              });
            } else {
              toast.error(errors);
            }
          } else {
            toast.error('Validation error. Please check your input.');
          }
          break;
        case 500:
          // Server error - don't show toast for these on dashboard to avoid spamming
          if (!window.location.pathname.includes('/')) {
            toast.error('Server error. Please try again later.');
          }
          break;
        default:
          // Other errors
          toast.error(response.data?.message || 'Something went wrong.');
      }
    } else {
      // Network error
      toast.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);