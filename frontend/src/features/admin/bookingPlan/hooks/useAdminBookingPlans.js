import { useState } from 'react';
import useGetAdminBookingPlans from './useGetAdminBookingPlans';
import useCreateBookingPlan from './useCreateBookingPlan';
import useUpdateBookingPlan from './useUpdateBookingPlan';
import useDeleteBookingPlan from './useDeleteBookingPlan';

export {
  useGetAdminBookingPlans,
  useCreateBookingPlan,
  useUpdateBookingPlan,
  useDeleteBookingPlan,
};

export const useAdminBookingPlans = () => {
  const query = useGetAdminBookingPlans();
  const { createBookingPlan, isCreating } = useCreateBookingPlan();
  const { assignGuideToPlan, updatePlanStatus, syncBookingPlans, isUpdating, isSyncing } = useUpdateBookingPlan();
  const { deleteBookingPlan, isDeleting } = useDeleteBookingPlan();

  // Modals
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isPassengersModalOpen, setIsPassengersModalOpen] = useState(false);
  const [isAssignGuideModalOpen, setIsAssignGuideModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenPassengers = (plan) => {
    setSelectedPlan(plan);
    setIsPassengersModalOpen(true);
  };

  const handleOpenAssignGuide = (plan) => {
    setSelectedPlan(plan);
    setIsAssignGuideModalOpen(true);
  };

  const handleAssignGuide = async (planId, guideId) => {
    try {
      const updated = await assignGuideToPlan(planId, guideId);
      query.setPlans((prev) =>
        prev.map((p) => (p._id === planId ? { ...p, ...updated } : p))
      );
      if (selectedPlan?._id === planId) {
        setSelectedPlan((prev) => ({ ...prev, ...updated }));
      }
      showToast('Phân công Hướng dẫn viên cho đoàn thành công!');
      setIsAssignGuideModalOpen(false);
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Không thể phân công Hướng dẫn viên';
      showToast(msg, 'error');
      return false;
    }
  };

  const handleUpdateStatus = async (planId, status) => {
    try {
      const updated = await updatePlanStatus(planId, status);
      query.setPlans((prev) =>
        prev.map((p) => {
          if (p._id === planId) {
            return {
              ...p,
              ...updated,
              tourId:
                typeof updated.tourId === 'object' && updated.tourId !== null
                  ? updated.tourId
                  : p.tourId,
              guideId: updated.guideId || p.guideId,
            };
          }
          return p;
        })
      );
      if (selectedPlan?._id === planId) {
        setSelectedPlan((prev) => ({
          ...prev,
          ...updated,
          tourId:
            typeof updated.tourId === 'object' && updated.tourId !== null
              ? updated.tourId
              : prev.tourId,
          guideId: updated.guideId || prev.guideId,
        }));
      }
      showToast('Cập nhật trạng thái đoàn khởi hành thành công!');
      return true;
    } catch (err) {
      showToast(err.response?.data?.message || 'Cập nhật trạng thái thất bại', 'error');
      return false;
    }
  };

  const handleSyncPlans = async () => {
    try {
      const res = await syncBookingPlans();
      showToast(res.message || 'Đồng bộ đoàn khởi hành từ các đơn tour thành công!');
      await query.refetch();
      return true;
    } catch (err) {
      showToast(err.response?.data?.message || 'Đồng bộ thất bại', 'error');
      return false;
    }
  };

  const handleCreatePlan = async (planData) => {
    try {
      await createBookingPlan(planData);
      showToast('Tạo đoàn khởi hành mới thành công!');
      setIsCreateModalOpen(false);
      await query.refetch();
      return true;
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Không thể tạo đoàn khởi hành', 'error');
      return false;
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đoàn khởi hành này?')) return false;
    try {
      await deleteBookingPlan(planId);
      showToast('Đã xóa đoàn khởi hành thành công!');
      query.setPlans((prev) => prev.filter((p) => p._id !== planId));
      return true;
    } catch (err) {
      showToast(err.response?.data?.message || 'Xóa đoàn khởi hành thất bại', 'error');
      return false;
    }
  };

  const isSubmitting = isCreating || isUpdating || isDeleting;

  return {
    ...query,
    isSyncing,
    isSubmitting,
    selectedPlan,
    isPassengersModalOpen,
    setIsPassengersModalOpen,
    isAssignGuideModalOpen,
    setIsAssignGuideModalOpen,
    isCreateModalOpen,
    setIsCreateModalOpen,
    toastMessage,
    showToast,
    handleOpenPassengers,
    handleOpenAssignGuide,
    handleAssignGuide,
    handleUpdateStatus,
    handleSyncPlans,
    handleCreatePlan,
    handleDeletePlan,
    reloadPlans: query.refetch,
  };
};

export default useAdminBookingPlans;
