import axiosClient from '../../../api/axiosClient';
import { ENDPOINTS } from '../../../api/endpoints';

export const collectionApi = {
  getAll: async (params = {}) => {
    const response = await axiosClient.get(ENDPOINTS.COLLECTIONS.BASE, { params });
    return response.data || response;
  },

  getByIdOrSlug: async (idOrSlug) => {
    const response = await axiosClient.get(ENDPOINTS.COLLECTIONS.DETAIL(idOrSlug));
    return response.data || response;
  },
};

export default collectionApi;
