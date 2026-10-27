import { useState, useEffect, useCallback } from 'react';
import destinationApi from '../destinationApi';

export const useDestinations = (initialFilters = {}) => {
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchList = useCallback(async (filters) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.region && filters.region !== 'Tất cả') params.region = filters.region;
      if (filters.theme && filters.theme !== 'Tất cả') params.theme = filters.theme;
      if (filters.budget && filters.budget !== 'Tất cả') params.budgetBand = filters.budget;
      if (filters.season && filters.season !== 'Tất cả') params.bestSeason = filters.season;
      params.limit = filters.limit || 100;

      const res = await destinationApi.getAll(params);
      const items = res.items || (Array.isArray(res) ? res : []);

      setDestinations(items);
      setTotalCount(res.totalItems !== undefined ? res.totalItems : items.length);
    } catch (err) {
      console.error('Error fetching destinations:', err);
      setError(err.message || 'Lỗi tải danh sách điểm đến');
      setDestinations([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filterKey = JSON.stringify(initialFilters);
  useEffect(() => {
    fetchList(initialFilters);
  }, [fetchList, filterKey]);

  return {
    destinations,
    totalCount,
    isLoading,
    error,
    refetch: fetchList,
  };
};

export default useDestinations;
