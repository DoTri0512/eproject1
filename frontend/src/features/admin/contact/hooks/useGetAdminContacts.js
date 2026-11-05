import { useState, useEffect, useCallback, useMemo } from 'react';
import adminApi from '../../adminApi';

export const useGetAdminContacts = (initialParams = {}) => {
  const [contacts, setContacts] = useState([]);
  const [allContactsForStats, setAllContactsForStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [activeTab, setActiveTab] = useState(initialParams.status || 'all');
  const [searchTerm, setSearchTerm] = useState(initialParams.search || '');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(initialParams.page || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = initialParams.limit || 10;

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setCurrentPage(1);
    }, 350);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const loadStats = useCallback(async () => {
    try {
      const res = await adminApi.getContacts({ limit: 1000 });
      const items = res?.data?.items || res?.items || (Array.isArray(res?.data) ? res.data : []);
      setAllContactsForStats(items);
    } catch (err) {
      console.warn('Could not fetch stats summary:', err);
    }
  }, []);

  const loadContacts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = {
        page: currentPage,
        limit,
      };

      if (activeTab !== 'all') {
        params.status = activeTab;
      }

      if (debouncedSearch) {
        params.search = debouncedSearch;
      }

      const res = await adminApi.getContacts(params);
      const items = res?.data?.items || res?.items || (Array.isArray(res?.data) ? res.data : []);
      const pagination = res?.data?.pagination || res?.pagination;

      setContacts(items);
      setTotalItems(pagination?.totalItems ?? items.length);
      setTotalPages(pagination?.totalPages ?? (Math.ceil(items.length / limit) || 1));
    } catch (err) {
      console.error('Error loading contacts:', err);
      setError(err.message || 'Không thể tải danh sách liên hệ');
      setContacts([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit, activeTab, debouncedSearch]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  // Metric stats
  const stats = useMemo(() => {
    const list = allContactsForStats;
    const total = list.length;
    const newCount = list.filter((c) => (c.status || 'new') === 'new').length;
    const readCount = list.filter((c) => c.status === 'read').length;
    const resolvedCount = list.filter((c) => c.status === 'resolved').length;
    return { total, newCount, readCount, resolvedCount };
  }, [allContactsForStats]);

  return {
    contacts,
    setContacts,
    stats,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    limit,
    refetch: loadContacts,
    refetchStats: loadStats,
  };
};

export default useGetAdminContacts;

