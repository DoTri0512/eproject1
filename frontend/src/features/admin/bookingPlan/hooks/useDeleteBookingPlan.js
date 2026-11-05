import { useState } from 'react';
import adminApi from '../../adminApi';

export const useDeleteBookingPlan = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const deleteBookingPlan = async (planId) => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await adminApi.deleteBookingPlan(planId);
      return res?.data || res;
    } catch (err) {
      setDeleteError(err.message || 'Xóa đoàn khởi hành thất bại');
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteBookingPlan,
    isDeleting,
    deleteError,
  };
};

export default useDeleteBookingPlan;

