/**
 * Enhanced Authentication service for handling token-based authentication
 */

// Constants for local storage keys
const TOKEN_KEY = 'edhumeni_auth_token';
const USER_KEY = 'edhumeni_auth_user';
const TOKEN_EXPIRY_KEY = 'edhumeni_auth_expiry';
const REFRESH_TOKEN_KEY = 'edhumeni_refresh_token';

/**
 * Store authentication data in local storage or session storage
 * @param {string} token - JWT token
 * @param {Object} user - User data
 * @param {boolean} rememberMe - Whether to store in local storage (persistent)
 * @param {number} expiresIn - Token expiration time in seconds (default 24 hours)
 */
export const setAuth = (token, user, rememberMe = false, expiresIn = 86400) => {
  const storage = rememberMe ? localStorage : sessionStorage;
  
  // Calculate expiry timestamp
  const expiryTime = Date.now() + expiresIn * 1000;
  
  storage.setItem(TOKEN_KEY, token);
  storage.setItem(USER_KEY, JSON.stringify(user));
  storage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  
  // If refresh token is included in the response
  if (user.refreshToken) {
    storage.setItem(REFRESH_TOKEN_KEY, user.refreshToken);
  }
};

/**
 * Clear authentication data from storage
 */
export const clearAuth = () => {
  // Clear from both storage types to be safe
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Get the JWT token from storage
 * @returns {string|null} JWT token or null if not found or expired
 */
export const getToken = () => {
  // Try session storage first, then local storage
  let token = sessionStorage.getItem(TOKEN_KEY);
  let expiryTime = sessionStorage.getItem(TOKEN_EXPIRY_KEY);
  
  if (!token) {
    token = localStorage.getItem(TOKEN_KEY);
    expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
  }
  
  if (!token) return null;
  
  // Check if token is expired
  if (expiryTime && parseInt(expiryTime, 10) < Date.now()) {
    clearAuth();
    return null;
  }
  
  return token;
};

/**
 * Get the refresh token from storage
 * @returns {string|null} Refresh token or null if not found
 */
export const getRefreshToken = () => {
  // Try session storage first, then local storage
  let refreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY);
  
  if (!refreshToken) {
    refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  }
  
  return refreshToken;
};

/**
 * Get the authenticated user data from storage
 * @returns {Object|null} User data or null if not found
 */
export const getUser = () => {
  // Try session storage first, then local storage
  let userJson = sessionStorage.getItem(USER_KEY);
  
  if (!userJson) {
    userJson = localStorage.getItem(USER_KEY);
  }
  
  try {
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Check if the user is authenticated
 * @returns {boolean} True if the user is authenticated
 */
export const isAuthenticated = () => {
  return !!getToken() && !!getUser();
};

/**
 * Check if the token is about to expire
 * @param {number} thresholdMinutes - Minutes threshold before expiry (default: 5)
 * @returns {boolean} True if token will expire within the threshold
 */
export const isTokenExpiringSoon = (thresholdMinutes = 5) => {
  // Try session storage first, then local storage
  let expiryTime = sessionStorage.getItem(TOKEN_EXPIRY_KEY);
  
  if (!expiryTime) {
    expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
  }
  
  if (!expiryTime) return false;
  
  const expiryDate = parseInt(expiryTime, 10);
  const thresholdMs = thresholdMinutes * 60 * 1000;
  
  return expiryDate - Date.now() < thresholdMs;
};

/**
 * Update token expiry time
 * @param {number} expiresIn - New expiration time in seconds
 */
export const updateTokenExpiry = (expiresIn = 86400) => {
  const expiryTime = Date.now() + expiresIn * 1000;
  
  // Update in the storage where the token exists
  if (sessionStorage.getItem(TOKEN_KEY)) {
    sessionStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  }
  
  if (localStorage.getItem(TOKEN_KEY)) {
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  }
};

/**
 * Update user data in storage
 * @param {Object} userData - Updated user data
 */
export const updateUserData = (userData) => {
  const user = getUser();
  
  if (user) {
    const updatedUser = { ...user, ...userData };
    
    // Update in the storage where the user exists
    if (sessionStorage.getItem(USER_KEY)) {
      sessionStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    }
    
    if (localStorage.getItem(USER_KEY)) {
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    }
  }
};

/**
 * Check if the user has a specific role
 * @param {string} role - Role to check
 * @returns {boolean} True if the user has the role
 */
export const hasRole = (role) => {
  const user = getUser();
  return user && user.roles && Array.isArray(user.roles) && user.roles.includes(role);
};

/**
 * Set a new token (e.g. after token refresh)
 * @param {string} token - New JWT token
 * @param {number} expiresIn - Token expiration time in seconds
 */
export const setNewToken = (token, expiresIn = 86400) => {
  // Update token in the storage where it exists
  if (sessionStorage.getItem(TOKEN_KEY)) {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(TOKEN_EXPIRY_KEY, (Date.now() + expiresIn * 1000).toString());
  }
  
  if (localStorage.getItem(TOKEN_KEY)) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_EXPIRY_KEY, (Date.now() + expiresIn * 1000).toString());
  }
};

export default {
  setAuth,
  clearAuth,
  getToken,
  getRefreshToken,
  getUser,
  isAuthenticated,
  isTokenExpiringSoon,
  updateTokenExpiry,
  updateUserData,
  hasRole,
  setNewToken,
};