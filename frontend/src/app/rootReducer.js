import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import destinationReducer from '../features/user/destination/destinationSlice';
import tourReducer from '../features/user/tour/tourSlice';
import guideReducer from '../features/user/guide/guideSlice';
import collectionReducer from '../features/user/collection/collectionSlice';
import favouriteReducer from '../features/user/favourite/favouriteSlice';
import bookingReducer from '../features/user/booking/bookingSlice';
import dashboardReducer from '../features/admin/dashboard/dashboardSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  destination: destinationReducer,
  tour: tourReducer,
  guide: guideReducer,
  collection: collectionReducer,
  favourite: favouriteReducer,
  booking: bookingReducer,
  dashboard: dashboardReducer,
});

export default rootReducer;
