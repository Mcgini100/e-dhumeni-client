import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import AuthAPI from '@api/auth.api';
import Button from '@components/common/Button/Button';
import Input from '@components/common/Input/Input';
import Alert from '@components/common/Alert/Alert';
import Loader from '@components/common/Loader/Loader';

// Validation schema for new password
const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
});

/**
 * ResetPassword Component
 * Page for users to set a new password using a reset token
 * @returns {JSX.Element} ResetPassword component
 */
const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const { token: urlToken } = useParams();
  const token = urlToken || searchParams.get('token') || '';
  
  const [resetComplete, setResetComplete] = useState(false);
  const [error, setError] = useState('');
  const [isValidToken, setIsValidToken] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();

  // Verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsValidToken(false);
        setError('Reset token is missing. Please check your reset link.');
        setIsLoading(false);
        return;
      }

      try {
        // In a real implementation, this would call the API to verify the token
        // For now, we'll just simulate a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo purposes, let's consider all tokens valid except 'invalid'
        if (token === 'invalid') {
          throw new Error('Token is invalid or has expired');
        }
        
        setIsValidToken(true);
      } catch (err) {
        setIsValidToken(false);
        setError(err.message || 'Invalid or expired reset token. Please request a new reset link.');
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      
      // Call the API to reset the password
      await AuthAPI.resetPassword(token, values.password);
      
      setResetComplete(true);
      
      // After 3 seconds, redirect to login
      setTimeout(() => {
        navigate('/login', { 
          state: { message: 'Your password has been reset successfully. You can now log in with your new password.' } 
        });
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader size="lg" text="Verifying reset token..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img
            className="mx-auto h-16 w-auto"
            src="/assets/logo.svg"
            alt="e-Dhumeni Logo"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {isValidToken 
              ? "Create a new password for your account" 
              : "There was a problem with your reset link"}
          </p>
        </div>

        {error && (
          <Alert
            type="error"
            message={error}
            className="mb-4"
            isClosable={true}
            onClose={() => setError('')}
          />
        )}

        {resetComplete ? (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mt-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-10 w-10 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Password reset complete
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Your password has been reset successfully. You will be redirected to the login page in a moment.
                </p>
              </div>
            </div>
            <div className="mt-6">
              <Link to="/login">
                <Button variant="primary" fullWidth>
                  Go to Login
                </Button>
              </Link>
            </div>
          </div>
        ) : isValidToken ? (
          <Formik
            initialValues={{ password: '', confirmPassword: '' }}
            validationSchema={resetPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched, values, handleChange, handleBlur }) => (
              <Form className="mt-8 space-y-6">
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                  <div className="space-y-4">
                    <Input
                      label="New Password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      placeholder="Enter new password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.password && errors.password}
                      icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      }
                    />
                    
                    <Input
                      label="Confirm New Password"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      placeholder="Confirm new password"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.confirmPassword && errors.confirmPassword}
                      icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      }
                    />
                    
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      <p>Password must contain:</p>
                      <ul className="list-disc pl-5 mt-1">
                        <li>At least 8 characters</li>
                        <li>At least one uppercase letter</li>
                        <li>At least one lowercase letter</li>
                        <li>At least one number</li>
                        <li>At least one special character</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <Loader size="sm" color="white" type="spinner" />
                          <span className="ml-2">Resetting...</span>
                        </span>
                      ) : (
                        'Reset Password'
                      )}
                    </Button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mt-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-10 w-10 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Invalid Reset Link
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  The password reset link is invalid or has expired. Please request a new reset link.
                </p>
              </div>
            </div>
            <div className="mt-6">
              <Link to="/forgot-password">
                <Button variant="primary" fullWidth>
                  Request New Reset Link
                </Button>
              </Link>
            </div>
          </div>
        )}

        <div className="text-center">
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
            Back to login
          </Link>
        </div>
        
        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} e-Dhumeni. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;