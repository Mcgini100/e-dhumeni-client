import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import AuthAPI from '@api/auth.api';
import Button from '@components/common/Button/Button';
import Input from '@components/common/Input/Input';
import Alert from '@components/common/Alert/Alert';
import Loader from '@components/common/Loader/Loader';

// Validation schema for reset password form
const resetPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

/**
 * Enhanced ForgotPassword Component
 * Form for users to request a password reset with improved UX
 * @returns {JSX.Element} ForgotPassword component
 */
const ForgotPassword = () => {
  const [requestSent, setRequestSent] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      
      // This would call the actual API in a real implementation
      await AuthAPI.requestPasswordReset(values.email);
      
      setEmail(values.email);
      setRequestSent(true);
    } catch (err) {
      setError(err.message || 'Failed to request password reset. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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
            {requestSent
              ? "Check your email for reset instructions"
              : "Enter your email address and we'll send you a reset link"}
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

        {requestSent ? (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mt-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-10 w-10 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Reset request sent
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions to reset your password.
                </p>
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  If you don't see the email, check your spam folder or try again.
                </p>
              </div>
            </div>
            <div className="mt-6">
              <Button
                variant="primary"
                fullWidth
                onClick={() => setRequestSent(false)}
              >
                Try again with a different email
              </Button>
            </div>
          </div>
        ) : (
          <Formik
            initialValues={{ email: '' }}
            validationSchema={resetPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched, values, handleChange, handleBlur }) => (
              <Form className="mt-8 space-y-6">
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                  <div className="space-y-4">
                    <Input
                      label="Email address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="Enter your email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && errors.email}
                      icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      }
                    />
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
                          <span className="ml-2">Sending...</span>
                        </span>
                      ) : (
                        'Send Reset Link'
                      )}
                    </Button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
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

export default ForgotPassword;