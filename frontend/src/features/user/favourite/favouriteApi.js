import axiosClient from '../../../api/axiosClient';
import { ENDPOINTS } from '../../../api/endpoints';

export const favouriteApi = {
  getMyFavourites: async () => {
    const response = await axiosClient.get(ENDPOINTS.FAVOURITES.BASE);
    return response.data || response;
  },

  add: async (destinationId) => {
    const response = await axiosClient.post(ENDPOINTS.FAVOURITES.BASE, { destinationId });
    return response.data || response;
  },

  remove: async (destinationId) => {
    const response = await axiosClient.delete(ENDPOINTS.FAVOURITES.REMOVE(destinationId));
    return response.data || response;
  },

  check: async (destinationId) => {
    const response = await axiosClient.get(ENDPOINTS.FAVOURITES.CHECK(destinationId));
    return response.data || response;
  },

  sync: async (destinationIds) => {
    const response = await axiosClient.post(ENDPOINTS.FAVOURITES.SYNC, { destinationIds });
    return response.data || response;
  },
};

export default favouriteApi;
