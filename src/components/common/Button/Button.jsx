import React from 'react';

/**
 * Button variants
 */
const VARIANTS = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white',
  secondary: 'bg-secondary-100 hover:bg-secondary-200 text-secondary-800',
  success: 'bg-green-600 hover:bg-green-700 text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
  info: 'bg-blue-500 hover:bg-blue-600 text-white',
  outline: 'bg-transparent hover:bg-gray-50 text-gray-700 border border-gray-300',
  'outline-primary': 'bg-transparent hover:bg-primary-50 text-primary-700 border border-primary-300',
  link: 'bg-transparent hover:underline text-primary-600 hover:text-primary-800'
};

/**
 * Button sizes
 */
const SIZES = {
  xs: 'py-1 px-2 text-xs',
  sm: 'py-1.5 px-3 text-sm',
  md: 'py-2 px-4 text-sm',
  lg: 'py-2 px-6 text-base',
  xl: 'py-3 px-8 text-base'
};

/**
 * Button Component
 * Reusable button component with different variants and sizes
 * 
 * @param {Object} props - Component props
 * @param {string} [props.variant='primary'] - Button style variant
 * @param {string} [props.size='md'] - Button size
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {boolean} [props.fullWidth=false] - Should button take full width
 * @param {Function} [props.onClick] - Click handler
 * @param {React.ReactNode} props.children - Button content
 * @param {string} [props.className] - Additional CSS classes
 * @param {Object} props.rest - Additional props passed to button element
 * @returns {JSX.Element} Button component
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  onClick,
  children,
  className = '',
  ...rest
}) => {
  const variantClasses = VARIANTS[variant] || VARIANTS.primary;
  const sizeClasses = SIZES[size] || SIZES.md;
  
  return (
    <button
      type="button"
      className={`
        ${variantClasses}
        ${sizeClasses}
        ${fullWidth ? 'w-full' : ''}
        font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
        transition duration-150 ease-in-out
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;