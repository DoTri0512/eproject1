import { useState, useEffect, useCallback, useMemo } from 'react';
import adminApi from '../../adminApi';

export const useGetAdminTours = (initialParams = {}) => {
  const [tours, setTours] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [allToursForStats, setAllToursForStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(initialParams.page || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit, setLimit] = useState(initialParams.limit || 10);

  // Filters & search
  const [searchTerm, setSearchTerm] = useState(initialParams.search || '');
  const [selectedDestinationId, setSelectedDestinationId] = useState(initialParams.destinationId || 'all');
  const [selectedStatus, setSelectedStatus] = useState(initialParams.status || 'all');

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDestinationId, selectedStatus, limit]);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = {
        page: currentPage,
        limit,
      };
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedDestinationId !== 'all') params.destinationId = selectedDestinationId;
      if (selectedStatus !== 'all') params.status = selectedStatus;

      const [toursRes, destsRes, allToursRes] = await Promise.allSettled([
        adminApi.getTours(params),
        adminApi.getDestinations({ limit: 100 }),
        adminApi.getTours({ limit: 1000 }),
      ]);

      if (toursRes.status === 'fulfilled' && toursRes.value) {
        const val = toursRes.value;
        const items = Array.isArray(val)
          ? val
          : val.items || val.data?.items || val.data || [];
        const paginationInfo = val.pagination || val.data?.pagination;

        setTours(items);
        setTotalItems(paginationInfo?.totalItems ?? val.totalItems ?? items.length);
        setTotalPages(paginationInfo?.totalPages ?? (Math.ceil(items.length / limit) || 1));
      }

      if (destsRes.status === 'fulfilled' && destsRes.value) {
        const destItems = Array.isArray(destsRes.value)
          ? destsRes.value
          : destsRes.value.items || destsRes.value.data || [];
        setDestinations(destItems);
      }

      if (allToursRes.status === 'fulfilled' && allToursRes.value) {
        const allItems = Array.isArray(allToursRes.value)
          ? allToursRes.value
          : allToursRes.value.items || allToursRes.value.data || [];
        setAllToursForStats(allItems);
      }
    } catch (err) {
      console.error('Error fetching admin tours data:', err);
      setError(err.message || 'Không thể tải dữ liệu tours từ server');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit, searchTerm, selectedDestinationId, selectedStatus]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Statistics
  const stats = useMemo(() => {
    const list = allToursForStats.length > 0 ? allToursForStats : tours;
    const total = totalItems || list.length;
    const active = list.filter((t) => (t.status || 'active') === 'active').length;
    const totalAvailableSeats = list.reduce(
      (sum, t) => sum + (t.availableSeats ?? t.maxPassengers ?? 0),
      0
    );
    const avgPrice =
      list.length > 0
        ? Math.round(
            list.reduce((sum, t) => {
              const p =
                t.durationOptions?.length > 0
                  ? Math.min(...t.durationOptions.map((o) => Number(o.price) || 0))
                  : Number(t.price) || 0;
              return sum + p;
            }, 0) / list.length
          )
        : 0;

    return { total, active, totalAvailableSeats, avgPrice };
  }, [allToursForStats, tours, totalItems]);

  return {
    tours,
    setTours,
    destinations,
    allToursForStats,
    stats,
    isLoading,
    error,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    limit,
    setLimit,
    searchTerm,
    setSearchTerm,
    selectedDestinationId,
    setSelectedDestinationId,
    selectedStatus,
    setSelectedStatus,
    refetch: loadData,
  };
};

export default useGetAdminTours;

