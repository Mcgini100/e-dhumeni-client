import apiClient from './apiClient';

const ALERTS_URL = '/api/alerts';

export const getAllFarmersNeedingSupport = async () => {
  return apiClient.get(`${ALERTS_URL}/farmers`);
};

export const getFarmersNeedingSupportByRegion = async (regionId) => {
  return apiClient.get(`${ALERTS_URL}/farmers/region/${regionId}`);
};

export const getFarmersWithRepaymentIssues = async () => {
  return apiClient.get(`${ALERTS_URL}/farmers/repayment-issues`);
};

export const getAtRiskContracts = async () => {
  return apiClient.get(`${ALERTS_URL}/contracts/at-risk`);
};

export const getAlertSummary = async () => {
  return apiClient.get(`${ALERTS_URL}/summary`);
};

export const runSupportAssessment = async () => {
  return apiClient.post(`${ALERTS_URL}/assess`);
};

export const markFarmerForSupport = async (id, reason) => {
  return apiClient.post(`${ALERTS_URL}/farmer/${id}/mark`, null, {
    params: { reason }
  });
};

export const resolveFarmerSupport = async (id, resolutionNotes) => {
  return apiClient.post(`${ALERTS_URL}/farmer/${id}/resolve`, null, {
    params: { resolutionNotes }
  });
};

export const assessIndividualFarmer = async (id) => {
  return apiClient.post(`${ALERTS_URL}/assess/${id}`);
};