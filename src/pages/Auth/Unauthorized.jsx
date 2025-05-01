import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import Button from '@components/common/Button/Button';

/**
 * Unauthorized Page Component
 * Displayed when a user tries to access a route they don't have permission for
 * @returns {JSX.Element} Unauthorized page component
 */
const Unauthorized = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Get the required roles from the location state
  const requiredRoles = location.state?.requiredRoles || [];
  // Get the page the user was trying to access
  const from = location.state?.from?.pathname || '/';
  
  // Handle going back to the previous page
  const goBack = () => {
    navigate(-1);
  };
  
  // Handle logging out
  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 dark:bg-red-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-600 dark:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="mt-5 text-3xl font-extrabold text-gray-900 dark:text-white">
            Access Denied
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            You don't have permission to access this page.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 text-left">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Current User
              </h3>
              <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                {user?.fullName || user?.username || 'Unknown User'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user?.email || ''}
              </p>
            </div>
            
            {requiredRoles.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Required Permissions
                </h3>
                <div className="mt-1 flex flex-wrap gap-2">
                  {requiredRoles.map(role => (
                    <span 
                      key={role}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    >
                      {role}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  You need at least one of these roles to access this page.
                </p>
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                What you can do:
              </h3>
              <ul className="mt-1 text-sm text-gray-700 dark:text-gray-300 list-disc pl-5 space-y-1">
                <li>Contact your administrator to request access</li>
                <li>Try logging in with a different account</li>
                <li>Go back to the previous page</li>
                <li>Return to the dashboard</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            onClick={goBack}
          >
            Go Back
          </Button>
          
          <Link to="/dashboard">
            <Button variant="primary">
              Go to Dashboard
            </Button>
          </Link>
          
          <Button
            variant="danger"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;