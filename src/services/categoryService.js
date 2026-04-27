// src/services/categoryService.js
import { apiClient } from './apiClient';
import { USE_MOCK } from '../config/api.js';
import { categories as mockCategories } from '../mock/categories.js';
import { handleMockResponse } from './api.js';

export const categoryService = {

  getCategoriesByUser: async (userId) => {
    if (!USE_MOCK) {
      const response = await apiClient.get(`/categories?userId=${userId}`);
      return response.data.data || [];
    }

    await handleMockResponse();

    // Gabungkan mock + localStorage agar data baru ikut muncul
    const stored = JSON.parse(localStorage.getItem('categories')) || [];
    const allCategories = [...mockCategories, ...stored];
    return allCategories.filter(cat => cat.user_id === userId);
  },

  createCategory: async (userId, name, type) => {
    if (!USE_MOCK) {
      const response = await apiClient.post('/categories', { userId, name, type });
      return response.data.data || response.data;
    }

    await handleMockResponse();

    const newCategory = {
      id: Date.now(),
      user_id: userId,
      name,
      type,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const stored = JSON.parse(localStorage.getItem('categories')) || [];
    localStorage.setItem('categories', JSON.stringify([...stored, newCategory]));

    return newCategory;
  }
};
