import axiosClient from '../../../api/axiosClient';
import { ENDPOINTS } from '../../../api/endpoints';

export const tourApi = {
  getAll: async (params = {}) => {
    const response = await axiosClient.get(ENDPOINTS.TOURS.BASE, { params });
    return response.data || response;
  },

  getByIdOrSlug: async (idOrSlug) => {
    const response = await axiosClient.get(ENDPOINTS.TOURS.DETAIL(idOrSlug));
    return response.data || response;
  },

  getByDestination: async (destinationId) => {
    const response = await axiosClient.get(ENDPOINTS.TOURS.BY_DESTINATION(destinationId));
    return response.data || response;
  },

  create: async (data) => {
    const response = await axiosClient.post(ENDPOINTS.TOURS.BASE, data);
    return response.data || response;
  },

  update: async (id, data) => {
    const response = await axiosClient.put(ENDPOINTS.TOURS.DETAIL(id), data);
    return response.data || response;
  },

  delete: async (id) => {
    const response = await axiosClient.delete(ENDPOINTS.TOURS.DETAIL(id));
    return response.data || response;
  },
};

export default tourApi;
