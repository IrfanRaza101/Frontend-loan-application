import axios from 'axios';

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL_PRODUCTION || import.meta.env.VITE_API_URL || 'https://backend-loan-application.vercel.app';

// Create axios instance with default config
const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminService = {
  // Get dashboard stats
  getStats: async () => {
    try {
      const response = await api.get('/admin/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      throw error;
    }
  },

  // Get all loan applications
  getLoans: async (params = {}) => {
    try {
      const response = await api.get('/admin/loans', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching loans:', error);
      throw error;
    }
  },

  // Update loan status
  updateLoanStatus: async (loanId, status) => {
    try {
      const response = await api.put(`/admin/loans/${loanId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating loan status:', error);
      throw error;
    }
  },

  // Get all users
  getUsers: async (params = {}) => {
    try {
      const response = await api.get('/admin/users', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Update user status
  updateUserStatus: async (userId, status) => {
    try {
      const response = await api.put(`/admin/users/${userId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Get analytics data
  getAnalytics: async () => {
    try {
      const response = await api.get('/admin/analytics');
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  },

  // Generate reports
  generateReport: async (type, params = {}) => {
    try {
      const response = await api.get(`/admin/reports/${type}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  },
};

export default adminService;