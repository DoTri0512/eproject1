import { useState, useEffect } from 'react';
import adminApi from '../../adminApi';
import useGetAdminCollections from './useGetAdminCollections';
import useUpdateCollection from './useUpdateCollection';
import useDeleteCollection from './useDeleteCollection';

export {
  useGetAdminCollections,
  useUpdateCollection,
  useDeleteCollection,
};

export const useAdminCollections = () => {
  const query = useGetAdminCollections();
  const { updateCollection, isUpdating } = useUpdateCollection();
  const { deleteCollection, isDeleting } = useDeleteCollection();

  // Modals & Selection
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState(null);

  // Sync selectedCollection khi collections list được refetch
  useEffect(() => {
    if (selectedCollection?._id && query.collections?.length > 0) {
      const updated = query.collections.find((c) => c._id === selectedCollection._id);
      if (updated) setSelectedCollection(updated);
    }
  }, [query.collections]);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenEdit = (collection) => {
    setSelectedCollection(collection);
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (collection) => {
    setSelectedCollection(collection);
    setIsDeleteModalOpen(true);
  };

  const handleOpenDetail = (collection) => {
    setSelectedCollection(collection);
    setIsDetailModalOpen(true);
  };

  const handleSaveCollection = async (formData) => {
    if (!selectedCollection?._id) return;
    try {
      await updateCollection(selectedCollection._id, formData);
      showToast('Cập nhật bộ sưu tập thành công!', 'success');
      setIsFormModalOpen(false);
      setSelectedCollection(null);
      await query.refetch();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Lỗi khi lưu thông tin bộ sưu tập';
      showToast(msg, 'error');
      throw err;
    }
  };

  const handleDeleteCollection = async () => {
    if (!selectedCollection?._id) return;
    try {
      await deleteCollection(selectedCollection._id);
      showToast('Đã xóa bộ sưu tập thành công!', 'success');
      setIsDeleteModalOpen(false);
      setSelectedCollection(null);
      await query.refetch();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Lỗi khi xóa bộ sưu tập';
      showToast(msg, 'error');
    }
  };

  const handleAddDestinationsToCollection = async (collectionId, destinationIds) => {
    try {
      await adminApi.addDestinationsToCollection(collectionId, destinationIds);
      showToast('Thêm điểm đến vào bộ sưu tập thành công!', 'success');
      await query.refetch();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Lỗi khi thêm điểm đến';
      showToast(msg, 'error');
      throw err;
    }
  };

  const handleRemoveDestinationFromCollection = async (collectionId, destinationId) => {
    try {
      await adminApi.removeDestinationFromCollection(collectionId, destinationId);
      showToast('Đã xóa điểm đến khỏi bộ sưu tập!', 'success');
      await query.refetch();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Lỗi khi xóa điểm đến';
      showToast(msg, 'error');
      throw err;
    }
  };

  const isSubmitting = isUpdating || isDeleting;

  return {
    ...query,
    isSubmitting,
    selectedCollection,
    setSelectedCollection,
    isFormModalOpen,
    setIsFormModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isDetailModalOpen,
    setIsDetailModalOpen,
    toastMessage,
    handleOpenEdit,
    handleOpenDelete,
    handleOpenDetail,
    handleSaveCollection,
    handleDeleteCollection,
    handleAddDestinationsToCollection,
    handleRemoveDestinationFromCollection,
    refreshCollections: query.refetch,
  };
};

export default useAdminCollections;
