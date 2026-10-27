import { useState, useEffect, useCallback } from 'react';
import adminApi from '../../adminApi';

export const useAdminGuides = () => {
  const [guides, setGuides] = useState([]);
  const [allDestinations, setAllDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit, setLimit] = useState(10);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [specialisationFilter, setSpecialisationFilter] = useState('all');

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, languageFilter, specialisationFilter, limit]);

  // Modals & Selection
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load guides
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
      setTotalPages(paginationInfo?.totalPages ?? (Math.ceil((items.length) / limit) || 1));
    } catch (err) {
      console.error('Error loading guides:', err);
      setError(err.message || 'Không thể tải danh sách hướng dẫn viên');
      showToast(err.message || 'Không thể tải danh sách hướng dẫn viên', 'error');
      setGuides([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit, searchTerm, languageFilter, specialisationFilter]);

  // Load destinations for selection
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

  // Modal handlers
  const handleOpenCreate = () => {
    setSelectedGuide(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (guide) => {
    setSelectedGuide(guide);
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (guide) => {
    setSelectedGuide(guide);
    setIsDeleteModalOpen(true);
  };

  const handleOpenDetail = async (guide) => {
    try {
      // Fetch fresh detail with populated destinations
      const freshGuide = await adminApi.getGuideByIdOrSlug(guide._id || guide.slug);
      const data = freshGuide?.data || freshGuide;
      setSelectedGuide(data);
      setIsDetailModalOpen(true);
    } catch (err) {
      setSelectedGuide(guide);
      setIsDetailModalOpen(true);
    }
  };

  // Save (Create or Update)
  const handleSaveGuide = async (formData) => {
    try {
      setIsSubmitting(true);
      if (selectedGuide?._id) {
        await adminApi.updateGuide(selectedGuide._id, formData);
        showToast('Cập nhật hướng dẫn viên thành công!', 'success');
      } else {
        await adminApi.createGuide(formData);
        showToast('Thêm mới hướng dẫn viên thành công!', 'success');
      }
      setIsFormModalOpen(false);
      setSelectedGuide(null);
      await loadGuides();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Lỗi khi lưu thông tin hướng dẫn viên';
      showToast(msg, 'error');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete
  const handleDeleteGuide = async () => {
    if (!selectedGuide?._id) return;
    try {
      setIsSubmitting(true);
      await adminApi.deleteGuide(selectedGuide._id);
      showToast('Đã xóa hướng dẫn viên thành công!', 'success');
      setIsDeleteModalOpen(false);
      setSelectedGuide(null);
      await loadGuides();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Lỗi khi xóa hướng dẫn viên';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Thêm danh sách điểm đến phụ trách cho guide
  const handleAddDestinationsToGuide = async (guideId, destinationIds) => {
    try {
      setIsSubmitting(true);
      const res = await adminApi.addDestinationsToGuide(guideId, destinationIds);
      const updated = res?.data || res;
      setSelectedGuide(updated);
      showToast('Đã thêm điểm đến phụ trách thành công!', 'success');
      await loadGuides();
      return updated;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Lỗi khi thêm điểm đến phụ trách';
      showToast(msg, 'error');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xóa điểm đến phụ trách của guide
  const handleRemoveDestinationFromGuide = async (guideId, destinationId) => {
    try {
      setIsSubmitting(true);
      const res = await adminApi.removeDestinationFromGuide(guideId, destinationId);
      const updated = res?.data || res;
      setSelectedGuide(updated);
      showToast('Đã gỡ bỏ điểm đến khỏi danh sách phụ trách!', 'success');
      await loadGuides();
      return updated;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Lỗi khi gỡ bỏ điểm đến';
      showToast(msg, 'error');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    guides,
    allDestinations,
    isLoading,
    isSubmitting,
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
    selectedGuide,
    setSelectedGuide,
    isFormModalOpen,
    setIsFormModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isDetailModalOpen,
    setIsDetailModalOpen,
    toastMessage,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDelete,
    handleOpenDetail,
    handleSaveGuide,
    handleDeleteGuide,
    handleAddDestinationsToGuide,
    handleRemoveDestinationFromGuide,
    refreshGuides: loadGuides,
  };
};

export default useAdminGuides;
