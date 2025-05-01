import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import Loader from '@components/common/Loader/Loader';

/**
 * ProtectedRoute component for securing routes that require authentication
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {Array<string>} [props.requiredRoles] - Optional roles required to access the route
 * @param {string} [props.redirectTo='/login'] - Path to redirect to if not authenticated
 * @returns {JSX.Element} The protected component or redirect
 */
const ProtectedRoute = ({ 
  children, 
  requiredRoles = [],
  redirectTo = '/login' 
}) => {
  const { isLoggedIn, loading, authChecked, user, checkRole } = useAuth();
  const location = useLocation();

  // Show loader while checking authentication
  if (loading || !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader size="lg" text="Verifying your authentication..." />
      </div>
    );
  }

  // If not logged in, redirect to login with return URL
  if (!isLoggedIn) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // If there are required roles, check if user has at least one of them
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => checkRole(role));
    
    if (!hasRequiredRole) {
      // Redirect to unauthorized page
      return (
        <Navigate
          to="/unauthorized"
          state={{ 
            from: location,
            requiredRoles: requiredRoles 
          }}
          replace
        />
      );
    }
  }

  // User is authenticated and has required roles, render the protected component
  return children;
};

export default ProtectedRoute;