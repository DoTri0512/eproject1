import { useState } from 'react';
import adminApi from '../../adminApi';

export const useCreateBookingPlan = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  const createBookingPlan = async (planData) => {
    setIsCreating(true);
    setCreateError(null);
    try {
      const res = await adminApi.createBookingPlan(planData);
      return res?.data || res;
    } catch (err) {
      setCreateError(err.message || 'Không thể tạo đoàn khởi hành');
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createBookingPlan,
    isCreating,
    createError,
  };
};

export default useCreateBookingPlan;

