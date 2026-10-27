import { useState, useEffect, useCallback, useMemo } from 'react';
import adminApi from '../../adminApi';

export const useAdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [allContactsForStats, setAllContactsForStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters & Search
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'new' | 'read' | 'resolved'
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  // Modals & Active items
  const [selectedContact, setSelectedContact] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setCurrentPage(1); // Reset về trang 1 khi gõ tìm kiếm
    }, 350);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Load summary contacts for accurate Metric Cards
  const loadStats = useCallback(async () => {
    try {
      const res = await adminApi.getContacts({ limit: 1000 });
      const items = res?.data?.items || res?.items || (Array.isArray(res?.data) ? res.data : []);
      setAllContactsForStats(items);
    } catch (err) {
      console.warn('Could not fetch stats summary:', err);
    }
  }, []);

  // Fetch paginated & filtered contacts from Backend REST API
  const loadContacts = useCallback(async () => {
    try {
      setIsLoading(true);
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
      const resultData = res?.data || res;
      const items = resultData?.items || (Array.isArray(resultData) ? resultData : []);

      setContacts(items);
      setTotalItems(resultData?.totalItems ?? items.length);
      setTotalPages(resultData?.totalPages ?? 1);
    } catch (err) {
      console.error('Error fetching admin contacts:', err);
      showToast(err.message || 'Không thể tải danh sách liên hệ', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, activeTab, debouncedSearch, limit]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Metric Stats
  const stats = useMemo(() => {
    const total = allContactsForStats.length;
    const newCount = allContactsForStats.filter((c) => (c.status || 'new') === 'new').length;
    const readCount = allContactsForStats.filter((c) => c.status === 'read').length;
    const resolvedCount = allContactsForStats.filter((c) => c.status === 'resolved').length;

    return { total, newCount, readCount, resolvedCount };
  }, [allContactsForStats]);

  // Open Detail Modal
  const handleOpenDetail = async (contact) => {
    setSelectedContact(contact);
    setIsDetailModalOpen(true);

    // UX Enhancement: If status is 'new', auto-mark as 'read' upon viewing
    if (contact.status === 'new') {
      try {
        await adminApi.updateContactStatus(contact._id, 'read');
        // Update local state
        setContacts((prev) =>
          prev.map((c) => (c._id === contact._id ? { ...c, status: 'read' } : c))
        );
        setAllContactsForStats((prev) =>
          prev.map((c) => (c._id === contact._id ? { ...c, status: 'read' } : c))
        );
        setSelectedContact((prev) => (prev ? { ...prev, status: 'read' } : null));
      } catch (err) {
        console.warn('Auto mark as read failed:', err);
      }
    }
  };

  // Update Status
  const handleUpdateStatus = async (id, status) => {
    try {
      setIsSubmitting(true);
      await adminApi.updateContactStatus(id, status);

      // Cập nhật danh sách hiển thị
      setContacts((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status } : c))
      );
      setAllContactsForStats((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status } : c))
      );
      if (selectedContact && selectedContact._id === id) {
        setSelectedContact((prev) => ({ ...prev, status }));
      }

      showToast(
        `Đã cập nhật trạng thái liên hệ thành: ${
          status === 'new' ? 'Chưa đọc' : status === 'read' ? 'Đã đọc' : 'Đã giải quyết'
        }`
      );
    } catch (err) {
      console.error('Update status error:', err);
      showToast(err.message || 'Cập nhật trạng thái thất bại', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Click
  const handleDeleteClick = (contact) => {
    setContactToDelete(contact);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!contactToDelete) return;

    try {
      setIsSubmitting(true);
      await adminApi.deleteContact(contactToDelete._id);

      setContacts((prev) => prev.filter((c) => c._id !== contactToDelete._id));
      setAllContactsForStats((prev) => prev.filter((c) => c._id !== contactToDelete._id));
      setTotalItems((prev) => Math.max(0, prev - 1));

      if (selectedContact && selectedContact._id === contactToDelete._id) {
        setIsDetailModalOpen(false);
        setSelectedContact(null);
      }

      setIsDeleteModalOpen(false);
      setContactToDelete(null);

      showToast('Đã xóa yêu cầu liên hệ thành công');
    } catch (err) {
      console.error('Delete contact error:', err);
      showToast(err.message || 'Xóa yêu cầu liên hệ thất bại', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Change tab handler
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  return {
    contacts,
    isLoading,
    isSubmitting,
    activeTab,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    stats,
    selectedContact,
    isDetailModalOpen,
    setIsDetailModalOpen,
    contactToDelete,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    toastMessage,
    handleOpenDetail,
    handleUpdateStatus,
    handleDeleteClick,
    handleConfirmDelete,
    handleTabChange,
    refreshContacts: loadContacts,
  };
};

export default useAdminContacts;
