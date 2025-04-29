/**
 * Error handling utilities for the application
 */

import { logError } from './helpers';

/**
 * Map of common HTTP status codes to user-friendly messages
 */
export const HTTP_ERROR_MESSAGES = {
  400: 'The request was invalid. Please check your input and try again.',
  401: 'Authentication required. Please log in to continue.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  405: 'This action is not supported.',
  408: 'The request timed out. Please try again.',
  409: 'This operation could not be completed due to a conflict.',
  422: 'The submitted data was invalid. Please check your input and try again.',
  429: 'Too many requests. Please try again later.',
  500: 'An unexpected server error occurred. Please try again later.',
  502: 'The server is temporarily unavailable. Please try again later.',
  503: 'The service is unavailable. Please try again later.',
  504: 'The server took too long to respond. Please try again later.',
};

/**
 * Get a user-friendly error message based on an error object
 * 
 * @param {Error|Object} error - The error object
 * @param {string} fallbackMessage - Fallback message if no specific message is found
 * @returns {string} - User-friendly error message
 */
export const getUserFriendlyErrorMessage = (error, fallbackMessage = 'An unexpected error occurred.') => {
  // If there's a specific error message from the API, use that
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  // If there's a standard error message, use that
  if (error.message) {
    return error.message;
  }
  
  // If there's a status code, use the corresponding message
  if (error.response?.status && HTTP_ERROR_MESSAGES[error.response.status]) {
    return HTTP_ERROR_MESSAGES[error.response.status];
  }
  
  // Fall back to generic message
  return fallbackMessage;
};

/**
 * Handle an API error by logging it and returning a user-friendly message
 * 
 * @param {Error|Object} error - The error object
 * @param {string} source - Source of the error (for logging)
 * @param {string} fallbackMessage - Fallback message if no specific message is found
 * @returns {string} - User-friendly error message
 */
export const handleApiError = (error, source = 'API', fallbackMessage = 'An unexpected error occurred.') => {
  // Log the error for debugging
  logError(error, source);
  
  // Return a user-friendly message
  return getUserFriendlyErrorMessage(error, fallbackMessage);
};

/**
 * Extract field validation errors from an API response
 * 
 * @param {Error|Object} error - The error object
 * @returns {Object|null} - Object mapping field names to error messages, or null if none
 */
export const extractValidationErrors = (error) => {
  // Handle Spring Boot validation error format
  if (error.response?.data?.errors) {
    const errors = {};
    error.response.data.errors.forEach((err) => {
      errors[err.field] = err.defaultMessage;
    });
    return errors;
  }
  
  // Handle object mapping format
  if (error.response?.data?.validationErrors) {
    return error.response.data.validationErrors;
  }
  
  return null;
};

/**
 * Check if an error is an authentication error (401)
 * 
 * @param {Error|Object} error - The error object
 * @returns {boolean} - Whether it's an authentication error
 */
export const isAuthError = (error) => {
  return error.response?.status === 401;
};

/**
 * Check if an error is a permission error (403)
 * 
 * @param {Error|Object} error - The error object
 * @returns {boolean} - Whether it's a permission error
 */
export const isPermissionError = (error) => {
  return error.response?.status === 403;
};

/**
 * Check if an error is a not found error (404)
 * 
 * @param {Error|Object} error - The error object
 * @returns {boolean} - Whether it's a not found error
 */
export const isNotFoundError = (error) => {
  return error.response?.status === 404;
};

/**
 * Check if an error is a validation error (400 or 422)
 * 
 * @param {Error|Object} error - The error object
 * @returns {boolean} - Whether it's a validation error
 */
export const isValidationError = (error) => {
  return error.response?.status === 400 || error.response?.status === 422;
};

/**
 * Check if an error is a server error (500 series)
 * 
 * @param {Error|Object} error - The error object
 * @returns {boolean} - Whether it's a server error
 */
export const isServerError = (error) => {
  return error.response?.status >= 500 && error.response?.status < 600;
};

/**
 * Check if an error is a network error (no response)
 * 
 * @param {Error|Object} error - The error object
 * @returns {boolean} - Whether it's a network error
 */
export const isNetworkError = (error) => {
  return !error.response && error.request;
};

/**
 * Retry a function with exponential backoff
 * 
 * @param {Function} fn - The function to retry
 * @param {Object} options - Retry options
 * @returns {Promise} - Promise resolving to the function result
 */
export const retryWithBackoff = async (fn, options = {}) => {
  const {
    maxRetries = 3,
    baseDelay = 300,
    maxDelay = 5000,
    backoffFactor = 2,
    shouldRetry = (error) => isServerError(error) || isNetworkError(error),
  } = options;
  
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Check if we should retry
      if (!shouldRetry(error) || attempt >= maxRetries) {
        throw error;
      }
      
      // Calculate delay with exponential backoff and jitter
      const delay = Math.min(
        baseDelay * Math.pow(backoffFactor, attempt - 1) * (0.8 + Math.random() * 0.4),
        maxDelay
      );
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

export default {
  HTTP_ERROR_MESSAGES,
  getUserFriendlyErrorMessage,
  handleApiError,
  extractValidationErrors,
  isAuthError,
  isPermissionError,
  isNotFoundError,
  isValidationError,
  isServerError,
  isNetworkError,
  retryWithBackoff,
};