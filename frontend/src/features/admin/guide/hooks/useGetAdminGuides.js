import { useState, useEffect, useCallback } from 'react';
import adminApi from '../../adminApi';

export const useGetAdminGuides = (initialParams = {}) => {
  const [guides, setGuides] = useState([]);
  const [allDestinations, setAllDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(initialParams.page || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit, setLimit] = useState(initialParams.limit || 10);

  // Filters
  const [searchTerm, setSearchTerm] = useState(initialParams.search || '');
  const [languageFilter, setLanguageFilter] = useState(initialParams.language || 'all');
  const [specialisationFilter, setSpecialisationFilter] = useState(initialParams.specialisation || 'all');

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, languageFilter, specialisationFilter, limit]);

  const loadGuides = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = {
        page: currentPage,
        limit,
      };
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (languageFilter !== 'all') params.language = languageFilter;
      if (specialisationFilter !== 'all') params.specialisation = specialisationFilter;

      const res = await adminApi.getGuides(params);
      const items = res?.items || res?.data?.items || (Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
      const paginationInfo = res?.pagination || res?.data?.pagination;

      setGuides(items);
      setTotalItems(paginationInfo?.totalItems ?? res?.totalItems ?? items.length);
      setTotalPages(paginationInfo?.totalPages ?? (Math.ceil(items.length / limit) || 1));
    } catch (err) {
      console.error('Error loading guides:', err);
      setError(err.message || 'Không thể tải danh sách hướng dẫn viên');
      setGuides([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit, searchTerm, languageFilter, specialisationFilter]);

  const loadDestinations = useCallback(async () => {
    try {
      const res = await adminApi.getDestinations({ limit: 100 });
      const items = res?.items || res?.data?.items || (Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
      setAllDestinations(items);
    } catch (err) {
      console.error('Error loading destinations for selection:', err);
    }
  }, []);

  useEffect(() => {
    loadGuides();
  }, [loadGuides]);

  useEffect(() => {
    loadDestinations();
  }, [loadDestinations]);

  return {
    guides,
    setGuides,
    allDestinations,
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
    languageFilter,
    setLanguageFilter,
    specialisationFilter,
    setSpecialisationFilter,
    refetch: loadGuides,
    refetchDestinations: loadDestinations,
  };
};

export default useGetAdminGuides;

