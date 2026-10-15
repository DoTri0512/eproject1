import axiosClient from '../../../api/axiosClient';
import { ENDPOINTS } from '../../../api/endpoints';

export const bookingApi = {
  create: async (data) => {
    const response = await axiosClient.post(ENDPOINTS.BOOKINGS.BASE, data);
    return response.data || response;
  },

  getMyBookings: async (params = {}) => {
    const response = await axiosClient.get(ENDPOINTS.BOOKINGS.MY, { params });
    return response.data || response;
  },

  getById: async (id) => {
    const response = await axiosClient.get(ENDPOINTS.BOOKINGS.DETAIL(id));
    return response.data || response;
  },

  cancel: async (id, reason = '') => {
    const response = await axiosClient.put(ENDPOINTS.BOOKINGS.CANCEL(id), { reason });
    return response.data || response;
  },
};

export default bookingApi;
