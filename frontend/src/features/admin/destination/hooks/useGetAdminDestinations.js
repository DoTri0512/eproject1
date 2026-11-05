import { useState, useEffect, useCallback } from 'react';
import destinationApi from '@/features/user/destination/destinationApi';

export const useGetAdminDestinations = (initialParams = {}) => {
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(initialParams.page || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit, setLimit] = useState(initialParams.limit || 10);

  // Filters & search
  const [searchTerm, setSearchTerm] = useState(initialParams.search || '');
  const [selectedRegion, setSelectedRegion] = useState(initialParams.region || 'all');
  const [selectedTheme, setSelectedTheme] = useState(initialParams.theme || 'all');

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRegion, selectedTheme, limit]);

  const fetchDestinations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = {
        page: currentPage,
        limit,
      };
      if (selectedRegion && selectedRegion !== 'all') params.region = selectedRegion;
      if (selectedTheme && selectedTheme !== 'all') params.theme = selectedTheme;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const res = await destinationApi.getAll(params);
      const items = res?.items || res?.data?.items || (Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
      const paginationInfo = res?.pagination || res?.data?.pagination;

      setDestinations(items);
      setTotalItems(paginationInfo?.totalItems ?? res?.totalItems ?? items.length);
      setTotalPages(paginationInfo?.totalPages ?? (Math.ceil(items.length / limit) || 1));
    } catch (err) {
      console.error('Error fetching admin destinations:', err);
      setError(err.message || 'Không thể tải danh sách điểm đến');
      setDestinations([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit, searchTerm, selectedRegion, selectedTheme]);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  return {
    destinations,
    setDestinations,
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
    selectedRegion,
    setSelectedRegion,
    selectedTheme,
    setSelectedTheme,
    refetch: fetchDestinations,
  };
};

export default useGetAdminDestinations;

