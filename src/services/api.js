// src/services/api.js
import { USE_MOCK, MOCK_DELAY } from '../config/api.js';

export const delay = (ms = MOCK_DELAY) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Response structure yang konsisten antara mock dan real API
export const handleMockResponse = async (data = null, message = "Berhasil") => {
  await delay();
  return { 
    success: true, 
    data, 
    message 
  };
};

export const handleMockError = (message = "Terjadi kesalahan pada mock API") => {
  throw new Error(message);
};

// Export USE_MOCK
export { USE_MOCK };