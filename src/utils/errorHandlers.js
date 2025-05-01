/**
 * Error handling utilities for the application
 */

import { logError } from './helpers';

/**
 * Expanded map of HTTP status codes to user-friendly messages
 * Based on the e-Dhumeni API documentation
 */
export const HTTP_ERROR_MESSAGES = {
  400: 'The request was invalid. Please check your input and try again.',
  401: 'Your session has expired. Please log in again to continue.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  405: 'This action is not supported.',
  408: 'The request timed out. Please try again.',
  409: 'This operation could not be completed due to a conflict with the current state.',
  422: 'The submitted data was invalid. Please check your input and try again.',
  429: 'Too many requests. Please try again later.',
  500: 'An unexpected server error occurred. Please try again later.',
  502: 'The server is temporarily unavailable. Please try again later.',
  503: 'The service is unavailable. Please try again later.',
  504: 'The server took too long to respond. Please try again later.',
};

/**
 * Common error types for more specific handling
 */
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  AUTHENTICATION: 'AUTHENTICATION_ERROR',
  AUTHORIZATION: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  SERVER: 'SERVER_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  CONFLICT: 'CONFLICT_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
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
 * Get the error type based on the error object
 * 
 * @param {Error|Object} error - The error object
 * @returns {string} - Error type from ERROR_TYPES
 */
export const getErrorType = (error) => {
  if (!error.response) {
    // Network error (no response received)
    return ERROR_TYPES.NETWORK;
  }
  
  switch (error.response.status) {
    case 400:
    case 422:
      return ERROR_TYPES.VALIDATION;
    case 401:
      return ERROR_TYPES.AUTHENTICATION;
    case 403:
      return ERROR_TYPES.AUTHORIZATION;
    case 404:
      return ERROR_TYPES.NOT_FOUND;
    case 408:
    case 504:
      return ERROR_TYPES.TIMEOUT;
    case 409:
      return ERROR_TYPES.CONFLICT;
    case 500:
    case 502:
    case 503:
      return ERROR_TYPES.SERVER;
    default:
      return ERROR_TYPES.UNKNOWN;
  }
};

/**
 * Handle an API error by logging it and returning a standardized error object
 * 
 * @param {Error|Object} error - The error object
 * @param {string} source - Source of the error (for logging)
 * @param {string} fallbackMessage - Fallback message if no specific message is found
 * @returns {Object} - Standardized error object
 */
export const handleApiError = (error, source = 'API', fallbackMessage = 'An unexpected error occurred.') => {
  // Log the error for debugging
  logError(error, source);
  
  // Get a user-friendly message
  const message = getUserFriendlyErrorMessage(error, fallbackMessage);
  
  // Get the error type
  const type = getErrorType(error);
  
  // Extract status code
  const statusCode = error.response?.status || 0;
  
  // Extract validation errors if available
  const validationErrors = extractValidationErrors(error);
  
  // Return a standardized error object
  return {
    message,
    type,
    statusCode,
    validationErrors,
    originalError: error,
    timestamp: new Date().toISOString()
  };
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
  return getErrorType(error) === ERROR_TYPES.AUTHENTICATION;
};

/**
 * Check if an error is a permission error (403)
 * 
 * @param {Error|Object} error - The error object
 * @returns {boolean} - Whether it's a permission error
 */
export const isPermissionError = (error) => {
  return getErrorType(error) === ERROR_TYPES.AUTHORIZATION;
};

/**
 * Check if an error is a not found error (404)
 * 
 * @param {Error|Object} error - The error object
 * @returns {boolean} - Whether it's a not found error
 */
export const isNotFoundError = (error) => {
  return getErrorType(error) === ERROR_TYPES.NOT_FOUND;
};

/**
 * Check if an error is a validation error (400 or 422)
 * 
 * @param {Error|Object} error - The error object
 * @returns {boolean} - Whether it's a validation error
 */
export const isValidationError = (error) => {
  return getErrorType(error) === ERROR_TYPES.VALIDATION;
};

/**
 * Check if an error is a server error (500 series)
 * 
 * @param {Error|Object} error - The error object
 * @returns {boolean} - Whether it's a server error
 */
export const isServerError = (error) => {
  return getErrorType(error) === ERROR_TYPES.SERVER;
};

/**
 * Check if an error is a network error (no response)
 * 
 * @param {Error|Object} error - The error object
 * @returns {boolean} - Whether it's a network error
 */
export const isNetworkError = (error) => {
  return getErrorType(error) === ERROR_TYPES.NETWORK;
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
        throw handleApiError(error, 'Retry Handler', 'Operation failed after multiple attempts.');
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
  
  throw handleApiError(lastError, 'Retry Handler', 'Operation failed after maximum retries.');
};

export default {
  HTTP_ERROR_MESSAGES,
  ERROR_TYPES,
  getUserFriendlyErrorMessage,
  getErrorType,
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