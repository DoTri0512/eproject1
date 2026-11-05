import { useState } from 'react';
import adminApi from '../../adminApi';
import useGetAdminGuides from './useGetAdminGuides';
import useCreateGuide from './useCreateGuide';
import useUpdateGuide from './useUpdateGuide';
import useDeleteGuide from './useDeleteGuide';

export {
  useGetAdminGuides,
  useCreateGuide,
  useUpdateGuide,
  useDeleteGuide,
};

export const useAdminGuides = () => {
  const query = useGetAdminGuides();
  const { createGuide, isCreating } = useCreateGuide();
  const { updateGuide, addDestinationsToGuide, removeDestinationFromGuide, isUpdating } = useUpdateGuide();
  const { deleteGuide, isDeleting } = useDeleteGuide();

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
      const freshGuide = await adminApi.getGuideByIdOrSlug(guide._id || guide.slug);
      const data = freshGuide?.data || freshGuide;
      setSelectedGuide(data);
    } catch {
      setSelectedGuide(guide);
    }
    setIsDetailModalOpen(true);
  };

  const handleSaveGuide = async (formData) => {
    try {
      if (selectedGuide?._id) {
        await updateGuide(selectedGuide._id, formData);
        showToast('Cập nhật hướng dẫn viên thành công!', 'success');
      } else {
        await createGuide(formData);
        showToast('Thêm mới hướng dẫn viên thành công!', 'success');
      }
      setIsFormModalOpen(false);
      setSelectedGuide(null);
      await query.refetch();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Lỗi khi lưu thông tin hướng dẫn viên';
      showToast(msg, 'error');
      throw err;
    }
  };

  const handleDeleteGuide = async () => {
    if (!selectedGuide?._id) return;
    try {
      await deleteGuide(selectedGuide._id);
      showToast('Đã xóa hướng dẫn viên thành công!', 'success');
      setIsDeleteModalOpen(false);
      setSelectedGuide(null);
      await query.refetch();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Lỗi khi xóa hướng dẫn viên';
      showToast(msg, 'error');
    }
  };

  const handleAddDestinationsToGuide = async (guideId, destinationIds) => {
    try {
      const updated = await addDestinationsToGuide(guideId, destinationIds);
      setSelectedGuide(updated);
      showToast('Đã thêm điểm đến phụ trách thành công!', 'success');
      await query.refetch();
      return updated;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Lỗi khi thêm điểm đến phụ trách';
      showToast(msg, 'error');
      throw err;
    }
  };

  const handleRemoveDestinationFromGuide = async (guideId, destinationId) => {
    try {
      const updated = await removeDestinationFromGuide(guideId, destinationId);
      setSelectedGuide(updated);
      showToast('Đã gỡ bỏ điểm đến khỏi danh sách phụ trách!', 'success');
      await query.refetch();
      return updated;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Lỗi khi gỡ bỏ điểm đến';
      showToast(msg, 'error');
      throw err;
    }
  };

  const isSubmitting = isCreating || isUpdating || isDeleting;

  return {
    ...query,
    isSubmitting,
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
    refreshGuides: query.refetch,
  };
};

export default useAdminGuides;
