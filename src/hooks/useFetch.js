import { useState, useEffect, useCallback, useRef } from 'react';
import apiClient from '../api/apiClient';

/**
 * Custom hook for handling API requests with built-in state management for loading, data, and errors
 * 
 * @param {string} url - The API endpoint URL
 * @param {Object} options - Configuration options for the request
 * @returns {Object} - The hook's state and control functions
 */
const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shouldRefetch, setShouldRefetch] = useState(0);
  
  // Store the latest options in a ref to prevent unnecessary re-renders
  const optionsRef = useRef(options);
  
  // Update the options ref when options change
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);
  
  // Function to fetch data from the API
  const fetchData = useCallback(async (overrideOptions = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Merge default options with any override options
      const fetchOptions = {
        ...optionsRef.current,
        ...overrideOptions,
      };
      
      // Make the API request
      const response = await apiClient.request({
        url,
        ...fetchOptions,
      });
      
      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError({
        message: errorMessage,
        statusCode: err.response?.status,
        details: err.response?.data,
        originalError: err,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url]);
  
  // Function to manually trigger a refetch
  const refetch = useCallback((overrideOptions = {}) => {
    setShouldRefetch(prev => prev + 1);
    
    // If immediate is true, fetch immediately without waiting for effect
    if (overrideOptions.immediate) {
      delete overrideOptions.immediate;
      return fetchData(overrideOptions);
    }
    
    // Store the override options to be used in the effect
    optionsRef.current = {
      ...optionsRef.current,
      ...overrideOptions,
    };
    
    return Promise.resolve();
  }, [fetchData]);
  
  // Function to update data manually without fetching
  const updateData = useCallback((updater) => {
    setData(prevData => {
      if (typeof updater === 'function') {
        return updater(prevData);
      }
      return updater;
    });
  }, []);
  
  // Function to reset the hook state
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);
  
  // Fetch data when the component mounts or shouldRefetch changes
  useEffect(() => {
    // Skip initial fetch if skipInitialFetch is true
    if (optionsRef.current.skipInitialFetch && shouldRefetch === 0) {
      return;
    }
    
    fetchData();
  }, [fetchData, shouldRefetch]);
  
  return {
    data,
    loading,
    error,
    refetch,
    updateData,
    reset,
  };
};

export default useFetch;