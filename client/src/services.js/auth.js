// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

const UserService = {
  // Fetch settings
  async getSettings() {
    try {
      const response = await api.get('/api/codec-settings', {
        withCredentials: false // Override for this specific request
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Authenticate user
  async authenticateUser(userData) {
    try {
      const response = await api.post('/api/telegram/auth', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update user stats
  async updateUserStats(telegramId, updates) {
    try {
      const response = await api.put('/api/telegram/user/update', {
        telegramId,
        updates
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Fetch referrals
  async getReferrals(telegramId) {
    try {
      const response = await api.get(`/api/user/referrals/${telegramId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Fetch tasks
  async getTasks() {
    try {
      const response = await api.get('/api/tasks');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default UserService;