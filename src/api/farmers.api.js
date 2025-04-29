import apiClient from './apiClient';

const FARMERS_URL = '/api/farmers';

export const getFarmers = async (params) => {
  return apiClient.get(FARMERS_URL, { params });
};

export const getFarmerById = async (id) => {
  return apiClient.get(`${FARMERS_URL}/${id}`);
};

export const getFarmersByRegion = async (regionId) => {
  return apiClient.get(`${FARMERS_URL}/region/${regionId}`);
};

export const getFarmersByAeo = async (aeoId) => {
  return apiClient.get(`${FARMERS_URL}/aeo/${aeoId}`);
};

export const getFarmersNeedingSupport = async () => {
  return apiClient.get(`${FARMERS_URL}/support`);
};

export const createFarmer = async (farmerData) => {
  return apiClient.post(FARMERS_URL, farmerData);
};

export const updateFarmer = async (id, farmerData) => {
  return apiClient.put(`${FARMERS_URL}/${id}`, farmerData);
};

export const updateFarmerSupportStatus = async (id, needsSupport, reason) => {
  return apiClient.patch(
    `${FARMERS_URL}/${id}/support-status?needs_support=${needsSupport}${reason ? `&reason=${encodeURIComponent(reason)}` : ''}`
  );
};

export const deleteFarmer = async (id) => {
  return apiClient.delete(`${FARMERS_URL}/${id}`);
};