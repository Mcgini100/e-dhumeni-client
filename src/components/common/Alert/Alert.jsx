import React from 'react';
import PropTypes from 'prop-types';
import {
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import './Alert.css';

/**
 * Alert component for displaying notifications and messages
 */
const Alert = ({
  type = 'info',
  title,
  message,
  onClose,
  isClosable = true,
  className = '',
  showIcon = true,
  action,
  duration = 0, // 0 means it won't auto-dismiss
}) => {
  const [visible, setVisible] = React.useState(true);

  // Auto-dismiss logic
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) {
          onClose();
        }
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!visible) return null;

  // Define alert styles based on type
  const alertStyles = {
    info: {
      container: 'bg-blue-50 border-blue-400 text-blue-800',
      icon: <InformationCircleIcon className="h-5 w-5 text-blue-500" aria-hidden="true" />,
      ring: 'focus:ring-blue-500',
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-400 text-yellow-800',
      icon: <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" aria-hidden="true" />,
      ring: 'focus:ring-yellow-500',
    },
    success: {
      container: 'bg-green-50 border-green-400 text-green-800',
      icon: <CheckCircleIcon className="h-5 w-5 text-green-500" aria-hidden="true" />,
      ring: 'focus:ring-green-500',
    },
    error: {
      container: 'bg-red-50 border-red-400 text-red-800',
      icon: <XCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />,
      ring: 'focus:ring-red-500',
    },
  };

  const styles = alertStyles[type] || alertStyles.info;

  const handleClose = () => {
    setVisible(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <div
      className={`alert rounded-md border p-4 ${styles.container} ${className}`}
      role="alert"
    >
      <div className="flex items-start">
        {showIcon && <div className="flex-shrink-0 mr-3">{styles.icon}</div>}
        <div className="flex-1">
          {title && <h3 className="text-sm font-medium mb-1">{title}</h3>}
          {message && <div className="text-sm">{message}</div>}
          {action && <div className="mt-2">{action}</div>}
        </div>
        {isClosable && (
          <div className="ml-auto pl-3">
            <button
              type="button"
              className={`inline-flex rounded-md p-1.5 text-opacity-60 hover:text-opacity-100 focus:outline-none focus:ring-2 ${styles.ring}`}
              onClick={handleClose}
              aria-label="Close"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

Alert.propTypes = {
  type: PropTypes.oneOf(['info', 'warning', 'success', 'error']),
  title: PropTypes.string,
  message: PropTypes.node,
  onClose: PropTypes.func,
  isClosable: PropTypes.bool,
  className: PropTypes.string,
  showIcon: PropTypes.bool,
  action: PropTypes.node,
  duration: PropTypes.number,
};

export default Alert;