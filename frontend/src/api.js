import axios from 'axios';

// API Configuration
// For production, use the Render backend URL directly if the Vercel proxy is not configured
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://stockncrypto.onrender.com/api';

// Create axios instance with base URL for production
const api = axios.create({
    baseURL: API_BASE_URL
});

// Add request interceptor to include auth token
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

export default api;
