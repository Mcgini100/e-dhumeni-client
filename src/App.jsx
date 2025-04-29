import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AuthProvider from '@context/AuthContext';
import routes from './routes';

/**
 * Loading component for suspense fallback
 */
const Loading = () => (
  <div className="flex items-center justify-center h-screen w-full">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    <span className="ml-2 text-gray-500 text-lg">Loading...</span>
  </div>
);

/**
 * App Component
 * Main application component that sets up routing and providers
 */
const App = () => {
  const routeElement = useRoutes(routes);

  return (
    <AuthProvider>
      <Suspense fallback={<Loading />}>
        {routeElement}
      </Suspense>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </AuthProvider>
  );
};

export default App;