import { useState } from 'react';
import adminApi from '../../adminApi';

export const useUpdateBookingPlan = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const assignGuideToPlan = async (planId, guideId) => {
    setIsUpdating(true);
    setUpdateError(null);
    try {
      const res = await adminApi.assignGuideToPlan(planId, guideId);
      return res?.data || res;
    } catch (err) {
      setUpdateError(err.message || 'Không thể phân công Hướng dẫn viên');
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const updatePlanStatus = async (planId, status) => {
    setIsUpdating(true);
    setUpdateError(null);
    try {
      const res = await adminApi.updatePlanStatus(planId, status);
      return res?.data || res;
    } catch (err) {
      setUpdateError(err.message || 'Cập nhật trạng thái đoàn thất bại');
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const syncBookingPlans = async () => {
    setIsSyncing(true);
    setUpdateError(null);
    try {
      const res = await adminApi.syncBookingPlans();
      return res;
    } catch (err) {
      setUpdateError(err.message || 'Đồng bộ đoàn khởi hành thất bại');
      throw err;
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    assignGuideToPlan,
    updatePlanStatus,
    syncBookingPlans,
    isUpdating,
    isSyncing,
    updateError,
  };
};

export default useUpdateBookingPlan;

