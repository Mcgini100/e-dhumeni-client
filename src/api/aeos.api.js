import apiClient from './apiClient';
import { objKeysToCamel, objKeysToSnake } from '../utils/helpers';

const AEOS_URL = '/api/aeos';

/**
 * Get all Agricultural Extension Officers (AEOs) with optional search
 * 
 * @param {Object} params - Search parameters
 * @param {string} params.search - Search term for AEO name, email, or employee ID
 * @returns {Promise} - Promise with AEOs data
 */
export const getAeos = async (params = {}) => {
  try {
    const response = await apiClient.get(AEOS_URL, { 
      params: objKeysToSnake(params) 
    });
    return {
      data: Array.isArray(response.data) ? response.data.map(aeo => objKeysToCamel(aeo)) : [],
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get AEO by ID
 * 
 * @param {string} id - AEO ID
 * @returns {Promise} - Promise with AEO data
 */
export const getAeoById = async (id) => {
  try {
    const response = await apiClient.get(`${AEOS_URL}/${id}`);
    return {
      data: objKeysToCamel(response.data),
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get AEOs by region
 * 
 * @param {string} regionId - Region ID
 * @returns {Promise} - Promise with AEOs data
 */
export const getAeosByRegion = async (regionId) => {
  try {
    const response = await apiClient.get(`${AEOS_URL}/region/${regionId}`);
    return {
      data: Array.isArray(response.data) ? response.data.map(aeo => objKeysToCamel(aeo)) : [],
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get AEOs with farmers needing support
 * 
 * @returns {Promise} - Promise with AEOs data
 */
export const getAeosWithFarmersNeedingSupport = async () => {
  try {
    const response = await apiClient.get(`${AEOS_URL}/support-needed`);
    return {
      data: Array.isArray(response.data) ? response.data.map(aeo => objKeysToCamel(aeo)) : [],
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new AEO
 * 
 * @param {Object} aeoData - AEO data
 * @returns {Promise} - Promise with created AEO data
 */
export const createAeo = async (aeoData) => {
  try {
    const response = await apiClient.post(AEOS_URL, objKeysToSnake(aeoData));
    return {
      data: objKeysToCamel(response.data),
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing AEO
 * 
 * @param {string} id - AEO ID
 * @param {Object} aeoData - Updated AEO data
 * @returns {Promise} - Promise with updated AEO data
 */
export const updateAeo = async (id, aeoData) => {
  try {
    const response = await apiClient.put(`${AEOS_URL}/${id}`, objKeysToSnake(aeoData));
    return {
      data: objKeysToCamel(response.data),
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Assign region to AEO
 * 
 * @param {string} id - AEO ID
 * @param {string} regionId - Region ID
 * @returns {Promise} - Promise with updated AEO data
 */
export const assignRegionToAeo = async (id, regionId) => {
  try {
    const response = await apiClient.post(`${AEOS_URL}/${id}/regions/${regionId}`);
    return {
      data: objKeysToCamel(response.data),
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Unassign region from AEO
 * 
 * @param {string} id - AEO ID
 * @param {string} regionId - Region ID
 * @returns {Promise} - Promise with updated AEO data
 */
export const unassignRegionFromAeo = async (id, regionId) => {
  try {
    const response = await apiClient.delete(`${AEOS_URL}/${id}/regions/${regionId}`);
    return {
      data: objKeysToCamel(response.data),
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Delete an AEO
 * 
 * @param {string} id - AEO ID
 * @returns {Promise} - Promise with response status
 */
export const deleteAeo = async (id) => {
  try {
    const response = await apiClient.delete(`${AEOS_URL}/${id}`);
    return {
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get AEO statistics
 * 
 * @param {string} id - AEO ID
 * @returns {Promise} - Promise with AEO statistics data
 */
export const getAeoStatistics = async (id) => {
  try {
    const response = await apiClient.get(`${AEOS_URL}/${id}/stats`);
    return {
      data: objKeysToCamel(response.data),
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get farmers assigned to AEO
 * 
 * @param {string} id - AEO ID
 * @returns {Promise} - Promise with farmers data
 */
export const getFarmersByAeo = async (id) => {
  try {
    const response = await apiClient.get(`/api/farmers/aeo/${id}`);
    return {
      data: Array.isArray(response.data) ? response.data.map(farmer => objKeysToCamel(farmer)) : [],
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get contracts for farmers assigned to AEO
 * 
 * @param {string} id - AEO ID
 * @returns {Promise} - Promise with contracts data
 */
export const getContractsByAeo = async (id) => {
  try {
    const response = await apiClient.get(`/api/contracts/aeo/${id}`);
    return {
      data: Array.isArray(response.data) ? response.data.map(contract => objKeysToCamel(contract)) : [],
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

export default {
  getAeos,
  getAeoById,
  getAeosByRegion,
  getAeosWithFarmersNeedingSupport,
  createAeo,
  updateAeo,
  assignRegionToAeo,
  unassignRegionFromAeo,
  deleteAeo,
  getAeoStatistics,
  getFarmersByAeo,
  getContractsByAeo
};