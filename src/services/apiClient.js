// src/services/apiClient.js
import axios from 'axios';
import { USE_MOCK, API_BASE_URL, API_TIMEOUT } from '../config/api.js';

const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

// ==================== REAL CLIENT (Axios) ====================
const realClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
realClient.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const token = user?.token || localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
realClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    const errorMessage = error.response?.data?.message 
      || error.message 
      || 'Terjadi kesalahan pada server';

    return Promise.reject(new Error(errorMessage));
  }
);

// ==================== MOCK CLIENT ====================
const mockClient = {
  get: async (url) => {
    await delay();
    console.log(`[MOCK GET] ${url}`);
    return { data: { success: true, data: null, message: 'Mock GET success' } };
  },

  post: async (url, payload) => {
    await delay();
    console.log(`[MOCK POST] ${url}`, payload);
    return { 
      data: { 
        success: true, 
        data: payload, 
        message: 'Berhasil ditambahkan' 
      } 
    };
  },

  put: async (url, payload) => {
    await delay();
    console.log(`[MOCK PUT] ${url}`, payload);
    return { 
      data: { 
        success: true, 
        data: payload, 
        message: 'Berhasil diperbarui' 
      } 
    };
  },

  delete: async (url) => {
    await delay();
    console.log(`[MOCK DELETE] ${url}`);
    return { 
      data: { 
        success: true, 
        message: 'Berhasil dihapus' 
      } 
    };
  },
};

export const apiClient = USE_MOCK ? mockClient : realClient;

export default apiClient;