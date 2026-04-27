// src/services/aiInsightService.js
import { apiClient } from './apiClient';
import { USE_MOCK } from '../config/api.js';
import { ai_insights as mockInsights } from '../mock/aiInsights.js';
import { handleMockResponse } from './api.js';

export const aiInsightService = {

  // GET semua insight milik user
  getInsightsByUser: async (userId) => {
    if (!USE_MOCK) {
      const response = await apiClient.get(`/ai-insights?userId=${userId}`);
      return response.data.data || [];
    }

    await handleMockResponse();
    return mockInsights.filter(i => i.user_id === userId);
  },

  // CREATE insight baru (biasanya dipanggil dari backend/AI engine)
  createInsight: async (userId, insightText, type = 'suggestion') => {
    if (!USE_MOCK) {
      const response = await apiClient.post('/ai-insights', {
        user_id: userId,
        insight_text: insightText,
        type
      });
      return response.data.data || response.data;
    }

    await handleMockResponse();

    const newInsight = {
      id: Date.now(),
      user_id: userId,
      insight_text: insightText,
      type,
      created_at: new Date().toISOString()
    };

    const stored = JSON.parse(localStorage.getItem('ai_insights')) || [];
    localStorage.setItem('ai_insights', JSON.stringify([...stored, newInsight]));

    return newInsight;
  }
};
