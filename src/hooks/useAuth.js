import { useContext } from 'react';
import { AuthContext } from '@context/AuthContext';
import { hasRole } from '@services/auth.service';

/**
 * Custom hook for Auth Context
 * @returns {Object} Auth context with additional helper methods
 */
const useAuth = () => {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  /**
   * Check if the user has a specific role
   * @param {string} role - Role to check
   * @returns {boolean} True if the user has the role
   */
  const checkRole = (role) => {
    return hasRole(role);
  };

  /**
   * Check if the user has admin role
   * @returns {boolean} True if the user is an admin
   */
  const isAdmin = () => {
    return checkRole('ADMIN');
  };

  /**
   * Check if the user has manager role
   * @returns {boolean} True if the user is a manager
   */
  const isManager = () => {
    return checkRole('MANAGER');
  };

  /**
   * Check if the user has AEO role
   * @returns {boolean} True if the user is an AEO
   */
  const isAEO = () => {
    return checkRole('AEO');
  };

  /**
   * Check if the user is a basic user
   * @returns {boolean} True if the user is a basic user
   */
  const isUser = () => {
    return checkRole('USER');
  };

  return {
    ...auth,
    checkRole,
    isAdmin,
    isManager,
    isAEO,
    isUser,
  };
};

export default useAuth;