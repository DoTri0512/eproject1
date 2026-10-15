import axiosClient from '../../../api/axiosClient';
import { ENDPOINTS } from '../../../api/endpoints';

export const profileApi = {
  getUserProfile: async () => {
    const response = await axiosClient.get(ENDPOINTS.AUTH.ME);
    return response.data || response;
  },

  updateUserProfile: async (data) => {
    // data: { name, avatar }
    const response = await axiosClient.put(ENDPOINTS.AUTH.ME, data);
    return response.data || response;
  },

  changePassword: async (data) => {
    // data: { currentPassword, newPassword }
    const response = await axiosClient.put(ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
    return response.data || response;
  },

  getCustomerProfile: async () => {
    const response = await axiosClient.get(ENDPOINTS.CUSTOMERS.ME);
    return response.data || response;
  },

  saveCustomerProfile: async (customerData) => {
    // customerData: { fullName, email, phone, address, city, country, idCardNumber }
    const response = await axiosClient.post(ENDPOINTS.CUSTOMERS.ME, customerData);
    return response.data || response;
  },

  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await axiosClient.post(ENDPOINTS.UPLOAD.SINGLE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data || response;
  },

  getMyBookings: async () => {
    const response = await axiosClient.get(ENDPOINTS.BOOKINGS.MY);
    return response.data || response;
  },

  getMyFavourites: async () => {
    const response = await axiosClient.get(ENDPOINTS.FAVOURITES.BASE);
    return response.data || response;
  },
};

export default profileApi;
