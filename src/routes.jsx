import React from 'react';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from '@components/auth/ProtectedRoute';
import { USER_ROLES } from '@config/constants';

// Layout
import MainLayout from '@components/layout/MainLayout/MainLayout';

// Auth pages
import Login from '@pages/Auth/Login';
import ForgotPassword from '@pages/Auth/ForgotPassword';
import ResetPassword from '@pages/Auth/ResetPassword';
import Unauthorized from '@pages/Auth/Unauthorized';

// Protected pages - lazy loaded
const Dashboard = React.lazy(() => import('@pages/Dashboard/Dashboard'));
const FarmersList = React.lazy(() => import('@pages/Farmers/FarmersList'));
const FarmerDetail = React.lazy(() => import('@pages/Farmers/FarmerDetail'));
const FarmerForm = React.lazy(() => import('@pages/Farmers/FarmerForm'));
const ContractsList = React.lazy(() => import('@pages/Contracts/ContractsList'));
const ContractDetail = React.lazy(() => import('@pages/Contracts/ContractDetail'));
const ContractForm = React.lazy(() => import('@pages/Contracts/ContractForm'));
const DeliveriesList = React.lazy(() => import('@pages/Deliveries/DeliveriesList'));
const DeliveryForm = React.lazy(() => import('@pages/Deliveries/DeliveryForm'));
const RegionsList = React.lazy(() => import('@pages/Regions/RegionsList'));
const RegionMap = React.lazy(() => import('@pages/Regions/RegionMap'));
const RegionForm = React.lazy(() => import('@pages/Regions/RegionForm'));
const AlertDashboard = React.lazy(() => import('@pages/Alerts/AlertDashboard'));
const AEOList = React.lazy(() => import('@pages/AEO/AEOList'));
const AEOForm = React.lazy(() => import('@pages/AEO/AEOForm'));
const UserProfile = React.lazy(() => import('@pages/Profile/UserProfile'));
const ProfileSettings = React.lazy(() => import('@pages/Profile/ProfileSettings'));
const NotFound = React.lazy(() => import('@pages/NotFound'));

/**
 * Routes Configuration
 */
const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <Navigate to="/dashboard" replace /> },
      
      // Auth routes (public)
      { path: '/login', element: <Login /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/reset-password', element: <ResetPassword /> },
      { path: '/reset-password/:token', element: <ResetPassword /> },
      { path: '/unauthorized', element: <Unauthorized /> },
      
      // Dashboard route (accessible to all authenticated users)
      { 
        path: '/dashboard', 
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ) 
      },
      
      // Farmers routes (accessible to all authenticated users)
      { 
        path: '/farmers', 
        element: (
          <ProtectedRoute>
            <FarmersList />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/farmers/:id', 
        element: (
          <ProtectedRoute>
            <FarmerDetail />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/farmers/create', 
        element: (
          <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.AEO]}>
            <FarmerForm />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/farmers/edit/:id', 
        element: (
          <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.AEO]}>
            <FarmerForm />
          </ProtectedRoute>
        ) 
      },
      
      // Contracts routes
      { 
        path: '/contracts', 
        element: (
          <ProtectedRoute>
            <ContractsList />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/contracts/:id', 
        element: (
          <ProtectedRoute>
            <ContractDetail />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/contracts/create', 
        element: (
          <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.MANAGER]}>
            <ContractForm />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/contracts/edit/:id', 
        element: (
          <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.MANAGER]}>
            <ContractForm />
          </ProtectedRoute>
        ) 
      },
      
      // Deliveries routes
      { 
        path: '/deliveries', 
        element: (
          <ProtectedRoute>
            <DeliveriesList />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/deliveries/create', 
        element: (
          <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.AEO]}>
            <DeliveryForm />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/deliveries/create/:contractId', 
        element: (
          <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.AEO]}>
            <DeliveryForm />
          </ProtectedRoute>
        ) 
      },
      
      // Regions routes
      { 
        path: '/regions', 
        element: (
          <ProtectedRoute>
            <RegionsList />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/regions/map', 
        element: (
          <ProtectedRoute>
            <RegionMap />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/regions/create', 
        element: (
          <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.MANAGER]}>
            <RegionForm />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/regions/edit/:id', 
        element: (
          <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.MANAGER]}>
            <RegionForm />
          </ProtectedRoute>
        ) 
      },
      
      // AEO Management (Admin/Manager only)
      { 
        path: '/aeos', 
        element: (
          <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.MANAGER]}>
            <AEOList />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/aeos/create', 
        element: (
          <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN]}>
            <AEOForm />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/aeos/edit/:id', 
        element: (
          <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN]}>
            <AEOForm />
          </ProtectedRoute>
        ) 
      },
      
      // Alerts route (Manager & Admin only)
      { 
        path: '/alerts', 
        element: (
          <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.MANAGER]}>
            <AlertDashboard />
          </ProtectedRoute>
        ) 
      },
      
      // User profile & settings (accessible to all authenticated users)
      { 
        path: '/profile', 
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/settings', 
        element: (
          <ProtectedRoute>
            <ProfileSettings />
          </ProtectedRoute>
        ) 
      },
      
      // Catch-all
      { path: '*', element: <NotFound /> }
    ],
  },
];

export default routes;