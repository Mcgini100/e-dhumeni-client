/**
 * Notification service for displaying toast messages and alerts
 * This service wraps a toast library like react-toastify 
 * or can be used with a custom alert component
 */

import { toast } from 'react-toastify';

// Default configurations
const DEFAULT_OPTIONS = {
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

/**
 * Show a success notification
 *
 * @param {string} message - The message to display
 * @param {object} options - Additional options to override defaults
 */
export const showSuccess = (message, options = {}) => {
  toast.success(message, { ...DEFAULT_OPTIONS, ...options });
};

/**
 * Show an error notification
 *
 * @param {string} message - The message to display
 * @param {object} options - Additional options to override defaults
 */
export const showError = (message, options = {}) => {
  toast.error(message, { 
    ...DEFAULT_OPTIONS, 
    ...options,
    autoClose: options.autoClose || 7000, // Longer display for errors by default
  });
};

/**
 * Show an info notification
 *
 * @param {string} message - The message to display
 * @param {object} options - Additional options to override defaults
 */
export const showInfo = (message, options = {}) => {
  toast.info(message, { ...DEFAULT_OPTIONS, ...options });
};

/**
 * Show a warning notification
 *
 * @param {string} message - The message to display
 * @param {object} options - Additional options to override defaults
 */
export const showWarning = (message, options = {}) => {
  toast.warning(message, { ...DEFAULT_OPTIONS, ...options });
};

/**
 * Show a notification with a specific type
 *
 * @param {string} type - The notification type
 * @param {string} message - The message to display
 * @param {object} options - Additional options to override defaults
 */
export const showNotification = (type, message, options = {}) => {
  switch (type) {
    case NOTIFICATION_TYPES.SUCCESS:
      showSuccess(message, options);
      break;
    case NOTIFICATION_TYPES.ERROR:
      showError(message, options);
      break;
    case NOTIFICATION_TYPES.INFO:
      showInfo(message, options);
      break;
    case NOTIFICATION_TYPES.WARNING:
      showWarning(message, options);
      break;
    default:
      showInfo(message, options);
  }
};

/**
 * Display an API error in a user-friendly way
 *
 * @param {Error} error - The error object from API calls
 * @param {string} fallbackMessage - Fallback message if error details aren't available
 */
export const showApiError = (error, fallbackMessage = 'An unexpected error occurred') => {
  // Handle different error formats from our API
  const errorMessage = error.response?.data?.message 
    || error.message 
    || fallbackMessage;
  
  showError(errorMessage);
};

/**
 * Clear all notifications
 */
export const clearAll = () => {
  toast.dismiss();
};

export default {
  showSuccess,
  showError,
  showInfo,
  showWarning,
  showNotification,
  showApiError,
  clearAll,
  NOTIFICATION_TYPES,
};