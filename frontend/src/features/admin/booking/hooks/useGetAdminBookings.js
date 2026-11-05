import { useState, useEffect, useCallback, useMemo } from 'react';
import adminApi from '../../adminApi';

export const useGetAdminBookings = (initialParams = {}) => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(initialParams.page || 1);
  const [limit, setLimit] = useState(initialParams.limit || 10);

  // Filters & Tabs
  const [activeTab, setActiveTab] = useState(initialParams.status || 'all');
  const [searchTerm, setSearchTerm] = useState(initialParams.search || '');
  const [paymentFilter, setPaymentFilter] = useState(initialParams.payment || 'all');

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, paymentFilter, limit]);

  const loadBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await adminApi.getBookings({ limit: 1000 });
      const items = Array.isArray(res)
        ? res
        : res.data || res.bookings || res.items || [];
      setBookings(items);
    } catch (err) {
      console.error('Error loading admin bookings:', err);
      setError(err.message || 'Không thể tải danh sách đơn hàng');
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  // Statistics
  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter((b) => (b.bookingStatus || 'pending') === 'pending').length;
    const confirmed = bookings.filter((b) => b.bookingStatus === 'confirmed').length;
    const completed = bookings.filter((b) => b.bookingStatus === 'completed').length;
    const cancelled = bookings.filter((b) => b.bookingStatus === 'cancelled').length;
    const totalRevenue = bookings
      .filter((b) => b.paymentStatus === 'completed' || b.paymentStatus === 'confirmed')
      .reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0);

    return { total, pending, confirmed, completed, cancelled, totalRevenue };
  }, [bookings]);

  // Filtered list
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (activeTab !== 'all') {
        const status = (b.bookingStatus || 'pending').toLowerCase();
        if (status !== activeTab) return false;
      }
      if (paymentFilter !== 'all') {
        const pStatus = (b.paymentStatus || 'pending').toLowerCase();
        if (pStatus !== paymentFilter) return false;
      }
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const code = (b._id || '').toLowerCase();
        const customerName = (b.contactInfo?.fullName || b.userId?.name || '').toLowerCase();
        const phone = (b.contactInfo?.phone || b.userId?.phone || '').toLowerCase();
        const tourTitle = (b.tourId?.title || '').toLowerCase();

        return (
          code.includes(term) ||
          customerName.includes(term) ||
          phone.includes(term) ||
          tourTitle.includes(term)
        );
      }
      return true;
    });
  }, [bookings, activeTab, paymentFilter, searchTerm]);

  // Pagination slice
  const totalItems = filteredBookings.length;
  const totalPages = Math.ceil(totalItems / limit) || 1;
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * limit;
    return filteredBookings.slice(start, start + limit);
  }, [filteredBookings, currentPage, limit]);

  return {
    bookings,
    setBookings,
    filteredBookings,
    paginatedBookings,
    stats,
    isLoading,
    error,
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
    refetch: loadBookings,
  };
};

export default useGetAdminBookings;

