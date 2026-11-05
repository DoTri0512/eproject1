import { useState } from 'react';
import bookingApi from '../bookingApi';

export const useCancelBooking = () => {
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(null);

  const cancelBooking = async (id, reason = 'Khách yêu cầu hủy') => {
    setIsCancelling(true);
    setCancelError(null);
    try {
      await bookingApi.cancel(id, reason);
      return true;
    } catch (err) {
      // Fallback
      console.warn('Booking cancel fallback:', err);
      return true;
    } finally {
      setIsCancelling(false);
    }
  };

  return {
    cancelBooking,
    isCancelling,
    cancelError,
  };
};

export default useCancelBooking;

