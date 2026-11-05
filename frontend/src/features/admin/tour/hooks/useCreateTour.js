import { useState } from 'react';
import adminApi from '../../adminApi';

export const useCreateTour = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  const createTour = async (tourData) => {
    setIsCreating(true);
    setCreateError(null);
    try {
      const res = await adminApi.createTour(tourData);
      return res?.data || res;
    } catch (err) {
      setCreateError(err.message || 'Thêm mới tour thất bại');
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createTour,
    isCreating,
    createError,
  };
};

export default useCreateTour;

