import axios from 'axios';
import { 
  getToken, 
  getRefreshToken, 
  clearAuth, 
  setNewToken, 
  isTokenExpiringSoon 
} from '@services/auth.service';

// Create API client instance
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
// Store failed requests to retry after token refresh
let failedQueue = [];

// Process the failed queue
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor for API calls
apiClient.interceptors.request.use(
  async (config) => {
    const token = getToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      
      // Check if token is about to expire and needs refreshing
      if (isTokenExpiringSoon() && !isRefreshing && config.url !== '/auth/refresh-token') {
        isRefreshing = true;
        
        try {
          const refreshToken = getRefreshToken();
          
          if (refreshToken) {
            const response = await axios.post('/api/auth/refresh-token', {
              refreshToken
            });
            
            const { token: newToken, expiresIn } = response.data;
            
            // Update the token
            setNewToken(newToken, expiresIn);
            
            // Update the Authorization header with new token
            config.headers.Authorization = `Bearer ${newToken}`;
            
            // Process queued requests
            processQueue(null, newToken);
          }
        } catch (error) {
          // Handle refresh token error
          processQueue(error, null);
          
          // If refresh fails, log out the user
          clearAuth();
          window.location.href = '/login';
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      }
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
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // Avoid infinite retry loops for login and refresh token endpoints
      if (originalRequest.url === '/auth/login' || originalRequest.url === '/auth/refresh-token') {
        return Promise.reject(error);
      }
      
      // If already refreshing, add to queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        const refreshToken = getRefreshToken();
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await axios.post('/api/auth/refresh-token', {
          refreshToken
        });
        
        const { token: newToken, expiresIn } = response.data;
        
        // Update the token
        setNewToken(newToken, expiresIn);
        
        // Update the Authorization header with new token
        apiClient.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        // Process queued requests
        processQueue(null, newToken);
        
        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Handle refresh token error
        processQueue(refreshError, null);
        
        // If refresh fails, log out the user
        clearAuth();
        
        // Don't redirect if it's an API call from the login page
        if (!originalRequest.url.includes('/auth/login')) {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // Handle 403 Forbidden errors (insufficient permissions)
    if (error.response && error.response.status === 403) {
      // You could dispatch an action to show a permission denied message
      console.error('Permission denied:', error.response.data);
    }
    
    // Handle 404 Not Found errors
    if (error.response && error.response.status === 404) {
      console.error('Resource not found:', error.response.data);
    }
    
    // Handle 500 and other server errors
    if (error.response && error.response.status >= 500) {
      console.error('Server error:', error.response.data);
    }
    
    // Handle network errors
    if (error.message === 'Network Error') {
      console.error('Network error - check your connection');
    }
    
    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - the server took too long to respond');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;