import axios from 'axios';
import { getToken, clearAuth } from '@services/auth.service';

// Use the base URL from import.meta.env (Vite's way of accessing environment variables)
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
    baseURL,
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
    (error) => Promise.reject(error)
);

// Response interceptor for API calls
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized errors (token expired)
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            if (originalRequest.url === '/auth/login') {
                return Promise.reject(error);
            }

            clearAuth();
            window.location.href = '/login';
        }

        // Additional error handling (403, 404, 500, etc.)
        return Promise.reject(error);
    }
);

export default apiClient;