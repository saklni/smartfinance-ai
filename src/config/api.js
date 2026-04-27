// src/config/api.js
export const USE_MOCK = true;           // Ubah ke false saat backend Express siap
export const MOCK_DELAY = 400;          // ms

// Base URL backend Express (sesuaikan dengan port kamu)
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_TIMEOUT = 10000;

// Response structure yang akan kita pakai di seluruh app
export const API_RESPONSE = {
  SUCCESS: 'success',
  ERROR: 'error'
};