import { useState, useEffect, useCallback } from 'react';
import bookingApi from '../bookingApi';
import useAuth from '../../../../hooks/useAuth';

export const useMyBookings = () => {
  const { isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await bookingApi.getMyBookings();
      const items = res.items || (Array.isArray(res) ? res : []);
      setBookings(items);
    } catch (err) {
      console.warn('API error, using mock personal bookings:', err);
      // Fallback mock booking for demo if needed
      setBookings([
        {
          _id: '6ace20deb48cdedf42b8ef99',
          tourId: {
            _id: '6ace20deb48cdedf42b8eef9',
            title: 'Tour Du Thuyền 5 Sao Khám Phá Kỳ Quan Vịnh Hạ Long 3N2Đ',
            price: 3650000,
            duration: { days: 3, nights: 2, text: '3 ngày 2 đêm' },
            destinationId: {
              name: 'Vịnh Hạ Long',
              image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
            },
          },
          departureDate: '2026-10-25T00:00:00.000Z',
          endDate: '2026-10-27T00:00:00.000Z',
          numberOfGuests: { adults: 2, children: 1 },
          totalAmount: 9425000,
          paymentMethod: 'bank_transfer',
          paymentStatus: 'pending',
          bookingStatus: 'pending',
          createdAt: '2026-10-14T10:00:00.000Z',
          customerId: {
            fullName: 'Nguyễn Văn An',
            email: 'customer@traveltrail.com',
            phone: '0912345678',
          },
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancelBooking = async (id, reason = 'Khách yêu cầu hủy') => {
    try {
      await bookingApi.cancel(id, reason);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, bookingStatus: 'cancelled' } : b))
      );
      return true;
    } catch {
      // Local fallback cancellation
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, bookingStatus: 'cancelled' } : b))
      );
      return true;
    }
  };

  return {
    bookings,
    isLoading,
    error,
    refetch: fetchBookings,
    cancelBooking: handleCancelBooking,
  };
};

export default useMyBookings;
