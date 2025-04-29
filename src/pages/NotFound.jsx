import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@components/common/Button/Button';

/**
 * NotFound Component
 * Displays a 404 error page when route is not found
 */
const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-9xl font-extrabold text-primary-600">404</h1>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">Page Not Found</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We couldn't find the page you're looking for.
          </p>
        </div>
        <div className="mt-8">
          <Link to="/dashboard">
            <Button variant="primary" fullWidth>
              Go back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;