import { useState, useEffect, useCallback, useMemo } from 'react';
import adminApi from '../../adminApi';

export const useAdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Filters & Tabs
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, paymentFilter, limit]);

  // Modals & Details
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await adminApi.getBookings({ limit: 1000 });
      const items = Array.isArray(res)
        ? res
        : res.data || res.bookings || res.items || [];
      setBookings(items);
    } catch (err) {
      console.error('Error loading admin bookings:', err);
      showToast('Không thể tải danh sách đơn hàng', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  // Tab counts & statistics
  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter((b) => (b.bookingStatus || 'pending') === 'pending').length;
    const confirmed = bookings.filter((b) => b.bookingStatus === 'confirmed').length;
    const completed = bookings.filter((b) => b.bookingStatus === 'completed').length;
    const cancelled = bookings.filter((b) => b.bookingStatus === 'cancelled').length;

    // Payment statistics
    const paidCount = bookings.filter((b) => ['confirmed', 'completed'].includes(b.paymentStatus)).length;
    const unpaidCount = bookings.filter((b) => (b.paymentStatus || 'pending') === 'pending').length;

    // Total confirmed/completed revenue based strictly on paymentStatus
    const totalRevenue = bookings
      .filter((b) => ['confirmed', 'completed'].includes(b.paymentStatus))
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    return { total, pending, confirmed, completed, cancelled, paidCount, unpaidCount, totalRevenue };
  }, [bookings]);

  // Filtered list
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Tab filter (bookingStatus)
      const bStatus = (b.bookingStatus || 'pending').toLowerCase();
      if (activeTab !== 'all' && bStatus !== activeTab) {
        return false;
      }

      // Payment filter (paymentStatus)
      if (paymentFilter !== 'all' && (b.paymentStatus || 'pending') !== paymentFilter) {
        return false;
      }

      // Search keyword
      if (searchTerm.trim()) {
        const query = searchTerm.trim().toLowerCase();
        const code = `#bk-${(b._id || '').slice(-6)}`.toLowerCase();
        const customerName = (b.customerId?.fullName || b.userId?.name || '').toLowerCase();
        const customerPhone = (b.customerId?.phone || '').toLowerCase();
        const tourTitle = (b.tourId?.title || '').toLowerCase();

        return (
          code.includes(query) ||
          customerName.includes(query) ||
          customerPhone.includes(query) ||
          tourTitle.includes(query)
        );
      }

      return true;
    });
  }, [bookings, activeTab, paymentFilter, searchTerm]);

  // Paginated bookings
  const totalItems = filteredBookings.length;
  const totalPages = Math.ceil(totalItems / limit) || 1;
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * limit;
    return filteredBookings.slice(start, start + limit);
  }, [filteredBookings, currentPage, limit]);

  // Open Details Modal
  const handleOpenDetail = (booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  // Update Status
  const handleUpdateStatus = async (bookingId, { bookingStatus, paymentStatus }) => {
    setIsSubmitting(true);
    try {
      const payload = {};
      if (bookingStatus !== undefined) payload.bookingStatus = bookingStatus;
      if (paymentStatus !== undefined) payload.paymentStatus = paymentStatus;

      const res = await adminApi.updateBookingStatus(bookingId, payload);
      const updated = res.data || res;
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, ...updated } : b))
      );
      if (selectedBooking?._id === bookingId) {
        setSelectedBooking((prev) => ({ ...prev, ...updated }));
      }
      showToast('Cập nhật trạng thái đơn thành công!');
      return true;
    } catch (err) {
      showToast(err.response?.data?.message || 'Cập nhật trạng thái thất bại', 'error');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Approve: duyệt chỗ (bookingStatus -> confirmed), độc lập với paymentStatus
  const handleQuickApprove = async (booking) => {
    return handleUpdateStatus(booking._id, {
      bookingStatus: 'confirmed',
    });
  };

  // Quick Complete: hoàn thành chuyến đi (bookingStatus -> completed), độc lập với paymentStatus
  const handleQuickComplete = async (booking) => {
    return handleUpdateStatus(booking._id, {
      bookingStatus: 'completed',
    });
  };

  // Quick Mark as Paid: xác nhận thu tiền (paymentStatus -> confirmed)
  const handleQuickMarkPaid = async (booking) => {
    return handleUpdateStatus(booking._id, {
      paymentStatus: 'confirmed',
    });
  };

  // Quick Cancel: -> cancelled
  const handleQuickCancel = async (booking) => {
    return handleUpdateStatus(booking._id, {
      bookingStatus: 'cancelled',
    });
  };

  return {
    bookings,
    filteredBookings: paginatedBookings,
    allFilteredCount: filteredBookings.length,
    stats,
    isLoading,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    limit,
    setLimit,
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    paymentFilter,
    setPaymentFilter,
    selectedBooking,
    isDetailModalOpen,
    setIsDetailModalOpen,
    isSubmitting,
    toastMessage,
    showToast,
    handleOpenDetail,
    handleUpdateStatus,
    handleQuickApprove,
    handleQuickComplete,
    handleQuickMarkPaid,
    handleQuickCancel,
    reloadBookings: loadBookings,
  };
};

export default useAdminBookings;
