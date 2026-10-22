import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import AdminLayout from '../components/layout/AdminLayout';
import AdminRoute from '../components/guard/AdminRoute';
import PrivateRoute from '../components/guard/PrivateRoute';

// User / Auth Pages
import Home from '../features/user/home/pages/Home';
import DestinationsList from '../features/user/destination/pages/DestinationsList';
import DestinationDetail from '../features/user/destination/pages/DestinationDetail';
import TravelGuides from '../features/user/guide/pages/TravelGuides';
import SeasonalCollections from '../features/user/collection/pages/SeasonalCollections';
import RegionExplorer from '../features/user/region/pages/RegionExplorer';
import FavouritesList from '../features/user/favourite/pages/FavouritesList';
import TourBooking from '../features/user/booking/pages/TourBooking';
import MyBookings from '../features/user/booking/pages/MyBookings';
import MyProfile from '../features/user/profile/pages/MyProfile';
import About from '../features/user/static/pages/About';
import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';

// Admin Pages
import AdminDashboard from '../features/admin/dashboard/pages/AdminDashboard';
import AdminDestinations from '../features/admin/destination/pages/AdminDestinations';
import AdminTours from '../features/admin/tour/pages/AdminTours';
import AdminBookings from '../features/admin/booking/pages/AdminBookings';
import AdminBookingPlans from '../features/admin/bookingPlan/pages/AdminBookingPlans';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Client Site Routes wrapped in MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/destinations" element={<DestinationsList />} />
        <Route path="/destinations/:idOrSlug" element={<DestinationDetail />} />
        <Route path="/guides" element={<TravelGuides />} />
        <Route path="/collections" element={<SeasonalCollections />} />
        <Route path="/regions" element={<RegionExplorer />} />
        <Route path="/favourites" element={<FavouritesList />} />
        
        {/* Tour Booking Routes */}
        <Route path="/tour-booking/:tourId" element={<TourBooking />} />
        <Route path="/booking/:tourId" element={<TourBooking />} />

        {/* Protected My Bookings Route */}
        <Route
          path="/my-bookings"
          element={
            <PrivateRoute>
              <MyBookings />
            </PrivateRoute>
          }
        />

        {/* Protected Profile Routes */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <MyProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-profile"
          element={
            <PrivateRoute>
              <MyProfile />
            </PrivateRoute>
          }
        />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Static fallback */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Home />} />
      </Route>

      {/* Admin Panel Routes with AdminRoute guard */}
      <Route
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/destinations" element={<AdminDestinations />} />
        <Route path="/admin/tours" element={<AdminTours />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
        <Route path="/admin/booking-plans" element={<AdminBookingPlans />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
