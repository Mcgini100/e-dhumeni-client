/**
 * Utility functions for validating form inputs
 */

/**
 * Checks if a value is required and not empty
 *
 * @param {any} value - The value to check
 * @returns {boolean} - Whether the value is valid
 */
export const isRequired = (value) => {
    if (value === null || value === undefined) return false;
    
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    
    if (typeof value === 'object') {
      return Object.keys(value).length > 0;
    }
    
    return true;
  };
  
  /**
   * Checks if a value is a valid email address
   *
   * @param {string} value - The value to check
   * @returns {boolean} - Whether the value is a valid email
   */
  export const isValidEmail = (value) => {
    if (!value) return true; // Allow empty values (use with isRequired if needed)
    
    // RFC 5322 compliant regex
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(value);
  };
  
  /**
   * Checks if a value is a valid phone number
   *
   * @param {string} value - The value to check
   * @returns {boolean} - Whether the value is a valid phone number
   */
  export const isValidPhone = (value) => {
    if (!value) return true; // Allow empty values
    
    // Basic international phone number validation
    // Allows +, spaces, dashes, and parentheses
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,4}$/;
    return phoneRegex.test(value);
  };
  
  /**
   * Checks if a value is at least a minimum length
   *
   * @param {string} value - The value to check
   * @param {number} min - The minimum length
   * @returns {boolean} - Whether the value meets the minimum length
   */
  export const isMinLength = (value, min) => {
    if (!value) return true; // Allow empty values
    
    return String(value).length >= min;
  };
  
  /**
   * Checks if a value is at most a maximum length
   *
   * @param {string} value - The value to check
   * @param {number} max - The maximum length
   * @returns {boolean} - Whether the value meets the maximum length
   */
  export const isMaxLength = (value, max) => {
    if (!value) return true; // Allow empty values
    
    return String(value).length <= max;
  };
  
  /**
   * Checks if a value is a number
   *
   * @param {any} value - The value to check
   * @returns {boolean} - Whether the value is a number
   */
  export const isNumber = (value) => {
    if (!value && value !== 0) return true; // Allow empty values
    
    return !isNaN(Number(value));
  };
  
  /**
   * Checks if a value is at least a minimum value
   *
   * @param {number} value - The value to check
   * @param {number} min - The minimum value
   * @returns {boolean} - Whether the value meets the minimum
   */
  export const isMin = (value, min) => {
    if (!value && value !== 0) return true; // Allow empty values
    
    return Number(value) >= min;
  };
  
  /**
   * Checks if a value is at most a maximum value
   *
   * @param {number} value - The value to check
   * @param {number} max - The maximum value
   * @returns {boolean} - Whether the value meets the maximum
   */
  export const isMax = (value, max) => {
    if (!value && value !== 0) return true; // Allow empty values
    
    return Number(value) <= max;
  };
  
  /**
   * Checks if a value matches a regex pattern
   *
   * @param {string} value - The value to check
   * @param {RegExp} pattern - The regex pattern
   * @returns {boolean} - Whether the value matches the pattern
   */
  export const matchesPattern = (value, pattern) => {
    if (!value) return true; // Allow empty values
    
    return pattern.test(value);
  };
  
  /**
   * Checks if two values match
   *
   * @param {any} value - The value to check
   * @param {any} compareValue - The value to compare against
   * @returns {boolean} - Whether the values match
   */
  export const matches = (value, compareValue) => {
    return value === compareValue;
  };
  
  /**
   * Checks if a date is valid
   *
   * @param {string|Date} value - The date to check
   * @returns {boolean} - Whether the date is valid
   */
  export const isValidDate = (value) => {
    if (!value) return true; // Allow empty values
    
    const date = new Date(value);
    return !isNaN(date.getTime());
  };
  
  /**
   * Checks if a date is in the future
   *
   * @param {string|Date} value - The date to check
   * @returns {boolean} - Whether the date is in the future
   */
  export const isFutureDate = (value) => {
    if (!value) return true; // Allow empty values
    
    const date = new Date(value);
    const now = new Date();
    
    return !isNaN(date.getTime()) && date > now;
  };
  
  /**
   * Checks if a date is in the past
   *
   * @param {string|Date} value - The date to check
   * @returns {boolean} - Whether the date is in the past
   */
  export const isPastDate = (value) => {
    if (!value) return true; // Allow empty values
    
    const date = new Date(value);
    const now = new Date();
    
    return !isNaN(date.getTime()) && date < now;
  };
  
  /**
   * Checks if a value is a valid UUID
   *
   * @param {string} value - The value to check
   * @returns {boolean} - Whether the value is a valid UUID
   */
  export const isValidUUID = (value) => {
    if (!value) return true; // Allow empty values
    
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  };
  
  /**
   * Checks if a password meets strength requirements
   *
   * @param {string} value - The password to check
   * @param {Object} options - Options for password strength
   * @returns {boolean} - Whether the password meets the requirements
   */
  export const isStrongPassword = (value, options = {}) => {
    if (!value) return true; // Allow empty values
    
    const {
      minLength = 8,
      requireUppercase = true,
      requireLowercase = true,
      requireNumbers = true,
      requireSpecialChars = true,
    } = options;
    
    if (value.length < minLength) return false;
    
    if (requireUppercase && !/[A-Z]/.test(value)) return false;
    if (requireLowercase && !/[a-z]/.test(value)) return false;
    if (requireNumbers && !/[0-9]/.test(value)) return false;
    if (requireSpecialChars && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) return false;
    
    return true;
  };
  
  /**
   * Create validation rules for a form
   *
   * @param {Object} rules - Rules configuration
   * @returns {Function} - Validation function that returns errors object
   */
  export const createValidator = (rules) => {
    return (values) => {
      const errors = {};
      
      Object.keys(rules).forEach((field) => {
        const fieldRules = rules[field];
        const value = values[field];
        
        fieldRules.forEach((rule) => {
          const { validator, message, params } = rule;
          let isValid;
          
          if (typeof validator === 'function') {
            isValid = validator(value, params);
          } else {
            // Standard validators
            switch (validator) {
              case 'required':
                isValid = isRequired(value);
                break;
              case 'email':
                isValid = isValidEmail(value);
                break;
              case 'phone':
                isValid = isValidPhone(value);
                break;
              case 'minLength':
                isValid = isMinLength(value, params);
                break;
              case 'maxLength':
                isValid = isMaxLength(value, params);
                break;
              case 'number':
                isValid = isNumber(value);
                break;
              case 'min':
                isValid = isMin(value, params);
                break;
              case 'max':
                isValid = isMax(value, params);
                break;
              case 'pattern':
                isValid = matchesPattern(value, params);
                break;
              case 'matches':
                isValid = matches(value, values[params]);
                break;
              case 'date':
                isValid = isValidDate(value);
                break;
              case 'futureDate':
                isValid = isFutureDate(value);
                break;
              case 'pastDate':
                isValid = isPastDate(value);
                break;
              case 'uuid':
                isValid = isValidUUID(value);
                break;
              case 'strongPassword':
                isValid = isStrongPassword(value, params);
                break;
              default:
                isValid = true;
            }
          }
          
          if (!isValid && !errors[field]) {
            errors[field] = message;
          }
        });
      });
      
      return errors;
    };
  };
  
  export default {
    isRequired,
    isValidEmail,
    isValidPhone,
    isMinLength,
    isMaxLength,
    isNumber,
    isMin,
    isMax,
    matchesPattern,
    matches,
    isValidDate,
    isFutureDate,
    isPastDate,
    isValidUUID,
    isStrongPassword,
    createValidator,
  };