import axiosClient from '../../api/axiosClient';
import { ENDPOINTS } from '../../api/endpoints';

export const authApi = {
  login: async (credentials) => {
    // credentials: { email, password }
    const response = await axiosClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data || response;
  },

  register: async (userData) => {
    // userData: { name, email, password, phone }
    const response = await axiosClient.post(ENDPOINTS.AUTH.REGISTER, userData);
    return response.data || response;
  },

  logout: async () => {
    const response = await axiosClient.post(ENDPOINTS.AUTH.LOGOUT);
    return response.data || response;
  },

  getProfile: async () => {
    const response = await axiosClient.get(ENDPOINTS.AUTH.ME);
    return response.data || response;
  },

  updateProfile: async (data) => {
    const response = await axiosClient.put(ENDPOINTS.AUTH.ME, data);
    return response.data || response;
  },

  changePassword: async (data) => {
    const response = await axiosClient.put(ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
    return response.data || response;
  },
};

export default authApi;
