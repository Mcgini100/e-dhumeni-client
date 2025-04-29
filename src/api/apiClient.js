import axios from 'axios';
import { getToken, clearAuth } from '@services/auth.service';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // Avoid infinite retry loops
      if (originalRequest.url === '/auth/login') {
        return Promise.reject(error);
      }
      
      // Clear authentication and redirect to login
      clearAuth();
      window.location.href = '/login';
      return Promise.reject(new Error('Session expired. Please login again.'));
    }
    
    // Handle 403 Forbidden errors (insufficient permissions)
    if (error.response && error.response.status === 403) {
      return Promise.reject(new Error('You do not have permission to perform this action.'));
    }
    
    // Handle 404 Not Found errors
    if (error.response && error.response.status === 404) {
      return Promise.reject(new Error('Resource not found.'));
    }
    
    // Handle 500 and other server errors
    if (error.response && error.response.status >= 500) {
      return Promise.reject(new Error('Server error. Please try again later.'));
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;