import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Button from '@components/common/Button/Button';
import Input from '@components/common/Input/Input';
import Card from '@components/common/Card/Card';
import Alert from '@components/common/Alert/Alert';
import Loader from '@components/common/Loader/Loader';

// Validation schema for password change
const passwordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required('Current password is required'),
  newPassword: Yup.string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
});

// Validation schema for account settings
const settingsSchema = Yup.object().shape({
  theme: Yup.string().oneOf(['light', 'dark', 'system'], 'Invalid theme'),
  notificationsEnabled: Yup.boolean(),
  emailNotifications: Yup.boolean(),
  language: Yup.string().oneOf(['en', 'es', 'fr', 'pt'], 'Invalid language'),
});

/**
 * ProfileSettings Component
 * Allows users to change their password and adjust account settings
 * @returns {JSX.Element} ProfileSettings component
 */
const ProfileSettings = () => {
  const { user, changePassword, loading } = useAuth();
  const [changeSuccess, setChangeSuccess] = useState(false);
  const [changeError, setChangeError] = useState(null);
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [settingsError, setSettingsError] = useState(null);
  const [activeTab, setActiveTab] = useState('settings');
  
  const location = useLocation();

  // Set active tab based on URL hash
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash === 'change-password') {
      setActiveTab('password');
    } else if (hash === 'account') {
      setActiveTab('account');
    } else if (hash === 'notifications') {
      setActiveTab('notifications');
    } else {
      setActiveTab('settings');
    }
  }, [location]);

  // Handle password change
  const handlePasswordChange = async (values, { setSubmitting, resetForm }) => {
    try {
      setChangeError(null);
      setChangeSuccess(false);
      
      await changePassword(values.currentPassword, values.newPassword);
      
      setChangeSuccess(true);
      resetForm();
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setChangeSuccess(false);
      }, 5000);
    } catch (error) {
      setChangeError(error.message || 'Failed to change password');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle settings update
  const handleSettingsUpdate = async (values, { setSubmitting }) => {
    try {
      setSettingsError(null);
      setSettingsSuccess(false);
      
      // Mock settings update for now
      // In a real implementation, this would call an API
      console.log('Updating settings:', values);
      
      setSettingsSuccess(true);
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSettingsSuccess(false);
      }, 5000);
    } catch (error) {
      setSettingsError(error.message || 'Failed to update settings');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader text="Loading user settings..." />
      </div>
    );
  }

  // Initial values for password form
  const passwordInitialValues = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  // Initial values for settings form
  const settingsInitialValues = {
    theme: 'system',
    notificationsEnabled: true,
    emailNotifications: true,
    language: 'en',
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your password and account preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar navigation */}
        <div className="md:col-span-1">
          <Card className="overflow-hidden">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'settings' 
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                General Settings
              </button>
              
              <button
                onClick={() => setActiveTab('password')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'password' 
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Change Password
              </button>
              
              <button
                onClick={() => setActiveTab('account')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'account' 
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Account Information
              </button>
              
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'notifications' 
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Notifications
              </button>
            </nav>
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 px-3 py-2">
              <Link to="/profile" className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                ← Back to Profile
              </Link>
            </div>
          </Card>
        </div>

        {/* Main content area */}
        <div className="md:col-span-3">
          {/* General Settings Tab */}
          {activeTab === 'settings' && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">General Settings</h2>
              
              {settingsSuccess && (
                <Alert
                  type="success"
                  message="Settings updated successfully"
                  className="mb-4"
                  isClosable={true}
                  onClose={() => setSettingsSuccess(false)}
                />
              )}
              
              {settingsError && (
                <Alert
                  type="error"
                  message={settingsError}
                  className="mb-4"
                  isClosable={true}
                  onClose={() => setSettingsError(null)}
                />
              )}
              
              <Formik
                initialValues={settingsInitialValues}
                validationSchema={settingsSchema}
                onSubmit={handleSettingsUpdate}
              >
                {({ isSubmitting, values, handleChange }) => (
                  <Form className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Theme
                        </label>
                        <div className="mt-2">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <input
                                id="theme-light"
                                name="theme"
                                type="radio"
                                value="light"
                                checked={values.theme === 'light'}
                                onChange={handleChange}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                              />
                              <label htmlFor="theme-light" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                Light
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="theme-dark"
                                name="theme"
                                type="radio"
                                value="dark"
                                checked={values.theme === 'dark'}
                                onChange={handleChange}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                              />
                              <label htmlFor="theme-dark" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                Dark
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="theme-system"
                                name="theme"
                                type="radio"
                                value="system"
                                checked={values.theme === 'system'}
                                onChange={handleChange}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                              />
                              <label htmlFor="theme-system" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                System Default
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Language
                        </label>
                        <select
                          name="language"
                          value={values.language}
                          onChange={handleChange}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                        >
                          <option value="en">English</option>
                          <option value="es">Español</option>
                          <option value="fr">Français</option>
                          <option value="pt">Português</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center">
                            <Loader size="sm" color="white" type="spinner" />
                            <span className="ml-2">Saving...</span>
                          </span>
                        ) : (
                          'Save Settings'
                        )}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </Card>
          )}
          
          {/* Change Password Tab */}
          {activeTab === 'password' && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Change Password</h2>
              
              {changeSuccess && (
                <Alert
                  type="success"
                  message="Password changed successfully"
                  className="mb-4"
                  isClosable={true}
                  onClose={() => setChangeSuccess(false)}
                />
              )}
              
              {changeError && (
                <Alert
                  type="error"
                  message={changeError}
                  className="mb-4"
                  isClosable={true}
                  onClose={() => setChangeError(null)}
                />
              )}
              
              <Formik
                initialValues={passwordInitialValues}
                validationSchema={passwordSchema}
                onSubmit={handlePasswordChange}
              >
                {({ isSubmitting, errors, touched, values, handleChange, handleBlur }) => (
                  <Form className="space-y-6">
                    <Input
                      label="Current Password"
                      name="currentPassword"
                      type="password"
                      value={values.currentPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.currentPassword && errors.currentPassword}
                      required
                    />
                    
                    <Input
                      label="New Password"
                      name="newPassword"
                      type="password"
                      value={values.newPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.newPassword && errors.newPassword}
                      required
                    />
                    
                    <Input
                      label="Confirm New Password"
                      name="confirmPassword"
                      type="password"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.confirmPassword && errors.confirmPassword}
                      required
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
                    
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting || loading}
                      >
                        {isSubmitting || loading ? (
                          <span className="flex items-center">
                            <Loader size="sm" color="white" type="spinner" />
                            <span className="ml-2">Changing Password...</span>
                          </span>
                        ) : (
                          'Change Password'
                        )}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </Card>
          )}
          
          {/* Account Information Tab */}
          {activeTab === 'account' && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Account Information</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Username
                  </h3>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {user.username}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Email
                  </h3>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {user.email}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Role
                  </h3>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {user.roles && user.roles.map((role) => (
                      <div 
                        key={role}
                        className="px-2.5 py-1 rounded-md bg-primary-100 dark:bg-primary-900 text-xs font-medium text-primary-800 dark:text-primary-200"
                      >
                        {role}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Account Created
                  </h3>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Link to="/profile">
                  <Button variant="primary">
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </Card>
          )}
          
          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Notification Settings</h2>
              
              {settingsSuccess && (
                <Alert
                  type="success"
                  message="Notification settings updated successfully"
                  className="mb-4"
                  isClosable={true}
                  onClose={() => setSettingsSuccess(false)}
                />
              )}
              
              {settingsError && (
                <Alert
                  type="error"
                  message={settingsError}
                  className="mb-4"
                  isClosable={true}
                  onClose={() => setSettingsError(null)}
                />
              )}
              
              <Formik
                initialValues={settingsInitialValues}
                validationSchema={settingsSchema}
                onSubmit={handleSettingsUpdate}
              >
                {({ isSubmitting, values, handleChange }) => (
                  <Form className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="notificationsEnabled"
                            name="notificationsEnabled"
                            type="checkbox"
                            checked={values.notificationsEnabled}
                            onChange={handleChange}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="notificationsEnabled" className="font-medium text-gray-700 dark:text-gray-300">
                            Enable notifications
                          </label>
                          <p className="text-gray-500 dark:text-gray-400">
                            Receive notifications about important updates and alerts
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="emailNotifications"
                            name="emailNotifications"
                            type="checkbox"
                            checked={values.emailNotifications}
                            onChange={handleChange}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="emailNotifications" className="font-medium text-gray-700 dark:text-gray-300">
                            Email notifications
                          </label>
                          <p className="text-gray-500 dark:text-gray-400">
                            Receive notifications via email
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center">
                            <Loader size="sm" color="white" type="spinner" />
                            <span className="ml-2">Saving...</span>
                          </span>
                        ) : (
                          'Save Settings'
                        )}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;