import axios from 'axios';
import { storage } from '../utils/storage';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 15000,
});

// Request interceptor to attach JWT Token
axiosClient.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and 401
axiosClient.interceptors.response.use(
  (response) => {
    // Backend returns { success, message, data, ... } or raw json
    return response.data;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Auto clear auth if unauthorized
      storage.clearAuth();
    }
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Đã có lỗi xảy ra. Vui lòng thử lại!';
    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
