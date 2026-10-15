import axiosClient from '../../../api/axiosClient';
import { ENDPOINTS } from '../../../api/endpoints';

export const dashboardApi = {
  getStats: async () => {
    const response = await axiosClient.get(ENDPOINTS.ADMIN.DASHBOARD);
    return response.data || response;
  },

  getAllUsers: async (params = {}) => {
    const response = await axiosClient.get(ENDPOINTS.ADMIN.USERS, { params });
    return response.data || response;
  },
};

export default dashboardApi;
