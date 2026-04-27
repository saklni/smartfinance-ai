// src/services/transactionService.js
import { apiClient } from './apiClient';
import { USE_MOCK } from '../config/api.js';
import { transactions as mockTransactions } from '../mock/transactions.js';
import { handleMockResponse } from './api.js';

export const transactionService = {

  // GET semua transaksi user (mock + localStorage)
  getTransactionsByUser: async (userId) => {
    if (!USE_MOCK) {
      const response = await apiClient.get(`/transactions?userId=${userId}`);
      return response.data.data || response.data || [];
    }

    await handleMockResponse();

    // Gabungkan mock + localStorage agar transaksi baru ikut muncul
    const stored = JSON.parse(localStorage.getItem('transactions')) || [];
    const allTransactions = [...mockTransactions, ...stored];
    return allTransactions
      .filter(t => t.user_id === userId)
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // terbaru dulu
  },

  // CREATE transaksi baru
  // category_id di ERD adalah NN — validasi dilakukan di UI sebelum memanggil ini
  createTransaction: async (transactionData) => {
    if (!USE_MOCK) {
      const response = await apiClient.post('/transactions', transactionData);
      return response.data.data || response.data;
    }

    await handleMockResponse();

    const newTransaction = {
      id: Date.now(),
      ...transactionData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const stored = JSON.parse(localStorage.getItem('transactions')) || [];
    localStorage.setItem('transactions', JSON.stringify([...stored, newTransaction]));

    return newTransaction;
  },

  // DELETE transaksi
  deleteTransaction: async (transactionId) => {
    if (!USE_MOCK) {
      const response = await apiClient.delete(`/transactions/${transactionId}`);
      return response.data;
    }

    await handleMockResponse();

    const stored = JSON.parse(localStorage.getItem('transactions')) || [];
    const updated = stored.filter(t => t.id !== transactionId);
    localStorage.setItem('transactions', JSON.stringify(updated));

    return { success: true };
  },

  // GET summary (income, expense, balance)
  getSummary: async (userId) => {
    if (!USE_MOCK) {
      const response = await apiClient.get(`/transactions/summary?userId=${userId}`);
      return response.data.data || { totalIncome: 0, totalExpense: 0, balance: 0 };
    }

    await handleMockResponse();

    // Hitung dari gabungan mock + localStorage
    const stored = JSON.parse(localStorage.getItem('transactions')) || [];
    const allTransactions = [...mockTransactions, ...stored];
    const userTransactions = allTransactions.filter(t => t.user_id === userId);

    const totalIncome = userTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = userTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense
    };
  }
};
