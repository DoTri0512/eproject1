import { useState, useEffect, useCallback } from 'react';
import guideApi from '../guideApi';

export const useGuides = (filters = {}) => {
  const [guides, setGuides] = useState([]);
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

      const res = await guideApi.getAll(params);
      const items = res.items || (Array.isArray(res) ? res : []);

      setGuides(items);
    } catch (err) {
      console.error('Error fetching guides:', err);
      setError(err.message || 'Lỗi tải danh sách hướng dẫn viên');
      setGuides([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters.search, filters.language, filters.specialisation]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return {
    guides,
    isLoading,
    error,
    refetch: fetchList,
  };
};

export default useGuides;
