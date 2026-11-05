import { useState, useEffect, useCallback, useMemo } from 'react';
import adminApi from '../../adminApi';

export const useGetAdminBookingPlans = (initialParams = {}) => {
  const [plans, setPlans] = useState([]);
  const [tours, setTours] = useState([]);
  const [guides, setGuides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(initialParams.page || 1);
  const [limit, setLimit] = useState(initialParams.limit || 10);

  // Filters
  const [selectedTourId, setSelectedTourId] = useState(initialParams.tourId || 'all');
  const [selectedStatus, setSelectedStatus] = useState(initialParams.status || 'all');
  const [selectedDate, setSelectedDate] = useState(initialParams.date || '');
  const [searchTerm, setSearchTerm] = useState(initialParams.search || '');

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTourId, selectedStatus, selectedDate, searchTerm, limit]);

  const loadAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [plansRes, toursRes, guidesRes] = await Promise.allSettled([
        adminApi.getBookingPlans({ limit: 1000 }),
        adminApi.getTours({ limit: 1000 }),
        adminApi.getGuides({ limit: 1000 }),
      ]);

      if (plansRes.status === 'fulfilled' && plansRes.value) {
        const items = Array.isArray(plansRes.value)
          ? plansRes.value
          : plansRes.value.items || plansRes.value.data || [];
        setPlans(items);
      }

      if (toursRes.status === 'fulfilled' && toursRes.value) {
        const tourItems = Array.isArray(toursRes.value)
          ? toursRes.value
          : toursRes.value.items || toursRes.value.data || [];
        setTours(tourItems);
      }

      if (guidesRes.status === 'fulfilled' && guidesRes.value) {
        const guideItems = Array.isArray(guidesRes.value)
          ? guidesRes.value
          : guidesRes.value.items || guidesRes.value.data || [];
        setGuides(guideItems);
      }
    } catch (err) {
      console.error('Error loading booking plans data:', err);
      setError(err.message || 'Không thể tải dữ liệu đoàn khởi hành');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Statistics
  const stats = useMemo(() => {
    const total = plans.length;
    const scheduled = plans.filter((p) => (p.status || 'scheduled') === 'scheduled').length;
    const inProgress = plans.filter((p) => p.status === 'in_progress').length;
    const completed = plans.filter((p) => p.status === 'completed').length;
    const unassignedGuides = plans.filter(
      (p) => !p.guideId && ['scheduled', 'in_progress'].includes(p.status || 'scheduled')
    ).length;
    const totalPassengers = plans.reduce((sum, p) => sum + (p.totalPassengers || 0), 0);

    return { total, scheduled, inProgress, completed, unassignedGuides, totalPassengers };
  }, [plans]);

  // Filtered list
  const filteredPlans = useMemo(() => {
    return plans.filter((p) => {
      const tId = typeof p.tourId === 'object' ? p.tourId?._id : p.tourId;
      if (selectedTourId !== 'all' && tId !== selectedTourId) return false;
      if (selectedStatus !== 'all' && (p.status || 'scheduled') !== selectedStatus) return false;
      if (selectedDate && p.departureDate) {
        const depStr = new Date(p.departureDate).toISOString().slice(0, 10);
        if (depStr !== selectedDate) return false;
      }
      if (searchTerm.trim()) {
        const query = searchTerm.trim().toLowerCase();
        const tourTitle = (p.tourId?.title || '').toLowerCase();
        const guideName = (p.guideId?.name || '').toLowerCase();
        return tourTitle.includes(query) || guideName.includes(query);
      }
      return true;
    });
  }, [plans, selectedTourId, selectedStatus, selectedDate, searchTerm]);

  // Paginated plans
  const totalItems = filteredPlans.length;
  const totalPages = Math.ceil(totalItems / limit) || 1;
  const paginatedPlans = useMemo(() => {
    const start = (currentPage - 1) * limit;
    return filteredPlans.slice(start, start + limit);
  }, [filteredPlans, currentPage, limit]);

  return {
    plans,
    setPlans,
    filteredPlans: paginatedPlans,
    allFilteredCount: filteredPlans.length,
    tours,
    guides,
    stats,
    isLoading,
    error,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    limit,
    setLimit,
    selectedTourId,
    setSelectedTourId,
    selectedStatus,
    setSelectedStatus,
    selectedDate,
    setSelectedDate,
    searchTerm,
    setSearchTerm,
    refetch: loadAllData,
  };
};

export default useGetAdminBookingPlans;

