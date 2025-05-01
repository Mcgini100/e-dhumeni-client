import apiClient from './apiClient';
import { handleApiError } from '../utils/errorHandlers';

/**
 * Enhanced Authentication API service
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
      throw handleApiError(error, 'Login', 'Invalid username or password');
    }
  },

  /**
   * Refresh authentication token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise} Promise with new token data
   */
  refreshToken: async (refreshToken) => {
    try {
      const response = await apiClient.post('/auth/refresh-token', { refreshToken });
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Token Refresh', 'Failed to refresh authentication token');
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
      throw handleApiError(error, 'Get User Profile', 'Failed to fetch user profile');
    }
  },

  /**
   * Update user profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} Promise with updated user data
   */
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Update Profile', 'Failed to update user profile');
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
      throw handleApiError(error, 'Change Password', 'Failed to change password');
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
      throw handleApiError(error, 'Password Reset Request', 'Failed to request password reset');
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
      throw handleApiError(error, 'Password Reset', 'Failed to reset password');
    }
  },

  /**
   * Verify password reset token
   * @param {string} token - Reset token to verify
   * @returns {Promise} Promise with token validity
   */
  verifyResetToken: async (token) => {
    try {
      const response = await apiClient.get(`/auth/verify-reset-token/${token}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Token Verification', 'Invalid or expired reset token');
    }
  },

  /**
   * Logout user (if using server-side logout)
   * @returns {Promise} Promise with logout confirmation
   */
  logout: async () => {
    try {
      const response = await apiClient.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Logout', 'Failed to logout properly');
    }
  }
};

export default AuthAPI;