import React from 'react';
import PropTypes from 'prop-types';
import './Loader.css';

/**
 * Loader component for displaying loading states
 */
const Loader = ({
  size = 'md',
  color = 'primary',
  text,
  fullscreen = false,
  overlay = false,
  className = '',
  type = 'spinner',
}) => {
  // Size classes
  const sizeClasses = {
    xs: { spinner: 'h-4 w-4', dots: 'h-1 w-1 mx-0.5', circle: 'h-4 w-4' },
    sm: { spinner: 'h-6 w-6', dots: 'h-1.5 w-1.5 mx-0.5', circle: 'h-6 w-6' },
    md: { spinner: 'h-8 w-8', dots: 'h-2 w-2 mx-1', circle: 'h-8 w-8' },
    lg: { spinner: 'h-12 w-12', dots: 'h-2.5 w-2.5 mx-1', circle: 'h-12 w-12' },
    xl: { spinner: 'h-16 w-16', dots: 'h-3 w-3 mx-1.5', circle: 'h-16 w-16' },
  };

  // Color classes
  const colorClasses = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    success: 'text-green-600',
    danger: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
    light: 'text-gray-300',
    dark: 'text-gray-800',
    white: 'text-white',
  };

  // Spinner Loader
  const renderSpinner = () => (
    <svg
      className={`animate-spin ${sizeClasses[size].spinner} ${colorClasses[color]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      data-testid="loader-spinner"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  // Dots Loader
  const renderDots = () => (
    <div className="flex items-center" data-testid="loader-dots">
      <div className={`bounce1 rounded-full ${sizeClasses[size].dots} ${colorClasses[color]}`}></div>
      <div className={`bounce2 rounded-full ${sizeClasses[size].dots} ${colorClasses[color]}`}></div>
      <div className={`bounce3 rounded-full ${sizeClasses[size].dots} ${colorClasses[color]}`}></div>
    </div>
  );

  // Circle Loader
  const renderCircle = () => (
    <div 
      className={`loader-circle ${sizeClasses[size].circle}`} 
      style={{ 
        borderTopColor: getComputedColorFromClass(color) 
      }}
      data-testid="loader-circle"
    ></div>
  );

  // Helper to interpret color classes for CSS variables
  function getComputedColorFromClass(colorName) {
    switch(colorName) {
      case 'primary': return 'var(--color-primary-600, #4f46e5)';
      case 'secondary': return 'var(--color-secondary-600, #475569)';
      case 'success': return 'var(--color-green-600, #16a34a)';
      case 'danger': return 'var(--color-red-600, #dc2626)';
      case 'warning': return 'var(--color-yellow-600, #ca8a04)';
      case 'info': return 'var(--color-blue-600, #2563eb)';
      case 'light': return 'var(--color-gray-300, #d1d5db)';
      case 'dark': return 'var(--color-gray-800, #1f2937)';
      case 'white': return 'var(--color-white, #ffffff)';
      default: return 'var(--color-primary-600, #4f46e5)';
    }
  }

  // Render loader based on type
  const renderLoader = () => {
    switch (type) {
      case 'dots':
        return renderDots();
      case 'circle':
        return renderCircle();
      case 'spinner':
      default:
        return renderSpinner();
    }
  };

  // Full-screen loader with overlay
  if (fullscreen) {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center ${
          overlay ? 'bg-black bg-opacity-50' : ''
        } ${className}`}
        data-testid="loader-fullscreen"
      >
        <div className="flex flex-col items-center">
          {renderLoader()}
          {text && <p className={`mt-4 ${colorClasses[color]} text-center`}>{text}</p>}
        </div>
      </div>
    );
  }

  // Regular loader
  return (
    <div className={`flex items-center ${className}`} data-testid="loader">
      {renderLoader()}
      {text && <p className={`ml-3 ${colorClasses[color]}`}>{text}</p>}
    </div>
  );
};

Loader.propTypes = {
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark',
    'white',
  ]),
  text: PropTypes.string,
  fullscreen: PropTypes.bool,
  overlay: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.oneOf(['spinner', 'dots', 'circle']),
};

export default Loader;