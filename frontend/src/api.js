import axios from 'axios';

// API Configuration
// Hardcoded for production deployment
const API_BASE_URL = 'https://stockncrypto.onrender.com/api';

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
