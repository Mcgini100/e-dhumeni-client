import apiClient from './apiClient';
import { objKeysToCamel, objKeysToSnake } from '../utils/helpers';

const FARMERS_URL = '/api/farmers';

/**
 * Get all farmers with optional filtering
 * 
 * @param {Object} params - Filter parameters
 * @param {string} params.name - Filter by name
 * @param {string} params.region - Filter by region name
 * @param {string} params.province - Filter by province
 * @param {string} params.ward - Filter by ward
 * @param {boolean} params.needsSupport - Filter by support status
 * @returns {Promise} - Promise with farmers data
 */
export const getFarmers = async (params = {}) => {
  try {
    const response = await apiClient.get(FARMERS_URL, { 
      params: objKeysToSnake(params) 
    });
    return {
      data: Array.isArray(response.data) ? response.data.map(farmer => objKeysToCamel(farmer)) : [],
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get farmer by ID
 * 
 * @param {string} id - Farmer ID
 * @returns {Promise} - Promise with farmer data
 */
export const getFarmerById = async (id) => {
  try {
    const response = await apiClient.get(`${FARMERS_URL}/${id}`);
    return {
      data: objKeysToCamel(response.data),
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get farmers by region
 * 
 * @param {string} regionId - Region ID
 * @returns {Promise} - Promise with farmers data
 */
export const getFarmersByRegion = async (regionId) => {
  try {
    const response = await apiClient.get(`${FARMERS_URL}/region/${regionId}`);
    return {
      data: Array.isArray(response.data) ? response.data.map(farmer => objKeysToCamel(farmer)) : [],
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get farmers by agricultural extension officer
 * 
 * @param {string} aeoId - AEO ID
 * @returns {Promise} - Promise with farmers data
 */
export const getFarmersByAeo = async (aeoId) => {
  try {
    const response = await apiClient.get(`${FARMERS_URL}/aeo/${aeoId}`);
    return {
      data: Array.isArray(response.data) ? response.data.map(farmer => objKeysToCamel(farmer)) : [],
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get farmers needing support
 * 
 * @returns {Promise} - Promise with farmers data
 */
export const getFarmersNeedingSupport = async () => {
  try {
    const response = await apiClient.get(`${FARMERS_URL}/support`);
    return {
      data: Array.isArray(response.data) ? response.data.map(farmer => objKeysToCamel(farmer)) : [],
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new farmer
 * 
 * @param {Object} farmerData - Farmer data
 * @returns {Promise} - Promise with created farmer data
 */
export const createFarmer = async (farmerData) => {
  try {
    const response = await apiClient.post(FARMERS_URL, objKeysToSnake(farmerData));
    return {
      data: objKeysToCamel(response.data),
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing farmer
 * 
 * @param {string} id - Farmer ID
 * @param {Object} farmerData - Updated farmer data
 * @returns {Promise} - Promise with updated farmer data
 */
export const updateFarmer = async (id, farmerData) => {
  try {
    const response = await apiClient.put(`${FARMERS_URL}/${id}`, objKeysToSnake(farmerData));
    return {
      data: objKeysToCamel(response.data),
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Update farmer support status
 * 
 * @param {string} id - Farmer ID
 * @param {boolean} needsSupport - Support status
 * @param {string} reason - Reason for support (optional)
 * @returns {Promise} - Promise with updated farmer data
 */
export const updateFarmerSupportStatus = async (id, needsSupport, reason = '') => {
  try {
    const params = {
      needs_support: needsSupport
    };
    
    if (reason) {
      params.reason = reason;
    }
    
    const response = await apiClient.patch(`${FARMERS_URL}/${id}/support-status`, null, { params });
    return {
      data: objKeysToCamel(response.data),
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a farmer
 * 
 * @param {string} id - Farmer ID
 * @returns {Promise} - Promise with response status
 */
export const deleteFarmer = async (id) => {
  try {
    const response = await apiClient.delete(`${FARMERS_URL}/${id}`);
    return {
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Calculate farmer risk score
 * 
 * @param {string} id - Farmer ID
 * @returns {Promise} - Promise with risk score data
 */
export const calculateFarmerRiskScore = async (id) => {
  try {
    const response = await apiClient.get(`/api/assessments/farmer/${id}/risk-score`);
    return {
      data: objKeysToCamel(response.data),
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Generate farmer performance report
 * 
 * @param {string} id - Farmer ID
 * @returns {Promise} - Promise with performance report data
 */
export const generateFarmerReport = async (id) => {
  try {
    const response = await apiClient.get(`/api/reports/farmer/${id}`);
    return {
      data: objKeysToCamel(response.data),
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

export default {
  getFarmers,
  getFarmerById,
  getFarmersByRegion,
  getFarmersByAeo,
  getFarmersNeedingSupport,
  createFarmer,
  updateFarmer,
  updateFarmerSupportStatus,
  deleteFarmer,
  calculateFarmerRiskScore,
  generateFarmerReport
};