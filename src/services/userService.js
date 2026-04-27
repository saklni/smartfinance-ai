// src/services/userService.js
import { apiClient } from './apiClient';
import { USE_MOCK } from '../config/api.js';
import { handleMockResponse } from './api.js';
import { users as mockUsers } from '../mock/users.js';
import { userPreferenceService } from './userPreferenceService.js';

export const userService = {

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Update hanya field yang ada di tabel users (sesuai ERD)
  updateUser: async (updatedData) => {
    // Pisahkan field users vs user_preferences
    const {
      monthlyIncome,
      mainExpense,
      financialGoal,
      aiEnabled,
      ...userFields
    } = updatedData;

    const currentUser = userService.getCurrentUser();
    if (!currentUser) throw new Error('User not logged in');

    // ── Update tabel users ──────────────────────────────────
    if (!USE_MOCK) {
      const response = await apiClient.put('/users/me', userFields);
      const updatedUser = response.data.data || response.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Simpan preferensi onboarding ke tabel terpisah
      if (monthlyIncome !== undefined || mainExpense !== undefined) {
        await userPreferenceService.savePreference(currentUser.id, {
          monthly_income: monthlyIncome,
          main_expense: mainExpense,
          financial_goal: financialGoal,
          ai_enabled: aiEnabled
        });
      }

      return updatedUser;
    }

    // ── MOCK MODE ───────────────────────────────────────────
    await handleMockResponse();

    const newUserData = {
      ...currentUser,
      ...userFields,
      updated_at: new Date().toISOString()
    };

    localStorage.setItem('user', JSON.stringify(newUserData));

    // Simpan field onboarding ke user_preferences (sesuai ERD)
    if (monthlyIncome !== undefined || mainExpense !== undefined) {
      await userPreferenceService.savePreference(currentUser.id, {
        monthly_income: monthlyIncome,
        main_expense: mainExpense,
        financial_goal: financialGoal,
        ai_enabled: aiEnabled
      });
    }

    return newUserData;
  },

  getAllUsers: async () => {
    if (!USE_MOCK) {
      const response = await apiClient.get('/users');
      return response.data.data || [];
    }

    await handleMockResponse();
    const storedUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    return [...mockUsers, ...storedUsers];
  }
};
