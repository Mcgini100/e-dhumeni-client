// Constants for local storage keys
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

/**
 * Store authentication data in local storage
 * @param {string} token - JWT token
 * @param {Object} user - User data
 */
export const setAuth = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Clear authentication data from local storage
 */
export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Get the JWT token from local storage
 * @returns {string|null} JWT token or null if not found
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Get the authenticated user data from local storage
 * @returns {Object|null} User data or null if not found
 */
export const getUser = () => {
  const userJson = localStorage.getItem(USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

/**
 * Check if the user is authenticated
 * @returns {boolean} True if the user is authenticated
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Check if the user has a specific role
 * @param {string} role - Role to check
 * @returns {boolean} True if the user has the role
 */
export const hasRole = (role) => {
  const user = getUser();
  return user && user.roles && user.roles.includes(role);
};

/**
 * Update user data in local storage
 * @param {Object} userData - Updated user data
 */
export const updateUserData = (userData) => {
  const currentUser = getUser();
  if (currentUser) {
    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  }
};