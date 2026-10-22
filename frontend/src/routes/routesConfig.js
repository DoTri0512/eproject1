import Home from '../features/user/home/pages/Home';
import DestinationsList from '../features/user/destination/pages/DestinationsList';
import DestinationDetail from '../features/user/destination/pages/DestinationDetail';
import ToursList from '../features/user/tour/pages/ToursList';
import TourDetail from '../features/user/tour/pages/TourDetail';
import TravelGuides from '../features/user/guide/pages/TravelGuides';
import SeasonalCollections from '../features/user/collection/pages/SeasonalCollections';
import RegionExplorer from '../features/user/region/pages/RegionExplorer';
import FavouritesList from '../features/user/favourite/pages/FavouritesList';
import TourBooking from '../features/user/booking/pages/TourBooking';
import MyBookings from '../features/user/booking/pages/MyBookings';
import MyProfile from '../features/user/profile/pages/MyProfile';
import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';
import AdminDashboard from '../features/admin/dashboard/pages/AdminDashboard';
import AdminDestinations from '../features/admin/destination/pages/AdminDestinations';
import AdminTours from '../features/admin/tour/pages/AdminTours';
import AdminBookings from '../features/admin/booking/pages/AdminBookings';
import AdminBookingPlans from '../features/admin/bookingPlan/pages/AdminBookingPlans';

export const routesConfig = {
  public: [
    {
      path: '/',
      element: Home,
      exact: true,
    },
    {
      path: '/destinations',
      element: DestinationsList,
    },
    {
      path: '/destinations/:idOrSlug',
      element: DestinationDetail,
    },
    {
      path: '/tours',
      element: ToursList,
    },
    {
      path: '/tours/:idOrSlug',
      element: TourDetail,
    },
    {
      path: '/regions',
      element: RegionExplorer,
    },
    {
      path: '/collections',
      element: SeasonalCollections,
    },
    {
      path: '/guides',
      element: TravelGuides,
    },
    {
      path: '/favourites',
      element: FavouritesList,
    },
    {
      path: '/tour-booking/:tourId',
      element: TourBooking,
    },
    {
      path: '/booking/:tourId',
      element: TourBooking,
    },
    {
      path: '/my-bookings',
      element: MyBookings,
    },
    {
      path: '/profile',
      element: MyProfile,
    },
    {
      path: '/my-profile',
      element: MyProfile,
    },
    {
      path: '/about',
      element: Home,
    },
    {
      path: '/contact',
      element: Home,
    },
    {
      path: '/login',
      element: Login,
    },
    {
      path: '/register',
      element: Register,
    },
  ],
  admin: [
    {
      path: '/admin/dashboard',
      element: AdminDashboard,
    },
    {
      path: '/admin/destinations',
      element: AdminDestinations,
    },
    {
      path: '/admin/tours',
      element: AdminTours,
    },
    {
      path: '/admin/bookings',
      element: AdminBookings,
    },
    {
      path: '/admin/booking-plans',
      element: AdminBookingPlans,
    },
  ],
};

export default routesConfig;
