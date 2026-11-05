import { useState } from 'react';
import adminApi from '../../adminApi';

export const useUpdateTour = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const updateTour = async (id, tourData) => {
    setIsUpdating(true);
    setUpdateError(null);
    try {
      const res = await adminApi.updateTour(id, tourData);
      return res?.data || res;
    } catch (err) {
      setUpdateError(err.message || 'Cập nhật tour thất bại');
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateTour,
    isUpdating,
    updateError,
  };
};

export default useUpdateTour;

