import apiClient from './apiClient';

const DELIVERIES_URL = '/api/deliveries';

export const getDeliveries = async (params) => {
  return apiClient.get(DELIVERIES_URL, { params });
};

export const getDeliveryById = async (id) => {
  return apiClient.get(`${DELIVERIES_URL}/${id}`);
};

export const getDeliveriesByContract = async (contractId) => {
  return apiClient.get(`${DELIVERIES_URL}/contract/${contractId}`);
};

export const getDeliveriesByFarmer = async (farmerId) => {
  return apiClient.get(`${DELIVERIES_URL}/farmer/${farmerId}`);
};

export const recordDelivery = async (deliveryData) => {
  return apiClient.post(DELIVERIES_URL, deliveryData);
};

export const updateDelivery = async (id, deliveryData) => {
  return apiClient.put(`${DELIVERIES_URL}/${id}`, deliveryData);
};

export const deleteDelivery = async (id) => {
  return apiClient.delete(`${DELIVERIES_URL}/${id}`);
};