import { useState } from 'react';
import adminApi from '../../adminApi';

export const useUpdateBooking = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const updateBookingStatus = async (bookingId, bookingStatus) => {
    setIsUpdating(true);
    setUpdateError(null);
    try {
      const res = await adminApi.updateBookingStatus(bookingId, { bookingStatus });
      return res?.data || res;
    } catch (err) {
      setUpdateError(err.message || 'Cập nhật trạng thái đơn đặt thất bại');
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const updatePaymentStatus = async (bookingId, paymentStatus) => {
    setIsUpdating(true);
    setUpdateError(null);
    try {
      const res = await adminApi.updatePaymentStatus(bookingId, { paymentStatus });
      return res?.data || res;
    } catch (err) {
      setUpdateError(err.message || 'Cập nhật trạng thái thanh toán thất bại');
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateBookingStatus,
    updatePaymentStatus,
    isUpdating,
    updateError,
  };
};

export default useUpdateBooking;

