import { useState } from 'react';
import adminApi from '../../adminApi';
import useGetAdminTours from './useGetAdminTours';
import useCreateTour from './useCreateTour';
import useUpdateTour from './useUpdateTour';
import useDeleteTour from './useDeleteTour';

export {
  useGetAdminTours,
  useCreateTour,
  useUpdateTour,
  useDeleteTour,
};

export const useAdminTours = () => {
  const query = useGetAdminTours();
  const { createTour, isCreating } = useCreateTour();
  const { updateTour, isUpdating } = useUpdateTour();
  const { deleteTour, isDeleting } = useDeleteTour();

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);

  // Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenCreate = () => {
    setSelectedTour(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (tour) => {
    setSelectedTour(tour);
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (tour) => {
    setSelectedTour(tour);
    setIsDeleteModalOpen(true);
  };

  const handleOpenDetail = (tour) => {
    setSelectedTour(tour);
    setIsDetailModalOpen(true);
  };

  const handleSaveTour = async (tourData) => {
    try {
      if (selectedTour?._id) {
        await updateTour(selectedTour._id, tourData);
        showToast(`Cập nhật tour "${tourData.title}" thành công!`);
      } else {
        await createTour(tourData);
        showToast(`Thêm mới tour "${tourData.title}" thành công!`);
      }
      setIsFormModalOpen(false);
      setSelectedTour(null);
      await query.refetch();
      return true;
    } catch (err) {
      showToast(err.message || 'Có lỗi xảy ra khi lưu tour', 'error');
      return false;
    }
  };

  const handleDeleteTour = async () => {
    if (!selectedTour?._id) return;
    try {
      await deleteTour(selectedTour._id);
      showToast(`Đã xóa tour "${selectedTour.title}" khỏi hệ thống!`);
      setIsDeleteModalOpen(false);
      setSelectedTour(null);
      await query.refetch();
    } catch (err) {
      showToast(err.message || 'Không thể xóa tour này', 'error');
    }
  };

  const handleToggleStatus = async (tour) => {
    const newStatus = (tour.status || 'active') === 'active' ? 'inactive' : 'active';
    try {
      const res = await adminApi.updateTour(tour._id, { status: newStatus });
      const updated = res.data || res;
      query.setTours((prev) =>
        prev.map((t) => (t._id === tour._id ? { ...t, status: newStatus, ...updated } : t))
      );
      showToast(
        `Đã chuyển tour sang trạng thái ${newStatus === 'active' ? 'Đang mở bán' : 'Tạm dừng bán'}!`
      );
    } catch (err) {
      showToast(err.response?.data?.message || 'Không thể đổi trạng thái tour', 'error');
    }
  };

  const isSubmitting = isCreating || isUpdating || isDeleting;

  return {
    ...query,
    filteredTours: query.tours,
    isFormModalOpen,
    setIsFormModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isDetailModalOpen,
    setIsDetailModalOpen,
    selectedTour,
    isSubmitting,
    toastMessage,
    showToast,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDelete,
    handleOpenDetail,
    handleSaveTour,
    handleDeleteTour,
    handleToggleStatus,
    reloadTours: query.refetch,
  };
};

export default useAdminTours;
