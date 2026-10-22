import axiosClient from '../../api/axiosClient';
import { ENDPOINTS } from '../../api/endpoints';

export const adminApi = {
  // --- TOURS ---
  getTours: async (params = {}) => {
    const response = await axiosClient.get(ENDPOINTS.TOURS.BASE, { params });
    return response.data || response;
  },

  getTourByIdOrSlug: async (idOrSlug) => {
    const response = await axiosClient.get(ENDPOINTS.TOURS.DETAIL(idOrSlug));
    return response.data || response;
  },

  createTour: async (tourData) => {
    const response = await axiosClient.post(ENDPOINTS.TOURS.BASE, tourData);
    return response.data || response;
  },

  updateTour: async (id, tourData) => {
    const response = await axiosClient.put(ENDPOINTS.TOURS.DETAIL(id), tourData);
    return response.data || response;
  },

  deleteTour: async (id) => {
    const response = await axiosClient.delete(ENDPOINTS.TOURS.DETAIL(id));
    return response.data || response;
  },

  // --- BOOKINGS ---
  getBookings: async (params = {}) => {
    const response = await axiosClient.get(ENDPOINTS.BOOKINGS.BASE, { params });
    return response.data || response;
  },

  getBookingById: async (id) => {
    const response = await axiosClient.get(ENDPOINTS.BOOKINGS.DETAIL(id));
    return response.data || response;
  },

  updateBookingStatus: async (id, statusData) => {
    // statusData: { bookingStatus, paymentStatus }
    const response = await axiosClient.put(ENDPOINTS.BOOKINGS.UPDATE_STATUS(id), statusData);
    return response.data || response;
  },

  deleteBooking: async (id) => {
    const response = await axiosClient.delete(ENDPOINTS.BOOKINGS.DETAIL(id));
    return response.data || response;
  },

  // --- BOOKING PLANS (ĐOÀN KHỞI HÀNH) ---
  getBookingPlans: async (params = {}) => {
    const response = await axiosClient.get(ENDPOINTS.BOOKING_PLANS.BASE, { params });
    return response.data || response;
  },

  getBookingPlanById: async (id) => {
    const response = await axiosClient.get(ENDPOINTS.BOOKING_PLANS.DETAIL(id));
    return response.data || response;
  },

  createBookingPlan: async (planData) => {
    const response = await axiosClient.post(ENDPOINTS.BOOKING_PLANS.BASE, planData);
    return response.data || response;
  },

  syncBookingPlans: async () => {
    const response = await axiosClient.post(ENDPOINTS.BOOKING_PLANS.SYNC);
    return response.data || response;
  },

  assignGuideToPlan: async (id, guideId) => {
    const response = await axiosClient.put(ENDPOINTS.BOOKING_PLANS.ASSIGN_GUIDE(id), { guideId });
    return response.data || response;
  },

  updatePlanStatus: async (id, status) => {
    const response = await axiosClient.put(ENDPOINTS.BOOKING_PLANS.STATUS(id), { status });
    return response.data || response;
  },

  addPassengerToPlan: async (id, passengerData) => {
    const response = await axiosClient.post(ENDPOINTS.BOOKING_PLANS.PASSENGERS(id), passengerData);
    return response.data || response;
  },

  deleteBookingPlan: async (id) => {
    const response = await axiosClient.delete(ENDPOINTS.BOOKING_PLANS.DETAIL(id));
    return response.data || response;
  },

  // --- HELPERS (Guides & Destinations for dropdowns) ---
  getGuides: async (params = {}) => {
    const response = await axiosClient.get(ENDPOINTS.GUIDES.BASE, { params });
    return response.data || response;
  },

  getDestinations: async (params = {}) => {
    const response = await axiosClient.get(ENDPOINTS.DESTINATIONS.BASE, { params });
    return response.data || response;
  },
};

export default adminApi;
