import { useState, useEffect, useCallback } from 'react';
import adminApi from '../../adminApi';

export const useAdminCollections = () => {
  const [collections, setCollections] = useState([]);
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

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, limit]);

  // Modals & Selection
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Load collections
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
      setTotalPages(paginationInfo?.totalPages ?? (Math.ceil((items.length) / limit) || 1));
    } catch (err) {
      console.error('Error loading collections:', err);
      setError(err.message || 'Không thể tải danh sách bộ sưu tập');
      showToast(err.message || 'Không thể tải danh sách bộ sưu tập', 'error');
      setCollections([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit, searchTerm]);

  // Load all destinations for selection
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

  // Modal handlers
  const handleOpenCreate = () => {
    setSelectedCollection(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (collection) => {
    setSelectedCollection(collection);
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (collection) => {
    setSelectedCollection(collection);
    setIsDeleteModalOpen(true);
  };

  const handleOpenDetail = async (collection) => {
    try {
      // Fetch fresh detail with populated destinations
      const fresh = await adminApi.getCollectionByIdOrSlug(collection._id || collection.slug);
      const data = fresh?.data || fresh;
      setSelectedCollection(data);
      setIsDetailModalOpen(true);
    } catch (err) {
      setSelectedCollection(collection);
      setIsDetailModalOpen(true);
    }
  };

  // Save (Create or Update)
  const handleSaveCollection = async (formData) => {
    try {
      setIsSubmitting(true);
      if (selectedCollection?._id) {
        await adminApi.updateCollection(selectedCollection._id, formData);
        showToast('Cập nhật bộ sưu tập thành công!', 'success');
      } else {
        await adminApi.createCollection(formData);
        showToast('Tạo mới bộ sưu tập thành công!', 'success');
      }
      setIsFormModalOpen(false);
      setSelectedCollection(null);
      await loadCollections();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Lỗi khi lưu bộ sưu tập';
      showToast(msg, 'error');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete
  const handleDeleteCollection = async () => {
    if (!selectedCollection?._id) return;
    try {
      setIsSubmitting(true);
      await adminApi.deleteCollection(selectedCollection._id);
      showToast('Đã xóa bộ sưu tập thành công!', 'success');
      setIsDeleteModalOpen(false);
      setSelectedCollection(null);
      await loadCollections();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Lỗi khi xóa bộ sưu tập';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Thêm danh sách điểm đến vào collection (nếu chưa có trong collection khác)
  const handleAddDestinationsToCollection = async (collectionId, destinationIds) => {
    try {
      setIsSubmitting(true);
      const res = await adminApi.addDestinationsToCollection(collectionId, destinationIds);
      const updated = res?.data || res;
      setSelectedCollection(updated);
      showToast('Đã thêm các điểm đến vào bộ sưu tập thành công!', 'success');
      await loadCollections();
      return updated;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Lỗi khi thêm điểm đến vào bộ sưu tập';
      showToast(msg, 'error');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xóa điểm đến khỏi collection
  const handleRemoveDestinationFromCollection = async (collectionId, destinationId) => {
    try {
      setIsSubmitting(true);
      const res = await adminApi.removeDestinationFromCollection(collectionId, destinationId);
      const updated = res?.data || res;
      setSelectedCollection(updated);
      showToast('Đã xóa điểm đến khỏi bộ sưu tập!', 'success');
      await loadCollections();
      return updated;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Lỗi khi xóa điểm đến khỏi bộ sưu tập';
      showToast(msg, 'error');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    collections,
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
    selectedCollection,
    setSelectedCollection,
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
    handleSaveCollection,
    handleDeleteCollection,
    handleAddDestinationsToCollection,
    handleRemoveDestinationFromCollection,
    refreshCollections: loadCollections,
  };
};

export default useAdminCollections;
