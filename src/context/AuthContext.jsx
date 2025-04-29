import React, { createContext, useState, useEffect, useCallback } from 'react';
import AuthAPI from '@api/auth.api';
import { setAuth, clearAuth, getToken, getUser, isAuthenticated } from '@services/auth.service';

// Create the Auth Context
export const AuthContext = createContext({
  isLoggedIn: false,
  user: null,
  loading: false,
  error: null,
  login: () => {},
  logout: () => {},
  clearError: () => {},
});

/**
 * Auth Context Provider component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Auth context provider
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUser());
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load user data on initial render if token exists
  useEffect(() => {
    const initAuth = async () => {
      if (getToken() && !user) {
        setLoading(true);
        try {
          const userData = await AuthAPI.getCurrentUser();
          setUser(userData);
          setIsLoggedIn(true);
        } catch (err) {
          clearAuth();
          setIsLoggedIn(false);
          setUser(null);
          setError('Session expired. Please login again.');
        } finally {
          setLoading(false);
        }
      }
    };

    initAuth();
  }, []);

  /**
   * Login with username and password
   * @param {string} username - User's username
   * @param {string} password - User's password
   */
  const login = useCallback(async (username, password) => {
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
      };
      
      setAuth(token, userData);
      setUser(userData);
      setIsLoggedIn(true);
      
      return userData;
    } catch (err) {
      setError(err.toString());
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout the current user
   */
  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  /**
   * Clear any authentication errors
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Context value
  const contextValue = {
    isLoggedIn,
    user,
    loading,
    error,
    login,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;