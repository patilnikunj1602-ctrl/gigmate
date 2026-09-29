import axios from 'axios';

// Use proxy or environment variable
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gigmate_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // 401 Unauthorized: token expired or invalid
      if (error.response.status === 401) {
        // Only trigger logout if not already on the login or register endpoint
        const isAuthEndpoint = error.config.url?.includes('/auth/');
        if (!isAuthEndpoint) {
          localStorage.removeItem('gigmate_token');
          localStorage.removeItem('gigmate_user');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login?expired=true';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
