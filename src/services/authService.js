// src/services/authService.js
import { apiClient } from './apiClient';
import { USE_MOCK } from '../config/api.js';
import { users as mockUsers } from '../mock/users.js';
import { roles as mockRoles } from '../mock/roles.js';

export const authService = {

  login: async (email, password) => {
    if (!USE_MOCK) {
      const response = await apiClient.post('/auth/login', { email, password });
      const userData = response.data.data || response.data;

      // Simpan ke localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      if (userData.token) {
        localStorage.setItem('token', userData.token);
      }

      return userData;
    }

    // ==================== MOCK MODE ====================
    const storedUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const allUsers = [...mockUsers, ...storedUsers];

    let foundUser = allUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!foundUser) {
      throw new Error("Invalid email or password. Please try again.");
    }

    if (foundUser.onboarding_completed === undefined) {
      foundUser = { ...foundUser, onboarding_completed: false };
    }

    const role = mockRoles.find((r) => r.id === foundUser.role_id);

    const userToSave = {
      ...foundUser,
      role: role?.name || "user",
      token: `mock-jwt-token-${Date.now()}`   // simulasi token
    };

    localStorage.setItem("user", JSON.stringify(userToSave));
    return userToSave;
  },

  register: async (email, password) => {
    if (!USE_MOCK) {
      const response = await apiClient.post('/auth/register', { email, password });
      return response.data;
    }

    // ==================== MOCK MODE ====================
    const storedUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const allUsers = [...mockUsers, ...storedUsers];

    const emailExists = allUsers.some(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (emailExists) {
      throw new Error("Email already registered.");
    }

    const newUser = {
      id: Date.now(),
      name: email.split("@")[0],
      email: email.trim(),
      password,
      role_id: 2,
      onboarding_completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem(
      "registeredUsers",
      JSON.stringify([...storedUsers, newUser])
    );

    return { 
      success: true, 
      message: "Account created successfully!" 
    };
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }
};