import apiClient from './apiClient';

const CONTRACTS_URL = '/api/contracts';

export const getContracts = async (params) => {
  return apiClient.get(CONTRACTS_URL, { params });
};

export const getContractById = async (id) => {
  return apiClient.get(`${CONTRACTS_URL}/${id}`);
};

export const getContractsByFarmer = async (farmerId) => {
  return apiClient.get(`${CONTRACTS_URL}/farmer/${farmerId}`);
};

export const getActiveContractsByFarmer = async (farmerId) => {
  return apiClient.get(`${CONTRACTS_URL}/farmer/${farmerId}/active`);
};

export const getContractsByRegion = async (regionId) => {
  return apiClient.get(`${CONTRACTS_URL}/region/${regionId}`);
};

export const getContractsByAeo = async (aeoId) => {
  return apiClient.get(`${CONTRACTS_URL}/aeo/${aeoId}`);
};

export const getContractsByType = async (type) => {
  return apiClient.get(`${CONTRACTS_URL}/type/${type}`);
};

export const getContractsByStatus = async (status) => {
  return apiClient.get(`${CONTRACTS_URL}/status/${status}`);
};

export const getExpiredContracts = async () => {
  return apiClient.get(`${CONTRACTS_URL}/expired`);
};

export const getAtRiskContracts = async () => {
  return apiClient.get(`${CONTRACTS_URL}/at-risk`);
};

export const getContractSummary = async (id) => {
  return apiClient.get(`${CONTRACTS_URL}/${id}/summary`);
};

export const createContract = async (contractData) => {
  return apiClient.post(CONTRACTS_URL, contractData);
};

export const updateContract = async (id, contractData) => {
  return apiClient.put(`${CONTRACTS_URL}/${id}`, contractData);
};

export const deactivateContract = async (id) => {
  return apiClient.patch(`${CONTRACTS_URL}/${id}/deactivate`);
};

export const deleteContract = async (id) => {
  return apiClient.delete(`${CONTRACTS_URL}/${id}`);
};