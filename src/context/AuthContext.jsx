import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import AuthAPI from '@api/auth.api';
import { 
  setAuth, 
  clearAuth, 
  getToken, 
  getUser, 
  isAuthenticated, 
  updateUserData,
  hasRole
} from '@services/auth.service';
import { useNavigate } from 'react-router-dom';
import { showError, showSuccess } from '@services/notification.service';

// Create the Auth Context with default values
export const AuthContext = createContext({
  isLoggedIn: false,
  user: null,
  loading: false,
  error: null,
  login: () => {},
  logout: () => {},
  clearError: () => {},
  updateProfile: () => {},
  changePassword: () => {},
  checkRole: () => false,
  isAdmin: () => false,
  isManager: () => false,
  isAEO: () => false
});

/**
 * Enhanced Auth Context Provider component
 * Manages authentication state and provides auth-related functions
 * @param {Object} props - Component props
 * @returns {JSX.Element} Auth context provider
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUser());
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Load user data on initial render if token exists
  useEffect(() => {
    const initAuth = async () => {
      if (getToken()) {
        setLoading(true);
        try {
          const response = await AuthAPI.getCurrentUser();
          setUser(response);
          setIsLoggedIn(true);
        } catch (err) {
          // Token is invalid or expired
          clearAuth();
          setIsLoggedIn(false);
          setUser(null);
          setError('Session expired. Please login again.');
        } finally {
          setLoading(false);
          setAuthChecked(true);
        }
      } else {
        setAuthChecked(true);
      }
    };

    initAuth();
    
    // Set up token expiration check
    const tokenCheckInterval = setInterval(() => {
      const token = getToken();
      if (token) {
        // Check if token is expired
        try {
          // This would normally check token expiration
          // If expired, log out the user
          const user = getUser();
          if (!user) {
            clearAuth();
            setIsLoggedIn(false);
            setUser(null);
          }
        } catch (err) {
          // Token is invalid, log out
          clearAuth();
          setIsLoggedIn(false);
          setUser(null);
        }
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(tokenCheckInterval);
  }, []);

  /**
   * Login with username and password
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @param {boolean} rememberMe - Whether to remember the user
   * @returns {Promise} - Promise with user data
   */
  const login = useCallback(async (username, password, rememberMe = false) => {
    setLoading(true);
    setError(null);

    try {
      const response = await AuthAPI.login(username, password);
      const { token, userId, username: username_, email, fullName, roles } = response;
      
      const userData = {
        id: userId,
        username: username_,
        email,
        fullName,
        roles,
        rememberMe
      };
      
      setAuth(token, userData, rememberMe);
      setUser(userData);
      setIsLoggedIn(true);
      
      return userData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Invalid username or password';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout the current user
   * @param {boolean} redirectToLogin - Whether to redirect to login page after logout
   */
  const logout = useCallback(() => {
    // Could call a logout API endpoint here if needed
    clearAuth();
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  /**
   * Update user profile information
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} - Promise with updated user data
   */
  const updateProfile = useCallback(async (profileData) => {
    setLoading(true);
    try {
      // Call API to update profile
      const response = await AuthAPI.updateProfile(profileData);
      
      // Update stored user data
      const updatedUser = {
        ...user,
        ...response.data
      };
      
      updateUserData(updatedUser);
      setUser(updatedUser);
      
      showSuccess('Profile updated successfully');
      return updatedUser;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update profile';
      setError(errorMessage);
      showError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Change user password
   * @param {string} oldPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise} - Promise with success status
   */
  const changePassword = useCallback(async (oldPassword, newPassword) => {
    setLoading(true);
    try {
      await AuthAPI.changePassword(oldPassword, newPassword);
      showSuccess('Password changed successfully');
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to change password';
      setError(errorMessage);
      showError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear any authentication errors
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Check if user has a specific role
   * @param {string} role - Role to check
   * @returns {boolean} - Whether user has the role
   */
  const checkRole = useCallback((role) => {
    return hasRole(role);
  }, []);

  /**
   * Check if user is an admin
   * @returns {boolean} - Whether user is an admin
   */
  const isAdmin = useCallback(() => {
    return checkRole('ADMIN');
  }, [checkRole]);

  /**
   * Check if user is a manager
   * @returns {boolean} - Whether user is a manager
   */
  const isManager = useCallback(() => {
    return checkRole('MANAGER');
  }, [checkRole]);

  /**
   * Check if user is an Agricultural Extension Officer
   * @returns {boolean} - Whether user is an AEO
   */
  const isAEO = useCallback(() => {
    return checkRole('AEO');
  }, [checkRole]);

  /**
   * Check if user is a basic user
   * @returns {boolean} - Whether user is a basic user
   */
  const isUser = useCallback(() => {
    return checkRole('USER');
  }, [checkRole]);
  
  // Create memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    isLoggedIn,
    user,
    loading,
    error,
    authChecked,
    login,
    logout,
    clearError,
    updateProfile,
    changePassword,
    checkRole,
    isAdmin,
    isManager,
    isAEO,
    isUser
  }), [
    isLoggedIn,
    user,
    loading,
    error,
    authChecked,
    login,
    logout,
    clearError,
    updateProfile,
    changePassword,
    checkRole,
    isAdmin,
    isManager,
    isAEO,
    isUser
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook for accessing the auth context
 * @returns {Object} The auth context value
 */
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;