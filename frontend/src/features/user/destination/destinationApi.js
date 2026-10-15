import axiosClient from '../../../api/axiosClient';
import { ENDPOINTS } from '../../../api/endpoints';

export const destinationApi = {
  getAll: async (params = {}) => {
    const response = await axiosClient.get(ENDPOINTS.DESTINATIONS.BASE, { params });
    return response.data || response;
  },

  getByIdOrSlug: async (idOrSlug) => {
    const response = await axiosClient.get(ENDPOINTS.DESTINATIONS.DETAIL(idOrSlug));
    return response.data || response;
  },

  create: async (data) => {
    const response = await axiosClient.post(ENDPOINTS.DESTINATIONS.BASE, data);
    return response.data || response;
  },

  update: async (id, data) => {
    const response = await axiosClient.put(`${ENDPOINTS.DESTINATIONS.BASE}/${id}`, data);
    return response.data || response;
  },

  delete: async (id) => {
    const response = await axiosClient.delete(`${ENDPOINTS.DESTINATIONS.BASE}/${id}`);
    return response.data || response;
  },
};

export default destinationApi;
