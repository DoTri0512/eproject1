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

  // --- GUIDES ---
  getGuides: async (params = {}) => {
    const response = await axiosClient.get(ENDPOINTS.GUIDES.BASE, { params });
    return response.data || response;
  },

  getGuideByIdOrSlug: async (idOrSlug) => {
    const response = await axiosClient.get(ENDPOINTS.GUIDES.DETAIL(idOrSlug));
    return response.data || response;
  },

  createGuide: async (guideData) => {
    const response = await axiosClient.post(ENDPOINTS.GUIDES.BASE, guideData);
    return response.data || response;
  },

  updateGuide: async (id, guideData) => {
    const response = await axiosClient.put(ENDPOINTS.GUIDES.DETAIL(id), guideData);
    return response.data || response;
  },

  deleteGuide: async (id) => {
    const response = await axiosClient.delete(ENDPOINTS.GUIDES.DETAIL(id));
    return response.data || response;
  },

  getGuideDestinations: async (idOrSlug) => {
    const response = await axiosClient.get(ENDPOINTS.GUIDES.DESTINATIONS(idOrSlug));
    return response.data || response;
  },

  addDestinationsToGuide: async (id, destinationIds) => {
    const response = await axiosClient.post(ENDPOINTS.GUIDES.DESTINATIONS(id), { destinationIds });
    return response.data || response;
  },

  setGuideDestinations: async (id, destinationIds) => {
    const response = await axiosClient.put(ENDPOINTS.GUIDES.DESTINATIONS(id), { destinationIds });
    return response.data || response;
  },

  removeDestinationFromGuide: async (id, destinationId) => {
    const response = await axiosClient.delete(ENDPOINTS.GUIDES.REMOVE_DESTINATION(id, destinationId));
    return response.data || response;
  },

  // --- COLLECTIONS ---
  getCollections: async (params = {}) => {
    const response = await axiosClient.get(ENDPOINTS.COLLECTIONS.BASE, { params });
    return response.data || response;
  },

  getCollectionByIdOrSlug: async (idOrSlug) => {
    const response = await axiosClient.get(ENDPOINTS.COLLECTIONS.DETAIL(idOrSlug));
    return response.data || response;
  },

  createCollection: async (collectionData) => {
    const response = await axiosClient.post(ENDPOINTS.COLLECTIONS.BASE, collectionData);
    return response.data || response;
  },

  updateCollection: async (id, collectionData) => {
    const response = await axiosClient.put(ENDPOINTS.COLLECTIONS.DETAIL(id), collectionData);
    return response.data || response;
  },

  deleteCollection: async (id) => {
    const response = await axiosClient.delete(ENDPOINTS.COLLECTIONS.DETAIL(id));
    return response.data || response;
  },

  getCollectionDestinations: async (idOrSlug) => {
    const response = await axiosClient.get(ENDPOINTS.COLLECTIONS.DESTINATIONS(idOrSlug));
    return response.data || response;
  },

  addDestinationsToCollection: async (id, destinationIds) => {
    const response = await axiosClient.post(ENDPOINTS.COLLECTIONS.DESTINATIONS(id), { destinationIds });
    return response.data || response;
  },

  removeDestinationFromCollection: async (id, destinationId) => {
    const response = await axiosClient.delete(ENDPOINTS.COLLECTIONS.REMOVE_DESTINATION(id, destinationId));
    return response.data || response;
  },

  // --- CONTACTS ---
  getContacts: async (params = {}) => {
    const response = await axiosClient.get(ENDPOINTS.CONTACTS.BASE, { params });
    return response.data || response;
  },

  updateContactStatus: async (id, status) => {
    const response = await axiosClient.put(ENDPOINTS.CONTACTS.UPDATE_STATUS(id), { status });
    return response.data || response;
  },

  deleteContact: async (id) => {
    const response = await axiosClient.delete(ENDPOINTS.CONTACTS.DETAIL(id));
    return response.data || response;
  },

  // --- HELPERS (Destinations for dropdowns) ---
  getDestinations: async (params = {}) => {
    const response = await axiosClient.get(ENDPOINTS.DESTINATIONS.BASE, { params });
    return response.data || response;
  },
};

export default adminApi;
