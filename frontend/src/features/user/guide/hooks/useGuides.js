import { useState, useEffect, useCallback } from 'react';
import guideApi from '../guideApi';

export const useGuides = (filters = {}) => {
  const [guides, setGuides] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 6,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchList = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.language && filters.language !== 'Tất cả') params.language = filters.language;
      if (filters.specialisation && filters.specialisation !== 'Tất cả') params.specialisation = filters.specialisation;
      if (filters.destinationId) params.destinationId = filters.destinationId;
      if (filters.page) params.page = filters.page;
      if (filters.limit) params.limit = filters.limit;

      const res = await guideApi.getAll(params);
      const items = res.items || (Array.isArray(res) ? res : []);
      const pag = res.pagination || {
        currentPage: Number(filters.page) || 1,
        totalPages: Math.ceil((items.length) / (Number(filters.limit) || 6)) || 1,
        totalItems: items.length,
        limit: Number(filters.limit) || 6,
        hasNextPage: false,
        hasPrevPage: false,
      };

      setGuides(items);
      setPagination(pag);
    } catch (err) {
      console.error('Error fetching guides:', err);
      setError(err.message || 'Lỗi tải danh sách hướng dẫn viên');
      setGuides([]);
    } finally {
      setIsLoading(false);
    }
  }, [
    filters.search,
    filters.language,
    filters.specialisation,
    filters.destinationId,
    filters.page,
    filters.limit,
  ]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return {
    guides,
    pagination,
    isLoading,
    error,
    refetch: fetchList,
  };
};

export default useGuides;
