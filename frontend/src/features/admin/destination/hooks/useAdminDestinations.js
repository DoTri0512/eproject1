import { useState } from 'react';
import useGetAdminDestinations from './useGetAdminDestinations';
import useCreateDestination from './useCreateDestination';
import useUpdateDestination from './useUpdateDestination';
import useDeleteDestination from './useDeleteDestination';

export {
  useGetAdminDestinations,
  useCreateDestination,
  useUpdateDestination,
  useDeleteDestination,
};

export const useAdminDestinations = () => {
  const query = useGetAdminDestinations();
  const { createDestination, isCreating } = useCreateDestination();
  const { updateDestination, isUpdating } = useUpdateDestination();
  const { deleteDestination, isDeleting } = useDeleteDestination();

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenCreate = () => {
    setSelectedDestination(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (dest) => {
    setSelectedDestination(dest);
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (dest) => {
    setSelectedDestination(dest);
    setIsDeleteModalOpen(true);
  };

  const handleOpenDetail = (dest) => {
    setSelectedDestination(dest);
    setIsDetailModalOpen(true);
  };

  const handleSaveDestination = async (formData) => {
    try {
      if (selectedDestination && selectedDestination._id) {
        await updateDestination(selectedDestination._id, formData);
        showToast(`Cập nhật điểm đến "${formData.name}" thành công!`);
      } else {
        await createDestination(formData);
        showToast(`Thêm mới điểm đến "${formData.name}" thành công!`);
      }
      setIsFormModalOpen(false);
      setSelectedDestination(null);
      await query.refetch();
      return true;
    } catch (err) {
      showToast(err.message || 'Lưu điểm đến thất bại', 'error');
      return false;
    }
  };

  const handleDeleteDestination = async () => {
    if (!selectedDestination?._id) return;
    try {
      await deleteDestination(selectedDestination._id);
      showToast(`Đã xóa điểm đến "${selectedDestination.name}" thành công!`);
      setIsDeleteModalOpen(false);
      setSelectedDestination(null);
      await query.refetch();
    } catch (err) {
      showToast(err.message || 'Không thể xóa điểm đến này', 'error');
    }
  };

  const isSubmitting = isCreating || isUpdating || isDeleting;

  return {
    ...query,
    isFormModalOpen,
    setIsFormModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isDetailModalOpen,
    setIsDetailModalOpen,
    selectedDestination,
    isSubmitting,
    toastMessage,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDelete,
    handleOpenDetail,
    handleSaveDestination,
    handleDeleteDestination,
  };
};

export default useAdminDestinations;
