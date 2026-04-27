// src/services/userPreferenceService.js
import { apiClient } from './apiClient';
import { USE_MOCK } from '../config/api.js';
import { userPreferences as mockPreferences } from '../mock/userPreferences.js';
import { handleMockResponse } from './api.js';

export const userPreferenceService = {

  // GET preferensi user
  getPreferenceByUser: async (userId) => {
    if (!USE_MOCK) {
      const response = await apiClient.get(`/user-preferences/${userId}`);
      return response.data.data || null;
    }

    await handleMockResponse();

    // Cek localStorage dulu (data dari onboarding baru)
    const stored = JSON.parse(localStorage.getItem('user_preferences')) || [];
    const fromStorage = stored.find(p => p.user_id === userId);
    if (fromStorage) return fromStorage;

    // Fallback ke mock
    return mockPreferences.find(p => p.user_id === userId) || null;
  },

  // UPSERT preferensi (create atau update)
  savePreference: async (userId, preferenceData) => {
    if (!USE_MOCK) {
      const response = await apiClient.put(`/user-preferences/${userId}`, preferenceData);
      return response.data.data || response.data;
    }

    await handleMockResponse();

    const stored = JSON.parse(localStorage.getItem('user_preferences')) || [];
    const existingIndex = stored.findIndex(p => p.user_id === userId);

    const newPref = {
      id: existingIndex >= 0 ? stored[existingIndex].id : Date.now(),
      user_id: userId,
      monthly_income: preferenceData.monthly_income ?? 0,
      main_expense: preferenceData.main_expense ?? 'others',
      financial_goal: preferenceData.financial_goal ?? 'others',
      ai_enabled: preferenceData.ai_enabled ?? true,
      created_at: existingIndex >= 0
        ? stored[existingIndex].created_at
        : new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      stored[existingIndex] = newPref;
    } else {
      stored.push(newPref);
    }

    localStorage.setItem('user_preferences', JSON.stringify(stored));
    return newPref;
  }
};
