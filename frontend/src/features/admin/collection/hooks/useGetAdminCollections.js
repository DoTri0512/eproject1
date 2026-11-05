import { useState, useEffect, useCallback } from 'react';
import adminApi from '../../adminApi';

export const useGetAdminCollections = (initialParams = {}) => {
  const [collections, setCollections] = useState([]);
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

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, limit]);

  const loadCollections = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = {
        page: currentPage,
        limit,
      };
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const res = await adminApi.getCollections(params);
      const items = res?.items || res?.data?.items || (Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
      const paginationInfo = res?.pagination || res?.data?.pagination;

      setCollections(items);
      setTotalItems(paginationInfo?.totalItems ?? res?.totalItems ?? items.length);
      setTotalPages(paginationInfo?.totalPages ?? (Math.ceil(items.length / limit) || 1));
    } catch (err) {
      console.error('Error loading collections:', err);
      setError(err.message || 'Không thể tải danh sách bộ sưu tập');
      setCollections([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit, searchTerm]);

  const loadDestinations = useCallback(async () => {
    try {
      const res = await adminApi.getDestinations({ limit: 100 });
      const items = res?.items || res?.data?.items || (Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
      setAllDestinations(items);
    } catch (err) {
      console.error('Error loading destinations:', err);
    }
  }, []);

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  useEffect(() => {
    loadDestinations();
  }, [loadDestinations]);

  return {
    collections,
    setCollections,
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
    refetch: loadCollections,
    refetchDestinations: loadDestinations,
  };
};

export default useGetAdminCollections;

