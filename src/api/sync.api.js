import apiClient from './apiClient';
import { objKeysToCamel, objKeysToSnake } from '../utils/helpers';

const SYNC_URL = '/api/sync';

/**
 * Download offline data for regions and farmers
 * 
 * @param {Array} regionIds - Optional list of region IDs to include
 * @returns {Promise} - Promise with offline data
 */
export const downloadOfflineData = async (regionIds = []) => {
  try {
    const params = {};
    if (regionIds && regionIds.length > 0) {
      params.regionIds = regionIds.join(',');
    }
    
    const response = await apiClient.get(`${SYNC_URL}/download`, { params });
    return {
      data: objKeysToCamel(response.data),
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Upload offline changes
 * 
 * @param {Array} changes - Array of changed farmer records
 * @returns {Promise} - Promise with sync results
 */
export const uploadOfflineChanges = async (changes) => {
  try {
    const response = await apiClient.post(`${SYNC_URL}/upload`, 
      changes.map(change => objKeysToSnake(change))
    );
    return {
      data: objKeysToCamel(response.data),
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Utility to create a sync queue for offline operations
 * 
 * @returns {Object} - Sync queue operations
 */
export const createSyncQueue = () => {
  // In-memory queue for operations
  const queue = [];
  
  // Queue an operation
  const queueOperation = (operation, data) => {
    queue.push({
      operation,
      data,
      timestamp: new Date().toISOString(),
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
    });
    
    // Store queue in localStorage for persistence
    localStorage.setItem('sync_queue', JSON.stringify(queue));
    
    return queue.length;
  };
  
  // Process queue when online
  const processQueue = async () => {
    if (!navigator.onLine || queue.length === 0) {
      return { processed: 0, failed: 0 };
    }
    
    const results = {
      processed: 0,
      failed: 0,
      errors: []
    };
    
    const pendingOperations = [...queue];
    
    // Clear queue first to avoid duplication if interrupted
    queue.length = 0;
    localStorage.setItem('sync_queue', JSON.stringify(queue));
    
    // Process each operation
    for (const op of pendingOperations) {
      try {
        await uploadOfflineChanges([op.data]);
        results.processed++;
      } catch (error) {
        // Re-queue the failed operation
        queueOperation(op.operation, op.data);
        results.failed++;
        results.errors.push({
          operation: op.operation,
          data: op.data.id,
          error: error.message
        });
      }
    }
    
    return results;
  };
  
  // Load queue from localStorage on initialization
  const loadQueue = () => {
    const savedQueue = localStorage.getItem('sync_queue');
    if (savedQueue) {
      const parsedQueue = JSON.parse(savedQueue);
      queue.push(...parsedQueue);
    }
    return queue.length;
  };
  
  // Initialize by loading queue
  loadQueue();
  
  // Return the queue API
  return {
    queueOperation,
    processQueue,
    getQueueLength: () => queue.length,
    getQueueItems: () => [...queue],
    clearQueue: () => {
      queue.length = 0;
      localStorage.setItem('sync_queue', JSON.stringify(queue));
    }
  };
};

/**
 * Check if device is online
 * 
 * @returns {boolean} - Whether device is online
 */
export const isOnline = () => {
  return navigator.onLine;
};

/**
 * Subscribe to online/offline events
 * 
 * @param {Function} onOnline - Callback when device goes online
 * @param {Function} onOffline - Callback when device goes offline
 * @returns {Function} - Unsubscribe function
 */
export const subscribeToConnectivityChanges = (onOnline, onOffline) => {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
};

/**
 * Initialize the offline sync system
 * 
 * @param {Object} options - Options for sync
 * @param {Array} options.regions - Regions to sync
 * @param {Function} options.onSyncStart - Callback when sync starts
 * @param {Function} options.onSyncComplete - Callback when sync completes
 * @param {Function} options.onSyncError - Callback when sync fails
 * @returns {Object} - Sync system API
 */
export const initializeSync = (options = {}) => {
  const {
    regions = [],
    onSyncStart = () => {},
    onSyncComplete = () => {},
    onSyncError = () => {}
  } = options;
  
  // Create sync queue
  const syncQueue = createSyncQueue();
  
  // Last sync timestamp
  let lastSyncTimestamp = localStorage.getItem('last_sync_timestamp') || null;
  
  // Cached data
  let cachedData = {};
  
  // Load cached data
  const loadCachedData = () => {
    const cachedDataString = localStorage.getItem('offline_data');
    if (cachedDataString) {
      try {
        cachedData = JSON.parse(cachedDataString);
      } catch (e) {
        console.error('Failed to parse cached data', e);
        cachedData = {};
      }
    }
    return cachedData;
  };
  
  // Save cached data
  const saveCachedData = (data) => {
    cachedData = data;
    localStorage.setItem('offline_data', JSON.stringify(data));
    localStorage.setItem('last_sync_timestamp', new Date().toISOString());
    lastSyncTimestamp = new Date().toISOString();
  };
  
  // Sync data from server
  const syncFromServer = async () => {
    if (!isOnline()) {
      throw new Error('Cannot sync while offline');
    }
    
    onSyncStart();
    
    try {
      const response = await downloadOfflineData(regions);
      saveCachedData(response.data);
      onSyncComplete(response.data);
      return response.data;
    } catch (error) {
      onSyncError(error);
      throw error;
    }
  };
  
  // Sync changes to server
  const syncToServer = async () => {
    if (!isOnline() || syncQueue.getQueueLength() === 0) {
      return { processed: 0, failed: 0 };
    }
    
    onSyncStart();
    
    try {
      const result = await syncQueue.processQueue();
      if (result.processed > 0) {
        // Refresh data from server after successful sync
        await syncFromServer();
      }
      onSyncComplete(result);
      return result;
    } catch (error) {
      onSyncError(error);
      throw error;
    }
  };
  
  // Try to sync when coming online
  const handleOnline = async () => {
    try {
      await syncToServer();
      await syncFromServer();
    } catch (error) {
      console.error('Auto-sync failed:', error);
    }
  };
  
  // Handle going offline
  const handleOffline = () => {
    console.log('Device is offline, changes will be queued for sync');
  };
  
  // Subscribe to connectivity changes
  const unsubscribe = subscribeToConnectivityChanges(handleOnline, handleOffline);
  
  // Queue a farmer change for sync
  const queueFarmerChange = (farmer) => {
    return syncQueue.queueOperation('UPDATE_FARMER', {
      ...farmer,
      lastModified: new Date().toISOString()
    });
  };
  
  // Initialize by loading cached data
  loadCachedData();
  
  // Return the sync API
  return {
    syncFromServer,
    syncToServer,
    queueFarmerChange,
    getCachedData: () => ({ ...cachedData }),
    getLastSyncTimestamp: () => lastSyncTimestamp,
    getQueueLength: syncQueue.getQueueLength,
    getQueueItems: syncQueue.getQueueItems,
    clearQueue: syncQueue.clearQueue,
    cleanup: () => {
      unsubscribe();
      syncQueue.clearQueue();
    }
  };
};

export default {
  downloadOfflineData,
  uploadOfflineChanges,
  createSyncQueue,
  isOnline,
  subscribeToConnectivityChanges,
  initializeSync
};