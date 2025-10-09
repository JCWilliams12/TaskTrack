import axios from 'axios';

// Use relative URL for production (same domain) or absolute URL for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const isProduction = import.meta.env.PROD;

const axiosInstance = axios.create({
  baseURL: isProduction ? '/api' : `${API_URL}/api`,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers['Authorization'] = `Bearer ${token}`;
    console.log('Request with token:', config.url);
  } else {
    console.log('Request without token:', config.url);
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response success:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.log('Response error:', error.config?.url, error.response?.status, error.message);
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      console.log('Auth error detected, clearing token');
      // Clear token and authorization header
      localStorage.removeItem('token');
      delete axiosInstance.defaults.headers.common['Authorization'];
      
      // Dispatch custom event for token expiration
      window.dispatchEvent(new CustomEvent('tokenExpired'));
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
