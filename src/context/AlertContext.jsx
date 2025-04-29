import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * Context for managing application-wide alerts and notifications
 */
export const AlertContext = createContext({
  alerts: [],
  addAlert: () => {},
  removeAlert: () => {},
  clearAlerts: () => {},
});

// Alert types
export const ALERT_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

/**
 * Provider component for the Alert Context
 */
export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  // Add a new alert
  const addAlert = useCallback((message, type = ALERT_TYPES.INFO, options = {}) => {
    const id = Date.now().toString();
    const alert = {
      id,
      message,
      type,
      autoClose: options.autoClose !== false,
      duration: options.duration || (type === ALERT_TYPES.ERROR ? 8000 : 5000),
      title: options.title || '',
      action: options.action || null,
      created: new Date(),
    };

    setAlerts((prevAlerts) => [...prevAlerts, alert]);
    return id;
  }, []);

  // Remove an alert by ID
  const removeAlert = useCallback((id) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  }, []);

  // Clear all alerts
  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  // Shorthand methods for specific alert types
  const success = useCallback((message, options = {}) => {
    return addAlert(message, ALERT_TYPES.SUCCESS, options);
  }, [addAlert]);

  const error = useCallback((message, options = {}) => {
    return addAlert(message, ALERT_TYPES.ERROR, options);
  }, [addAlert]);

  const warning = useCallback((message, options = {}) => {
    return addAlert(message, ALERT_TYPES.WARNING, options);
  }, [addAlert]);

  const info = useCallback((message, options = {}) => {
    return addAlert(message, ALERT_TYPES.INFO, options);
  }, [addAlert]);

  // Auto-dismiss alerts based on duration
  useEffect(() => {
    const timers = alerts
      .filter((alert) => alert.autoClose)
      .map((alert) => {
        return setTimeout(() => {
          removeAlert(alert.id);
        }, alert.duration);
      });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [alerts, removeAlert]);

  // Context value
  const value = useMemo(() => ({
    alerts,
    addAlert,
    removeAlert,
    clearAlerts,
    success,
    error,
    warning,
    info,
  }), [alerts, addAlert, removeAlert, clearAlerts, success, error, warning, info]);

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  );
};

AlertProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook for using the alert context
 */
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export default {
  AlertContext,
  AlertProvider,
  useAlert,
  ALERT_TYPES,
};