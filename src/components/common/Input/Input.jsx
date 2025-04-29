import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import './Input.css';

/**
 * Reusable Input component with support for various input types
 */
const Input = forwardRef(({
  type = 'text',
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  inputClassName = '',
  fullWidth = false,
  min,
  max,
  step,
  pattern,
  readOnly = false,
  icon,
  iconPosition = 'left',
  ...rest
}, ref) => {
  const inputId = `input-${name}`;
  const hasError = !!error;
  
  const containerClasses = `input-container ${fullWidth ? 'w-full' : ''} ${className}`;
  const inputClasses = `
    form-input
    py-2
    px-3
    border
    rounded-md
    shadow-sm
    focus:ring-2
    focus:ring-primary-500
    focus:border-primary-500
    ${hasError ? 'border-red-500' : 'border-gray-300'}
    ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}
    ${readOnly ? 'bg-gray-50' : ''}
    ${icon && iconPosition === 'left' ? 'pl-10' : ''}
    ${icon && iconPosition === 'right' ? 'pr-10' : ''}
    ${inputClassName}
  `;

  return (
    <div className={containerClasses}>
      {label && (
        <label 
          htmlFor={inputId} 
          className={`block text-sm font-medium mb-1 ${hasError ? 'text-red-500' : 'text-gray-700'}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        
        {type === 'textarea' ? (
          <textarea
            id={inputId}
            name={name}
            ref={ref}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            className={inputClasses}
            rows={rest.rows || 4}
            {...rest}
          />
        ) : (
          <input
            id={inputId}
            type={type}
            name={name}
            ref={ref}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            min={min}
            max={max}
            step={step}
            pattern={pattern}
            className={inputClasses}
            {...rest}
          />
        )}
        
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
      </div>
      
      {(helperText || hasError) && (
        <p className={`mt-1 text-sm ${hasError ? 'text-red-500' : 'text-gray-500'}`}>
          {hasError ? error : helperText}
        </p>
      )}
    </div>
  );
});

Input.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  fullWidth: PropTypes.bool,
  min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  step: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  pattern: PropTypes.string,
  readOnly: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
};

Input.displayName = 'Input';

export default Input;