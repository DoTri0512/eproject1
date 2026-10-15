import axiosClient from '../../../api/axiosClient';
import { ENDPOINTS } from '../../../api/endpoints';

export const guideApi = {
  getAll: async (params = {}) => {
    const response = await axiosClient.get(ENDPOINTS.GUIDES.BASE, { params });
    return response.data || response;
  },

  getByIdOrSlug: async (idOrSlug) => {
    const response = await axiosClient.get(ENDPOINTS.GUIDES.DETAIL(idOrSlug));
    return response.data || response;
  },
};

export default guideApi;
