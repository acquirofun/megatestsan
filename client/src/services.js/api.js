// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

const TaskService = {
  // Get tasks by type
  async getTasks(type) {
    try {
      const response = await api.get(`/api/tasks/${type}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add new task
  async addTask(type, taskData) {
    try {
      const response = await api.post(`/api/tasks/${type}`, taskData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Edit task
  async editTask(type, id, taskData) {
    try {
      const response = await api.put(`/api/tasks/${type}/${id}`, taskData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete task
  async deleteTask(type, id) {
    try {
      const response = await api.delete(`/api/tasks/${type}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default TaskService;