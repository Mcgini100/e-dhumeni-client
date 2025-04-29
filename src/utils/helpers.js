/**
 * General helper utility functions for the application
 */

/**
 * Log an error to the console with additional metadata
 * 
 * @param {Error|Object} error - The error to log
 * @param {string} source - Source of the error
 */
export const logError = (error, source = 'App') => {
    // In production, this could be integrated with an error tracking service
    console.error(`[${source}] Error:`, error);
    
    if (error.response) {
      console.error(`[${source}] Response data:`, error.response.data);
      console.error(`[${source}] Response status:`, error.response.status);
    }
  };
  
  /**
   * Generate a unique ID (for temporary UI elements, not for database)
   * 
   * @returns {string} - A unique ID
   */
  export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };
  
  /**
   * Deep clone an object using structured clone
   * 
   * @param {any} obj - The object to clone
   * @returns {any} - Cloned object
   */
  export const deepClone = (obj) => {
    try {
      return structuredClone(obj);
    } catch (error) {
      // Fallback for older browsers
      return JSON.parse(JSON.stringify(obj));
    }
  };
  
  /**
   * Deep compare two objects for equality
   * 
   * @param {any} obj1 - First object
   * @param {any} obj2 - Second object
   * @returns {boolean} - Whether the objects are equal
   */
  export const deepEqual = (obj1, obj2) => {
    if (obj1 === obj2) return true;
    
    if (
      typeof obj1 !== 'object' ||
      typeof obj2 !== 'object' ||
      obj1 === null ||
      obj2 === null
    ) {
      return false;
    }
    
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    if (keys1.length !== keys2.length) return false;
    
    for (const key of keys1) {
      if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }
    
    return true;
  };
  
  /**
   * Check if a value is empty (null, undefined, empty string, empty array, empty object)
   * 
   * @param {any} value - The value to check
   * @returns {boolean} - Whether the value is empty
   */
  export const isEmpty = (value) => {
    if (value === null || value === undefined) return true;
    
    if (typeof value === 'string') return value.trim() === '';
    
    if (Array.isArray(value)) return value.length === 0;
    
    if (typeof value === 'object') return Object.keys(value).length === 0;
    
    return false;
  };
  
  /**
   * Debounce a function to limit how often it can be called
   * 
   * @param {Function} func - The function to debounce
   * @param {number} wait - Time to wait in milliseconds
   * @returns {Function} - Debounced function
   */
  export const debounce = (func, wait = 300) => {
    let timeout;
    
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    };
  };
  
  /**
   * Throttle a function to limit how often it can be called
   * 
   * @param {Function} func - The function to throttle
   * @param {number} limit - Time limit in milliseconds
   * @returns {Function} - Throttled function
   */
  export const throttle = (func, limit = 300) => {
    let inThrottle;
    
    return function (...args) {
      const context = this;
      
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };
  };
  
  /**
   * Sort array of objects by a specified key
   * 
   * @param {Array} array - Array to sort
   * @param {string} key - Key to sort by
   * @param {string} direction - Sort direction ('asc' or 'desc')
   * @returns {Array} - Sorted array
   */
  export const sortBy = (array, key, direction = 'asc') => {
    const sortedArray = [...array];
    
    return sortedArray.sort((a, b) => {
      let valueA = a[key];
      let valueB = b[key];
      
      // Handle nested keys (e.g., 'user.name')
      if (key.includes('.')) {
        const keys = key.split('.');
        valueA = keys.reduce((obj, k) => obj?.[k], a);
        valueB = keys.reduce((obj, k) => obj?.[k], b);
      }
      
      // Handle null/undefined values
      if (valueA === null || valueA === undefined) return direction === 'asc' ? -1 : 1;
      if (valueB === null || valueB === undefined) return direction === 'asc' ? 1 : -1;
      
      // Handle case-insensitive string comparison
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return direction === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      
      // Handle numeric comparison
      return direction === 'asc' ? valueA - valueB : valueB - valueA;
    });
  };
  
  /**
   * Group array of objects by a specified key
   * 
   * @param {Array} array - Array to group
   * @param {string} key - Key to group by
   * @returns {Object} - Object with groups
   */
  export const groupBy = (array, key) => {
    return array.reduce((result, item) => {
      const groupKey = item[key];
      
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      
      result[groupKey].push(item);
      return result;
    }, {});
  };
  
  /**
   * Filter array of objects by search term across multiple keys
   * 
   * @param {Array} array - Array to filter
   * @param {string} searchTerm - Search term
   * @param {Array} keys - Keys to search in
   * @returns {Array} - Filtered array
   */
  export const searchByTerm = (array, searchTerm, keys) => {
    if (!searchTerm || !keys.length) return array;
    
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    
    return array.filter(item => {
      return keys.some(key => {
        const value = item[key];
        
        if (value === null || value === undefined) return false;
        
        return String(value).toLowerCase().includes(lowerCaseSearchTerm);
      });
    });
  };
  
  /**
   * Convert a query string to an object
   * 
   * @param {string} queryString - Query string to parse
   * @returns {Object} - Parsed query parameters
   */
  export const parseQueryString = (queryString) => {
    if (!queryString || queryString === '?') return {};
    
    const query = queryString.startsWith('?')
      ? queryString.substring(1)
      : queryString;
    
    return query.split('&').reduce((params, param) => {
      const [key, value] = param.split('=');
      if (key) params[decodeURIComponent(key)] = decodeURIComponent(value || '');
      return params;
    }, {});
  };
  
  /**
   * Convert an object to a query string
   * 
   * @param {Object} params - Parameters to stringify
   * @returns {string} - Query string
   */
  export const buildQueryString = (params) => {
    if (!params || Object.keys(params).length === 0) return '';
    
    const query = Object.entries(params)
      .filter(([_, value]) => value !== null && value !== undefined && value !== '')
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    
    return query ? `?${query}` : '';
  };
  
  /**
   * Convert snake_case to camelCase
   * 
   * @param {string} str - String to convert
   * @returns {string} - Converted string
   */
  export const snakeToCamel = (str) => {
    return str.replace(/_([a-z])/g, (match, group) => group.toUpperCase());
  };
  
  /**
   * Convert camelCase to snake_case
   * 
   * @param {string} str - String to convert
   * @returns {string} - Converted string
   */
  export const camelToSnake = (str) => {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  };
  
  /**
   * Convert an object's keys from snake_case to camelCase
   * 
   * @param {Object} obj - Object to convert
   * @returns {Object} - Converted object
   */
  export const objKeysToCamel = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    if (Array.isArray(obj)) {
      return obj.map(item => objKeysToCamel(item));
    }
    
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = snakeToCamel(key);
      result[camelKey] = objKeysToCamel(obj[key]);
      return result;
    }, {});
  };
  
  /**
   * Convert an object's keys from camelCase to snake_case
   * 
   * @param {Object} obj - Object to convert
   * @returns {Object} - Converted object
   */
  export const objKeysToSnake = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    if (Array.isArray(obj)) {
      return obj.map(item => objKeysToSnake(item));
    }
    
    return Object.keys(obj).reduce((result, key) => {
      const snakeKey = camelToSnake(key);
      result[snakeKey] = objKeysToSnake(obj[key]);
      return result;
    }, {});
  };
  
  /**
   * Get nested object properties safely without errors
   * 
   * @param {Object} obj - Object to access
   * @param {string} path - Path to property (e.g. 'user.address.city')
   * @param {any} defaultValue - Default value if path doesn't exist
   * @returns {any} - Property value or default
   */
  export const getNestedValue = (obj, path, defaultValue = undefined) => {
    if (!obj || !path) return defaultValue;
    
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
      if (current === null || current === undefined || typeof current !== 'object') {
        return defaultValue;
      }
      
      current = current[key];
    }
    
    return current === undefined ? defaultValue : current;
  };
  
  /**
   * Set a nested object property safely, creating objects as needed
   * 
   * @param {Object} obj - Object to modify
   * @param {string} path - Path to property (e.g. 'user.address.city')
   * @param {any} value - Value to set
   * @returns {Object} - Modified object
   */
  export const setNestedValue = (obj, path, value) => {
    if (!obj || !path) return obj;
    
    const result = { ...obj };
    const keys = path.split('.');
    let current = result;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      
      current = current[key];
    }
    
    current[keys[keys.length - 1]] = value;
    return result;
  };
  
  /**
   * Remove empty values from an object (null, undefined, empty strings)
   * 
   * @param {Object} obj - Object to clean
   * @returns {Object} - Cleaned object
   */
  export const removeEmptyValues = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    return Object.entries(obj).reduce((result, [key, value]) => {
      if (value === null || value === undefined || value === '') {
        return result;
      }
      
      if (typeof value === 'object' && !Array.isArray(value)) {
        const cleaned = removeEmptyValues(value);
        if (Object.keys(cleaned).length > 0) {
          result[key] = cleaned;
        }
        return result;
      }
      
      result[key] = value;
      return result;
    }, {});
  };
  
  /**
   * Check if a string is a valid JSON
   * 
   * @param {string} str - String to check
   * @returns {boolean} - Whether the string is valid JSON
   */
  export const isValidJSON = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  /**
   * Format a number with commas for thousands
   * 
   * @param {number} num - Number to format
   * @returns {string} - Formatted number
   */
  export const formatNumberWithCommas = (num) => {
    if (num === null || num === undefined) return '';
    
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  
  /**
   * Capitalize the first letter of a string
   * 
   * @param {string} str - String to capitalize
   * @returns {string} - Capitalized string
   */
  export const capitalize = (str) => {
    if (!str) return '';
    
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  
  /**
   * Check if the current environment is production
   * 
   * @returns {boolean} - Whether the environment is production
   */
  export const isProduction = () => {
    return process.env.NODE_ENV === 'production';
  };
  
  /**
   * Check if the current environment is development
   * 
   * @returns {boolean} - Whether the environment is development
   */
  export const isDevelopment = () => {
    return process.env.NODE_ENV === 'development';
  };
  
  /**
   * Wait for a specified time
   * 
   * @param {number} ms - Time to wait in milliseconds
   * @returns {Promise} - Promise that resolves after the wait
   */
  export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };
  
  export default {
    logError,
    generateId,
    deepClone,
    deepEqual,
    isEmpty,
    debounce,
    throttle,
    sortBy,
    groupBy,
    searchByTerm,
    parseQueryString,
    buildQueryString,
    snakeToCamel,
    camelToSnake,
    objKeysToCamel,
    objKeysToSnake,
    getNestedValue,
    setNestedValue,
    removeEmptyValues,
    isValidJSON,
    formatNumberWithCommas,
    capitalize,
    isProduction,
    isDevelopment,
    sleep,
  };