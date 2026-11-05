import useGetMyBookings from './useGetMyBookings';
import useCancelBooking from './useCancelBooking';

export {
  useGetMyBookings,
  useCancelBooking,
};

export const useMyBookings = () => {
  const query = useGetMyBookings();
  const { cancelBooking, isCancelling } = useCancelBooking();

  const handleCancel = async (id, reason) => {
    const success = await cancelBooking(id, reason);
    if (success) {
      query.setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, bookingStatus: 'cancelled' } : b))
      );
    }
    return success;
  };

  return {
    ...query,
    isCancelling,
    cancelBooking: handleCancel,
  };
};

export default useMyBookings;
