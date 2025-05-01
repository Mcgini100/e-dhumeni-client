import apiClient from './apiClient';
import { objKeysToCamel, objKeysToSnake } from '../utils/helpers';

const CONTRACTS_URL = '/api/contracts';

/**
 * Get all contracts with optional filtering
 * 
 * @param {Object} params - Filter parameters
 * @param {string} params.farmerId - Filter by farmer ID
 * @param {string} params.type - Filter by contract type
 * @param {boolean} params.active - Filter by active status
 * @param {string} params.repaymentStatus - Filter by repayment status
 * @returns {Promise} - Promise with contracts data
 */
export const getContracts = async (params = {}) => {
  try {
    const response = await apiClient.get(CONTRACTS_URL, { 
      params: objKeysToSnake(params) 
    });
    return {
      data: Array.isArray(response.data) ? response.data.map(contract => objKeysToCamel(contract)) : [],
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get contract by ID
 * 
 * @param {string} id - Contract ID
 * @returns {Promise} - Promise with contract data
 */
export const getContractById = async (id) => {
  try {
    const response = await apiClient.get(`${CONTRACTS_URL}/${id}`);
    return {
      data: objKeysToCamel(response.data),
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get contracts by farmer
 * 
 * @param {string} farmerId - Farmer ID
 * @returns {Promise} - Promise with contracts data
 */
export const getContractsByFarmer = async (farmerId) => {
  try {
    const response = await apiClient.get(`${CONTRACTS_URL}/farmer/${farmerId}`);
    return {
      data: Array.isArray(response.data) ? response.data.map(contract => objKeysToCamel(contract)) : [],
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get active contracts by farmer
 * 
 * @param {string} farmerId - Farmer ID
 * @returns {Promise} - Promise with contracts data
 */
export const getActiveContractsByFarmer = async (farmerId) => {
  try {
    const response = await apiClient.get(`${CONTRACTS_URL}/farmer/${farmerId}/active`);
    return {
      data: Array.isArray(response.data) ? response.data.map(contract => objKeysToCamel(contract)) : [],
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get contracts by region
 * 
 * @param {string} regionId - Region ID
 * @returns {Promise} - Promise with contracts data
 */
export const getContractsByRegion = async (regionId) => {
  try {
    const response = await apiClient.get(`${CONTRACTS_URL}/region/${regionId}`);
    return {
      data: Array.isArray(response.data) ? response.data.map(contract => objKeysToCamel(contract)) : [],
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get contracts by agricultural extension officer
 * 
 * @param {string} aeoId - AEO ID
 * @returns {Promise} - Promise with contracts data
 */
export const getContractsByAeo = async (aeoId) => {
  try {
    const response = await apiClient.get(`${CONTRACTS_URL}/aeo/${aeoId}`);
    return {
      data: Array.isArray(response.data) ? response.data.map(contract => objKeysToCamel(contract)) : [],
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get contracts by type
 * 
 * @param {string} type - Contract type (BASIC, PREMIUM, COOPERATIVE, CORPORATE, GOVERNMENT)
 * @returns {Promise} - Promise with contracts data
 */
export const getContractsByType = async (type) => {
  try {
    const response = await apiClient.get(`${CONTRACTS_URL}/type/${type}`);
    return {
      data: Array.isArray(response.data) ? response.data.map(contract => objKeysToCamel(contract)) : [],
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get contracts by repayment status
 * 
 * @param {string} status - Repayment status
 * @returns {Promise} - Promise with contracts data
 */
export const getContractsByStatus = async (status) => {
  try {
    const response = await apiClient.get(`${CONTRACTS_URL}/status/${status}`);
    return {
      data: Array.isArray(response.data) ? response.data.map(contract => objKeysToCamel(contract)) : [],
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get expired contracts
 * 
 * @returns {Promise} - Promise with contracts data
 */
export const getExpiredContracts = async () => {
  try {
    const response = await apiClient.get(`${CONTRACTS_URL}/expired`);
    return {
      data: Array.isArray(response.data) ? response.data.map(contract => objKeysToCamel(contract)) : [],
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get at-risk contracts
 * 
 * @returns {Promise} - Promise with contracts data
 */
export const getAtRiskContracts = async () => {
  try {
    const response = await apiClient.get(`${CONTRACTS_URL}/at-risk`);
    return {
      data: Array.isArray(response.data) ? response.data.map(contract => objKeysToCamel(contract)) : [],
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get contract summary
 * 
 * @param {string} id - Contract ID
 * @returns {Promise} - Promise with contract summary data
 */
export const getContractSummary = async (id) => {
  try {
    const response = await apiClient.get(`${CONTRACTS_URL}/${id}/summary`);
    return {
      data: objKeysToCamel(response.data),
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new contract
 * 
 * @param {Object} contractData - Contract data
 * @returns {Promise} - Promise with created contract data
 */
export const createContract = async (contractData) => {
  try {
    const response = await apiClient.post(CONTRACTS_URL, objKeysToSnake(contractData));
    return {
      data: objKeysToCamel(response.data),
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing contract
 * 
 * @param {string} id - Contract ID
 * @param {Object} contractData - Updated contract data
 * @returns {Promise} - Promise with updated contract data
 */
export const updateContract = async (id, contractData) => {
  try {
    const response = await apiClient.put(`${CONTRACTS_URL}/${id}`, objKeysToSnake(contractData));
    return {
      data: objKeysToCamel(response.data),
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Deactivate a contract
 * 
 * @param {string} id - Contract ID
 * @returns {Promise} - Promise with updated contract data
 */
export const deactivateContract = async (id) => {
  try {
    const response = await apiClient.patch(`${CONTRACTS_URL}/${id}/deactivate`);
    return {
      data: objKeysToCamel(response.data),
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a contract
 * 
 * @param {string} id - Contract ID
 * @returns {Promise} - Promise with response status
 */
export const deleteContract = async (id) => {
  try {
    const response = await apiClient.delete(`${CONTRACTS_URL}/${id}`);
    return {
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get contracts behind schedule
 * 
 * @returns {Promise} - Promise with contracts data
 */
export const getContractsBehindSchedule = async () => {
  try {
    const response = await apiClient.get(`${CONTRACTS_URL}/behind-schedule`);
    return {
      data: Array.isArray(response.data) ? response.data.map(contract => objKeysToCamel(contract)) : [],
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get contract trends
 * 
 * @param {number} months - Number of months to analyze (default: 12)
 * @returns {Promise} - Promise with contract trends data
 */
export const getContractTrends = async (months = 12) => {
  try {
    const response = await apiClient.get(`${CONTRACTS_URL}/trends`, {
      params: { months }
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
 * Get contract insights
 * 
 * @returns {Promise} - Promise with contract insights data
 */
export const getContractInsights = async () => {
  try {
    const response = await apiClient.get(`${CONTRACTS_URL}/insights`);
    return {
      data: objKeysToCamel(response.data),
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get contract recommendations for a farmer
 * 
 * @param {string} farmerId - Farmer ID
 * @returns {Promise} - Promise with contract recommendations data
 */
export const getContractRecommendations = async (farmerId) => {
  try {
    const response = await apiClient.get(`${CONTRACTS_URL}/recommendations/${farmerId}`);
    return {
      data: objKeysToCamel(response.data),
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

export default {
  getContracts,
  getContractById,
  getContractsByFarmer,
  getActiveContractsByFarmer,
  getContractsByRegion,
  getContractsByAeo,
  getContractsByType,
  getContractsByStatus,
  getExpiredContracts,
  getAtRiskContracts,
  getContractSummary,
  createContract,
  updateContract,
  deactivateContract,
  deleteContract,
  getContractsBehindSchedule,
  getContractTrends,
  getContractInsights,
  getContractRecommendations
};