import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '@services/auth.service';

// Layout
import MainLayout from '@components/layout/MainLayout/MainLayout';

// Auth pages
import Login from '@pages/Auth/Login';
import ForgotPassword from '@pages/Auth/ForgotPassword';

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
const NotFound = React.lazy(() => import('@pages/NotFound'));

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

/**
 * Routes Configuration
 */
const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <Navigate to="/dashboard" replace /> },
      { 
        path: '/dashboard', 
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ) 
      },
      
      // Farmers routes
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
          <ProtectedRoute>
            <FarmerForm />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/farmers/edit/:id', 
        element: (
          <ProtectedRoute>
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
          <ProtectedRoute>
            <ContractForm />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/contracts/edit/:id', 
        element: (
          <ProtectedRoute>
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
          <ProtectedRoute>
            <DeliveryForm />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/deliveries/create/:contractId', 
        element: (
          <ProtectedRoute>
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
          <ProtectedRoute>
            <RegionForm />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/regions/edit/:id', 
        element: (
          <ProtectedRoute>
            <RegionForm />
          </ProtectedRoute>
        ) 
      },
      
      // Alerts route
      { 
        path: '/alerts', 
        element: (
          <ProtectedRoute>
            <AlertDashboard />
          </ProtectedRoute>
        ) 
      },
      
      // Auth routes
      { path: '/login', element: <Login /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      
      // Catch-all
      { path: '*', element: <NotFound /> }
    ],
  },
];

export default routes;