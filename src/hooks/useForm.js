import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for form state management with validation
 * 
 * @param {Object} initialValues - Initial form values
 * @param {Function} validateFn - Validation function (returns object with error messages)
 * @param {Function} onSubmit - Function to call when form is submitted and valid
 * @param {Object} options - Additional options
 * @returns {Object} - Form state and handlers
 */
const useForm = (
  initialValues = {},
  validateFn = () => ({}),
  onSubmit = () => {},
  options = {}
) => {
  // Form state
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  
  // Options with defaults
  const {
    validateOnChange = true,
    validateOnBlur = true,
    resetOnSubmit = false,
    submitOnEnter = true,
  } = options;
  
  // Validate form values
  const validate = useCallback(() => {
    const validationErrors = validateFn(values);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [values, validateFn]);
  
  // Update form validity when errors change
  useEffect(() => {
    setIsValid(Object.keys(errors).length === 0);
  }, [errors]);
  
  // Handle input change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    
    setIsDirty(true);
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    
    if (validateOnChange) {
      setTimeout(() => {
        setErrors((prev) => {
          const validationErrors = validateFn({
            ...values,
            [name]: newValue,
          });
          
          return {
            ...prev,
            [name]: validationErrors[name],
          };
        });
      }, 0);
    }
  }, [values, validateOnChange, validateFn]);
  
  // Handle field blur
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    
    if (validateOnBlur) {
      setTimeout(() => {
        setErrors((prev) => {
          const validationErrors = validateFn(values);
          return {
            ...prev,
            [name]: validationErrors[name],
          };
        });
      }, 0);
    }
  }, [values, validateOnBlur, validateFn]);
  
  // Update a single field programmatically
  const setFieldValue = useCallback((name, value, shouldValidate = validateOnChange) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    setIsDirty(true);
    
    if (shouldValidate) {
      setTimeout(() => {
        setErrors((prev) => {
          const validationErrors = validateFn({
            ...values,
            [name]: value,
          });
          
          return {
            ...prev,
            [name]: validationErrors[name],
          };
        });
      }, 0);
    }
  }, [values, validateOnChange, validateFn]);
  
  // Set multiple field values programmatically
  const setMultipleValues = useCallback((newValues, shouldValidate = validateOnChange) => {
    setValues((prev) => ({
      ...prev,
      ...newValues,
    }));
    
    setIsDirty(true);
    
    if (shouldValidate) {
      setTimeout(() => {
        const validationErrors = validateFn({
          ...values,
          ...newValues,
        });
        setErrors(validationErrors);
      }, 0);
    }
  }, [values, validateOnChange, validateFn]);
  
  // Set an error message manually
  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);
  
  // Mark a field as touched
  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouched((prev) => ({
      ...prev,
      [name]: isTouched,
    }));
  }, []);
  
  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    setTouched(
      Object.keys(values).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {})
    );
    
    const isFormValid = validate();
    
    if (isFormValid) {
      setIsSubmitting(true);
      
      try {
        await onSubmit(values);
        
        if (resetOnSubmit) {
          resetForm();
        }
      } catch (error) {
        // Handle submission error if needed
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
    
    return isFormValid;
  }, [values, validate, onSubmit, resetOnSubmit]);
  
  // Reset form to initial values or new values
  const resetForm = useCallback((newInitialValues = initialValues) => {
    setValues(newInitialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setIsDirty(false);
  }, [initialValues]);
  
  // Handle keydown for enter key submission
  const handleKeyDown = useCallback((e) => {
    if (submitOnEnter && e.key === 'Enter' && !e.shiftKey) {
      handleSubmit();
    }
  }, [submitOnEnter, handleSubmit]);
  
  // Get props for a form field
  const getFieldProps = useCallback((name) => {
    return {
      name,
      value: values[name] || '',
      onChange: handleChange,
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      error: touched[name] && errors[name],
    };
  }, [values, handleChange, handleBlur, handleKeyDown, touched, errors]);
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setMultipleValues,
    setFieldError,
    setFieldTouched,
    resetForm,
    validate,
    getFieldProps,
  };
};

export default useForm;