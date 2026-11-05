import { useState } from 'react';
import useGetAdminBookings from './useGetAdminBookings';
import useUpdateBooking from './useUpdateBooking';

export {
  useGetAdminBookings,
  useUpdateBooking,
};

export const useAdminBookings = () => {
  const query = useGetAdminBookings();
  const { updateBookingStatus, updatePaymentStatus, isUpdating } = useUpdateBooking();

  // Modals & Details
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenDetail = (booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setSelectedBooking(null);
    setIsDetailModalOpen(false);
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      query.setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, bookingStatus: newStatus } : b))
      );
      if (selectedBooking?._id === bookingId) {
        setSelectedBooking((prev) => ({ ...prev, bookingStatus: newStatus }));
      }
      showToast(`Đã cập nhật trạng thái đơn thành "${newStatus}"!`);
    } catch {
      showToast('Cập nhật trạng thái đơn thất bại', 'error');
    }
  };

  const handleUpdatePaymentStatus = async (bookingId, newPaymentStatus) => {
    try {
      await updatePaymentStatus(bookingId, newPaymentStatus);
      query.setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, paymentStatus: newPaymentStatus } : b))
      );
      if (selectedBooking?._id === bookingId) {
        setSelectedBooking((prev) => ({ ...prev, paymentStatus: newPaymentStatus }));
      }
      showToast(`Đã cập nhật thanh toán thành "${newPaymentStatus}"!`);
    } catch {
      showToast('Cập nhật trạng thái thanh toán thất bại', 'error');
    }
  };

  return {
    ...query,
    isSubmitting: isUpdating,
    selectedBooking,
    isDetailModalOpen,
    toastMessage,
    showToast,
    handleOpenDetail,
    handleCloseDetail,
    handleUpdateBookingStatus,
    handleUpdatePaymentStatus,
    refreshBookings: query.refetch,
  };
};

export default useAdminBookings;
