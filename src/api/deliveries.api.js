import apiClient from './apiClient';
import { objKeysToCamel, objKeysToSnake } from '../utils/helpers';

const DELIVERIES_URL = '/api/deliveries';

/**
 * Get all deliveries with optional filtering
 * 
 * @param {Object} params - Filter parameters
 * @param {string} params.contractId - Filter by contract ID
 * @param {string} params.farmerId - Filter by farmer ID
 * @returns {Promise} - Promise with deliveries data
 */
export const getDeliveries = async (params = {}) => {
  try {
    const response = await apiClient.get(DELIVERIES_URL, { 
      params: objKeysToSnake(params) 
    });
    return {
      data: Array.isArray(response.data) ? response.data.map(delivery => objKeysToCamel(delivery)) : [],
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get delivery by ID
 * 
 * @param {string} id - Delivery ID
 * @returns {Promise} - Promise with delivery data
 */
export const getDeliveryById = async (id) => {
  try {
    const response = await apiClient.get(`${DELIVERIES_URL}/${id}`);
    return {
      data: objKeysToCamel(response.data),
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get deliveries by contract
 * 
 * @param {string} contractId - Contract ID
 * @returns {Promise} - Promise with deliveries data
 */
export const getDeliveriesByContract = async (contractId) => {
  try {
    const response = await apiClient.get(`${DELIVERIES_URL}/contract/${contractId}`);
    return {
      data: Array.isArray(response.data) ? response.data.map(delivery => objKeysToCamel(delivery)) : [],
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get deliveries by farmer
 * 
 * @param {string} farmerId - Farmer ID
 * @returns {Promise} - Promise with deliveries data
 */
export const getDeliveriesByFarmer = async (farmerId) => {
  try {
    const response = await apiClient.get(`${DELIVERIES_URL}/farmer/${farmerId}`);
    return {
      data: Array.isArray(response.data) ? response.data.map(delivery => objKeysToCamel(delivery)) : [],
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Record a new delivery
 * 
 * @param {Object} deliveryData - Delivery data
 * @returns {Promise} - Promise with created delivery data
 */
export const recordDelivery = async (deliveryData) => {
  try {
    const response = await apiClient.post(DELIVERIES_URL, objKeysToSnake(deliveryData));
    return {
      data: objKeysToCamel(response.data),
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing delivery
 * 
 * @param {string} id - Delivery ID
 * @param {Object} deliveryData - Updated delivery data
 * @returns {Promise} - Promise with updated delivery data
 */
export const updateDelivery = async (id, deliveryData) => {
  try {
    const response = await apiClient.put(`${DELIVERIES_URL}/${id}`, objKeysToSnake(deliveryData));
    return {
      data: objKeysToCamel(response.data),
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a delivery
 * 
 * @param {string} id - Delivery ID
 * @returns {Promise} - Promise with response status
 */
export const deleteDelivery = async (id) => {
  try {
    const response = await apiClient.delete(`${DELIVERIES_URL}/${id}`);
    return {
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get delivery quality statistics
 * 
 * @returns {Promise} - Promise with delivery quality statistics
 */
export const getDeliveryQualityStatistics = async () => {
  try {
    const response = await apiClient.get('/api/dashboard/deliveries/quality');
    return {
      data: objKeysToCamel(response.data),
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Verify a delivery (for AEOs and admins)
 * 
 * @param {string} id - Delivery ID
 * @returns {Promise} - Promise with verified delivery data
 */
export const verifyDelivery = async (id) => {
  try {
    const response = await apiClient.patch(`${DELIVERIES_URL}/${id}/verify`);
    return {
      data: objKeysToCamel(response.data),
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Reject a delivery verification (for AEOs and admins)
 * 
 * @param {string} id - Delivery ID
 * @param {string} reason - Rejection reason
 * @returns {Promise} - Promise with rejected delivery data
 */
export const rejectDelivery = async (id, reason) => {
  try {
    const response = await apiClient.patch(`${DELIVERIES_URL}/${id}/reject`, null, {
      params: { reason }
    });
    return {
      data: objKeysToCamel(response.data),
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

export default {
  getDeliveries,
  getDeliveryById,
  getDeliveriesByContract,
  getDeliveriesByFarmer,
  recordDelivery,
  updateDelivery,
  deleteDelivery,
  getDeliveryQualityStatistics,
  verifyDelivery,
  rejectDelivery
};