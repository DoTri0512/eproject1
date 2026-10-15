export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  DESTINATIONS: {
    BASE: '/destinations',
    DETAIL: (idOrSlug) => `/destinations/${idOrSlug}`,
  },
  TOURS: {
    BASE: '/tours',
    DETAIL: (idOrSlug) => `/tours/${idOrSlug}`,
    BY_DESTINATION: (destinationId) => `/tours/destination/${destinationId}`,
  },
  BOOKINGS: {
    BASE: '/bookings',
    MY: '/bookings/my-bookings',
    DETAIL: (id) => `/bookings/${id}`,
    UPDATE_STATUS: (id) => `/bookings/${id}/status`,
    CANCEL: (id) => `/bookings/${id}/cancel`,
  },
  BOOKING_PLANS: {
    BASE: '/booking-plans',
    DETAIL: (id) => `/booking-plans/${id}`,
    ASSIGN_GUIDE: (id) => `/booking-plans/${id}/assign-guide`,
    STATUS: (id) => `/booking-plans/${id}/status`,
    PASSENGERS: (id) => `/booking-plans/${id}/passengers`,
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    UPDATE_ROLE: (id) => `/admin/users/${id}/role`,
    DELETE_USER: (id) => `/admin/users/${id}`,
  },
  COLLECTIONS: {
    BASE: '/collections',
    DETAIL: (idOrSlug) => `/collections/${idOrSlug}`,
  },
  GUIDES: {
    BASE: '/guides',
    DETAIL: (idOrSlug) => `/guides/${idOrSlug}`,
  },
  FAVOURITES: {
    BASE: '/favourites',
    SYNC: '/favourites/sync',
    CHECK: (destinationId) => `/favourites/check/${destinationId}`,
    REMOVE: (destinationId) => `/favourites/${destinationId}`,
  },
  CUSTOMERS: {
    BASE: '/customers',
    ME: '/customers/me',
    DETAIL: (id) => `/customers/${id}`,
  },
  UPLOAD: {
    SINGLE: '/upload/single',
    MULTIPLE: '/upload/multiple',
  },
};

export default ENDPOINTS;
