import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import useAuth from '@hooks/useAuth';
import Alert from '@components/common/Alert/Alert';
import Button from '@components/common/Button/Button';
import Input from '@components/common/Input/Input';
import Loader from '@components/common/Loader/Loader';

// Validation schema for login form
const loginSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: Yup.boolean()
});

/**
 * Enhanced Login Page Component
 * @returns {JSX.Element} Login page component
 */
const Login = () => {
  const { login, loading, error, clearError } = useAuth();
  const [generalError, setGeneralError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check for redirect URL in the location state or query params
  const from = location.state?.from?.pathname || '/dashboard';
  
  // Reset errors when component mounts
  useEffect(() => {
    clearError();
    setGeneralError('');
  }, [clearError]);

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      clearError();
      setGeneralError('');
      
      await login(values.username, values.password, values.rememberMe);
      
      // Navigate to the page they were trying to access, or dashboard
      navigate(from, { replace: true });
    } catch (err) {
      setGeneralError(err.toString());
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and heading */}
        <div>
          <img 
            className="mx-auto h-16 w-auto" 
            src="/assets/logo.svg" 
            alt="e-Dhumeni Logo" 
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to e-Dhumeni
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Agricultural Performance Tracking System
          </p>
        </div>

        {/* Display errors */}
        {(error || generalError) && (
          <Alert
            type="error"
            title="Authentication Failed"
            message={error || generalError}
            isClosable={true}
            onClose={() => {
              clearError();
              setGeneralError('');
            }}
          />
        )}

        {/* Login form */}
        <Formik
          initialValues={{ username: '', password: '', rememberMe: false }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="mt-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <Input
                    label="Username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    placeholder="Enter your username"
                    error={touched.username && errors.username}
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    }
                  />
                </div>
                
                <div>
                  <Input
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="Enter your password"
                    error={touched.password && errors.password}
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Field
                    id="remember-me"
                    name="rememberMe"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link 
                    to="/forgot-password" 
                    className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting || loading}
                  fullWidth
                >
                  {(isSubmitting || loading) ? (
                    <span className="flex items-center justify-center">
                      <Loader size="sm" color="white" type="spinner" />
                      <span className="ml-2">Signing in...</span>
                    </span>
                  ) : (
                    'Sign in'
                  )}
                </Button>
              </div>
              
              {/* Optional: Add a demo account option */}
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Demo account: <span className="font-medium">demo / password123</span>
                </p>
              </div>
            </Form>
          )}
        </Formik>
        
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

export default Login;