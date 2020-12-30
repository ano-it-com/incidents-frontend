import buildUrlParams from '@/utils/build-url-params';
import http from '../http';

export const getIncidentsList = async (filters = {}, sort = {}, page = 1, perPage = 15) => {
  try {
    const stringParams = buildUrlParams({
      filters,
      sort,
      page,
      perPage,
    });

    const response = await http.get(`incident?${stringParams}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getMeta = async () => {
  const response = await http.get('incident/options');
  return response.data;
};

export const getIncident = async (incidentId) => {
  try {
    const response = await http.get(`incident/${incidentId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
