import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Button from '@components/common/Button/Button';
import Input from '@components/common/Input/Input';
import Card from '@components/common/Card/Card';
import Alert from '@components/common/Alert/Alert';
import Loader from '@components/common/Loader/Loader';

// Validation schema for user profile
const profileSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Full name is required')
    .min(2, 'Name is too short')
    .max(50, 'Name is too long'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  contactNumber: Yup.string()
    .matches(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/,
      'Invalid phone number format'
    )
    .nullable(),
});

/**
 * UserProfile Component
 * Allows user to view and update their profile information
 * @returns {JSX.Element} UserProfile component
 */
const UserProfile = () => {
  const { user, updateProfile, loading } = useAuth();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setUpdateError(null);
      setUpdateSuccess(false);
      
      // Call API to update profile
      await updateProfile(values);
      
      setUpdateSuccess(true);
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 5000);
    } catch (error) {
      setUpdateError(error.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader text="Loading user profile..." />
      </div>
    );
  }

  // Initial values for the form
  const initialValues = {
    fullName: user.fullName || '',
    email: user.email || '',
    contactNumber: user.contactNumber || '',
    username: user.username || '', // Read-only field
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Profile</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View and update your profile information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User profile sidebar */}
        <div className="md:col-span-1">
          <Card>
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl font-bold text-primary-600 dark:text-primary-300">
                  {user.fullName?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {user.fullName || user.username}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
              
              <div className="mt-4 flex flex-col w-full space-y-2">
                <Link to="/settings">
                  <Button variant="outline" fullWidth>
                    Account Settings
                  </Button>
                </Link>
                <Link to="/settings#change-password">
                  <Button variant="outline-primary" fullWidth>
                    Change Password
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                Role & Permissions
              </h3>
              <div className="space-y-2">
                {user.roles && user.roles.map((role) => (
                  <div 
                    key={role}
                    className="px-2.5 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-800 dark:text-gray-200"
                  >
                    {role}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Profile form */}
        <div className="md:col-span-2">
          <Card>
            {updateSuccess && (
              <Alert
                type="success"
                message="Profile updated successfully"
                className="mb-4"
                isClosable={true}
                onClose={() => setUpdateSuccess(false)}
              />
            )}
            
            {updateError && (
              <Alert
                type="error"
                message={updateError}
                className="mb-4"
                isClosable={true}
                onClose={() => setUpdateError(null)}
              />
            )}
            
            <Formik
              initialValues={initialValues}
              validationSchema={profileSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting, errors, touched, values, handleChange, handleBlur }) => (
                <Form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1 md:col-span-2">
                      <Input
                        label="Username"
                        name="username"
                        value={values.username}
                        readOnly
                        disabled
                      />
                    </div>
                    
                    <Input
                      label="Full Name"
                      name="fullName"
                      value={values.fullName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.fullName && errors.fullName}
                      required
                    />
                    
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && errors.email}
                      required
                    />
                    
                    <Input
                      label="Contact Number"
                      name="contactNumber"
                      value={values.contactNumber || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.contactNumber && errors.contactNumber}
                      placeholder="+263 77 123 4567"
                    />
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
                          <span className="ml-2">Updating...</span>
                        </span>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;