/**
 * Secure storage service for persisting data to local/session storage
 */

// Constants for storage keys
const STORAGE_KEYS = {
    TOKEN: 'edhumeni_token',
    USER: 'edhumeni_user',
    PREFERENCES: 'edhumeni_preferences',
    LAST_VISITED: 'edhumeni_last_visited',
  };
  
  // Storage types
  const STORAGE_TYPES = {
    LOCAL: 'localStorage',
    SESSION: 'sessionStorage',
  };
  
  /**
   * Set an item in the specified storage
   *
   * @param {string} key - The key to store the data under
   * @param {any} value - The data to store (will be JSON stringified)
   * @param {string} storageType - The type of storage to use (local or session)
   */
  export const setItem = (key, value, storageType = STORAGE_TYPES.LOCAL) => {
    try {
      const storage = storageType === STORAGE_TYPES.SESSION ? sessionStorage : localStorage;
      const serializedValue = JSON.stringify(value);
      storage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Error setting storage item:', error);
    }
  };
  
  /**
   * Get an item from the specified storage
   *
   * @param {string} key - The key to retrieve data from
   * @param {string} storageType - The type of storage to use (local or session)
   * @returns {any|null} The retrieved data (JSON parsed) or null if not found/error
   */
  export const getItem = (key, storageType = STORAGE_TYPES.LOCAL) => {
    try {
      const storage = storageType === STORAGE_TYPES.SESSION ? sessionStorage : localStorage;
      const serializedValue = storage.getItem(key);
      if (serializedValue === null) {
        return null;
      }
      return JSON.parse(serializedValue);
    } catch (error) {
      console.error('Error getting storage item:', error);
      return null;
    }
  };
  
  /**
   * Remove an item from the specified storage
   *
   * @param {string} key - The key to remove
   * @param {string} storageType - The type of storage to use (local or session)
   */
  export const removeItem = (key, storageType = STORAGE_TYPES.LOCAL) => {
    try {
      const storage = storageType === STORAGE_TYPES.SESSION ? sessionStorage : localStorage;
      storage.removeItem(key);
    } catch (error) {
      console.error('Error removing storage item:', error);
    }
  };
  
  /**
   * Clear all items from the specified storage
   *
   * @param {string} storageType - The type of storage to use (local or session)
   */
  export const clearStorage = (storageType = STORAGE_TYPES.LOCAL) => {
    try {
      const storage = storageType === STORAGE_TYPES.SESSION ? sessionStorage : localStorage;
      storage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  };
  
  // Authentication-specific storage helpers
  export const saveToken = (token) => setItem(STORAGE_KEYS.TOKEN, token);
  export const getToken = () => getItem(STORAGE_KEYS.TOKEN);
  export const removeToken = () => removeItem(STORAGE_KEYS.TOKEN);
  
  export const saveUser = (user) => setItem(STORAGE_KEYS.USER, user);
  export const getUser = () => getItem(STORAGE_KEYS.USER);
  export const removeUser = () => removeItem(STORAGE_KEYS.USER);
  
  // User preferences storage
  export const savePreferences = (preferences) => setItem(STORAGE_KEYS.PREFERENCES, preferences);
  export const getPreferences = () => getItem(STORAGE_KEYS.PREFERENCES) || {};
  export const updatePreferences = (newPreferences) => {
    const currentPreferences = getPreferences();
    savePreferences({ ...currentPreferences, ...newPreferences });
    return { ...currentPreferences, ...newPreferences };
  };
  
  // Navigation history
  export const saveLastVisited = (path) => setItem(STORAGE_KEYS.LAST_VISITED, { path, timestamp: Date.now() });
  export const getLastVisited = () => getItem(STORAGE_KEYS.LAST_VISITED);
  
  export default {
    setItem,
    getItem,
    removeItem,
    clearStorage,
    saveToken,
    getToken,
    removeToken,
    saveUser,
    getUser,
    removeUser,
    savePreferences,
    getPreferences,
    updatePreferences,
    saveLastVisited,
    getLastVisited,
    STORAGE_KEYS,
    STORAGE_TYPES,
  };