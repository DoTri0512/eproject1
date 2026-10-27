import { useState, useEffect, useCallback } from 'react';
import destinationApi from '../../../user/destination/destinationApi';

export const useAdminDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit, setLimit] = useState(10);

  // Filters & search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedTheme, setSelectedTheme] = useState('all');

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRegion, selectedTheme, limit]);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadDestinations = useCallback(async () => {
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
      setTotalPages(paginationInfo?.totalPages ?? (Math.ceil((items.length) / limit) || 1));
    } catch (err) {
      console.error('Error loading destinations:', err);
      setError(err.message);
      showToast(err.message || 'Không thể tải danh sách điểm đến', 'error');
      setDestinations([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit, searchTerm, selectedRegion, selectedTheme]);

  useEffect(() => {
    loadDestinations();
  }, [loadDestinations]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setSelectedDestination(null);
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (dest) => {
    setSelectedDestination(dest);
    setIsFormModalOpen(true);
  };

  // Open Delete Modal
  const handleOpenDelete = (dest) => {
    setSelectedDestination(dest);
    setIsDeleteModalOpen(true);
  };

  // Save (Create or Update)
  const handleSaveDestination = async (formData) => {
    try {
      setIsSubmitting(true);
      if (selectedDestination && selectedDestination._id) {
        // Update
        await destinationApi.update(selectedDestination._id, formData);
        showToast(`Cập nhật điểm đến "${formData.name}" thành công!`);
      } else {
        // Create
        await destinationApi.create(formData);
        showToast(`Thêm mới điểm đến "${formData.name}" thành công!`);
      }
      setIsFormModalOpen(false);
      setSelectedDestination(null);
      await loadDestinations();
      return true;
    } catch (err) {
      console.error('Save destination error:', err);
      showToast(err.message || 'Lưu điểm đến thất bại', 'error');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete
  const handleDeleteDestination = async () => {
    if (!selectedDestination?._id) return;
    try {
      setIsSubmitting(true);
      await destinationApi.delete(selectedDestination._id);
      showToast(`Đã xóa điểm đến "${selectedDestination.name}" thành công!`);
      setIsDeleteModalOpen(false);
      setSelectedDestination(null);
      await loadDestinations();
    } catch (err) {
      console.error('Delete destination error:', err);
      showToast(err.message || 'Không thể xóa điểm đến này', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    destinations,
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
    isFormModalOpen,
    setIsFormModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedDestination,
    isSubmitting,
    toastMessage,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDelete,
    handleSaveDestination,
    handleDeleteDestination,
    refetch: loadDestinations,
  };
};

export default useAdminDestinations;
