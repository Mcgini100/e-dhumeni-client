import apiClient from './apiClient';

const REGIONS_URL = '/api/regions';
const MAP_URL = '/api/map';

export const getRegions = async (params) => {
  return apiClient.get(REGIONS_URL, { params });
};

export const getRegionById = async (id) => {
  return apiClient.get(`${REGIONS_URL}/${id}`);
};

export const getRegionsByProvince = async (province) => {
  return apiClient.get(`${REGIONS_URL}/province/${province}`);
};

export const getRegionsByDistrict = async (district) => {
  return apiClient.get(`${REGIONS_URL}/district/${district}`);
};

export const findRegionByCoordinates = async (latitude, longitude) => {
  return apiClient.get(`${REGIONS_URL}/coordinates`, {
    params: { latitude, longitude }
  });
};

export const findRegionsNearCoordinates = async (latitude, longitude, distanceInMeters = 10000) => {
  return apiClient.get(`${REGIONS_URL}/nearby`, {
    params: { latitude, longitude, distanceInMeters }
  });
};

export const getRegionsForMap = async () => {
  return apiClient.get(`${REGIONS_URL}/map`);
};

export const getRegionStatistics = async (id) => {
  return apiClient.get(`${REGIONS_URL}/${id}/stats`);
};

export const createRegion = async (regionData) => {
  return apiClient.post(REGIONS_URL, regionData);
};

export const updateRegion = async (id, regionData) => {
  return apiClient.put(`${REGIONS_URL}/${id}`, regionData);
};

export const updateRegionBoundary = async (id, wkt) => {
  return apiClient.patch(`${REGIONS_URL}/${id}/boundary`, null, {
    params: { wkt }
  });
};

export const deleteRegion = async (id) => {
  return apiClient.delete(`${REGIONS_URL}/${id}`);
};

// Map-specific endpoints
export const getAllRegionsForMap = async () => {
  return apiClient.get(`${MAP_URL}/regions`);
};

export const getFarmersInRegion = async (regionId) => {
  return apiClient.get(`${MAP_URL}/regions/${regionId}/farmers`);
};

export const getFarmersNeedingSupportInRegion = async (regionId) => {
  return apiClient.get(`${MAP_URL}/regions/${regionId}/support-alert`);
};

export const getRegionsWithSupportAlerts = async () => {
  return apiClient.get(`${MAP_URL}/support-alerts`);
};