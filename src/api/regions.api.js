import apiClient from './apiClient';
import { objKeysToCamel, objKeysToSnake } from '../utils/helpers';

const REGIONS_URL = '/api/regions';
const MAP_URL = '/api/map';

/**
 * Get all regions with optional search
 * 
 * @param {Object} params - Search parameters
 * @param {string} params.search - Search term for region name, province, or district
 * @returns {Promise} - Promise with regions data
 */
export const getRegions = async (params = {}) => {
  try {
    const response = await apiClient.get(REGIONS_URL, { 
      params: objKeysToSnake(params) 
    });
    return {
      data: Array.isArray(response.data) ? response.data.map(region => objKeysToCamel(region)) : [],
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get region by ID
 * 
 * @param {string} id - Region ID
 * @returns {Promise} - Promise with region data
 */
export const getRegionById = async (id) => {
  try {
    const response = await apiClient.get(`${REGIONS_URL}/${id}`);
    return {
      data: objKeysToCamel(response.data),
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get regions by province
 * 
 * @param {string} province - Province name
 * @returns {Promise} - Promise with regions data
 */
export const getRegionsByProvince = async (province) => {
  try {
    const response = await apiClient.get(`${REGIONS_URL}/province/${encodeURIComponent(province)}`);
    return {
      data: Array.isArray(response.data) ? response.data.map(region => objKeysToCamel(region)) : [],
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get regions by district
 * 
 * @param {string} district - District name
 * @returns {Promise} - Promise with regions data
 */
export const getRegionsByDistrict = async (district) => {
  try {
    const response = await apiClient.get(`${REGIONS_URL}/district/${encodeURIComponent(district)}`);
    return {
      data: Array.isArray(response.data) ? response.data.map(region => objKeysToCamel(region)) : [],
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Find region by coordinates
 * 
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {Promise} - Promise with region data
 */
export const findRegionByCoordinates = async (latitude, longitude) => {
  try {
    const response = await apiClient.get(`${REGIONS_URL}/coordinates`, {
      params: { latitude, longitude }
    });
    return {
      data: objKeysToCamel(response.data),
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Find regions near coordinates
 * 
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @param {number} distanceInMeters - Distance in meters (default: 10000)
 * @returns {Promise} - Promise with regions data
 */
export const findRegionsNearCoordinates = async (latitude, longitude, distanceInMeters = 10000) => {
  try {
    const response = await apiClient.get(`${REGIONS_URL}/nearby`, {
      params: { latitude, longitude, distanceInMeters }
    });
    return {
      data: Array.isArray(response.data) ? response.data.map(region => objKeysToCamel(region)) : [],
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get regions for map
 * 
 * @returns {Promise} - Promise with regions data for map
 */
export const getRegionsForMap = async () => {
  try {
    const response = await apiClient.get(`${REGIONS_URL}/map`);
    return {
      data: Array.isArray(response.data) ? response.data.map(region => objKeysToCamel(region)) : [],
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get region statistics
 * 
 * @param {string} id - Region ID
 * @returns {Promise} - Promise with region statistics data
 */
export const getRegionStatistics = async (id) => {
  try {
    const response = await apiClient.get(`${REGIONS_URL}/${id}/stats`);
    return {
      data: objKeysToCamel(response.data),
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new region
 * 
 * @param {Object} regionData - Region data
 * @returns {Promise} - Promise with created region data
 */
export const createRegion = async (regionData) => {
  try {
    const response = await apiClient.post(REGIONS_URL, objKeysToSnake(regionData));
    return {
      data: objKeysToCamel(response.data),
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing region
 * 
 * @param {string} id - Region ID
 * @param {Object} regionData - Updated region data
 * @returns {Promise} - Promise with updated region data
 */
export const updateRegion = async (id, regionData) => {
  try {
    const response = await apiClient.put(`${REGIONS_URL}/${id}`, objKeysToSnake(regionData));
    return {
      data: objKeysToCamel(response.data),
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Update region boundary
 * 
 * @param {string} id - Region ID
 * @param {string} wkt - Well-Known Text representation of the boundary
 * @returns {Promise} - Promise with updated region data
 */
export const updateRegionBoundary = async (id, wkt) => {
  try {
    const response = await apiClient.patch(`${REGIONS_URL}/${id}/boundary`, null, {
      params: { wkt }
    });
    return {
      data: objKeysToCamel(response.data),
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a region
 * 
 * @param {string} id - Region ID
 * @returns {Promise} - Promise with response status
 */
export const deleteRegion = async (id) => {
  try {
    const response = await apiClient.delete(`${REGIONS_URL}/${id}`);
    return {
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

// Map-specific endpoints

/**
 * Get all regions for map
 * 
 * @returns {Promise} - Promise with regions map data
 */
export const getAllRegionsForMap = async () => {
  try {
    const response = await apiClient.get(`${MAP_URL}/regions`);
    return {
      data: Array.isArray(response.data) ? response.data.map(region => objKeysToCamel(region)) : [],
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get farmers in region for map
 * 
 * @param {string} regionId - Region ID
 * @returns {Promise} - Promise with farmers data
 */
export const getFarmersInRegion = async (regionId) => {
  try {
    const response = await apiClient.get(`${MAP_URL}/regions/${regionId}/farmers`);
    return {
      data: Array.isArray(response.data) ? response.data.map(farmer => objKeysToCamel(farmer)) : [],
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get farmers needing support in region for map
 * 
 * @param {string} regionId - Region ID
 * @returns {Promise} - Promise with farmers data
 */
export const getFarmersNeedingSupportInRegion = async (regionId) => {
  try {
    const response = await apiClient.get(`${MAP_URL}/regions/${regionId}/support-alert`);
    return {
      data: Array.isArray(response.data) ? response.data.map(farmer => objKeysToCamel(farmer)) : [],
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get regions with support alerts for map
 * 
 * @returns {Promise} - Promise with regions data
 */
export const getRegionsWithSupportAlerts = async () => {
  try {
    const response = await apiClient.get(`${MAP_URL}/support-alerts`);
    return {
      data: Array.isArray(response.data) ? response.data.map(region => objKeysToCamel(region)) : [],
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Generate region performance report
 * 
 * @param {string} id - Region ID
 * @returns {Promise} - Promise with region report data
 */
export const generateRegionReport = async (id) => {
  try {
    const response = await apiClient.get(`/api/reports/region/${id}`);
    return {
      data: objKeysToCamel(response.data),
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Analyze region farmers
 * 
 * @param {string} id - Region ID
 * @returns {Promise} - Promise with region analysis data
 */
export const analyzeRegionFarmers = async (id) => {
  try {
    const response = await apiClient.get(`/api/assessments/region/${id}/analysis`);
    return {
      data: objKeysToCamel(response.data),
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

export default {
  getRegions,
  getRegionById,
  getRegionsByProvince,
  getRegionsByDistrict,
  findRegionByCoordinates,
  findRegionsNearCoordinates,
  getRegionsForMap,
  getRegionStatistics,
  createRegion,
  updateRegion,
  updateRegionBoundary,
  deleteRegion,
  getAllRegionsForMap,
  getFarmersInRegion,
  getFarmersNeedingSupportInRegion,
  getRegionsWithSupportAlerts,
  generateRegionReport,
  analyzeRegionFarmers
};