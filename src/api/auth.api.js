import apiClient from './apiClient';

/**
 * Authentication API service
 */
const AuthAPI = {
  /**
   * Login with username and password
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @returns {Promise} Promise with login response
   */
  login: async (username, password) => {
    try {
      const response = await apiClient.post('/auth/login', { username, password });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed. Please check your credentials.';
    }
  },

  /**
   * Get current user profile
   * @returns {Promise} Promise with user profile data
   */
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to get user profile.';
    }
  },

  /**
   * Change password
   * @param {string} oldPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise} Promise with response
   */
  changePassword: async (oldPassword, newPassword) => {
    try {
      const response = await apiClient.post('/auth/change-password', {
        oldPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to change password.';
    }
  },

  /**
   * Request password reset
   * @param {string} email - User's email
   * @returns {Promise} Promise with response
   */
  requestPasswordReset: async (email) => {
    try {
      const response = await apiClient.post('/auth/request-reset', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to request password reset.';
    }
  },

  /**
   * Reset password with token
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise} Promise with response
   */
  resetPassword: async (token, newPassword) => {
    try {
      const response = await apiClient.post('/auth/reset-password', {
        token,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to reset password.';
    }
  },
};

export default AuthAPI;