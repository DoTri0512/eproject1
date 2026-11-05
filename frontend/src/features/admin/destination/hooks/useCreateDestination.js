import { useState } from 'react';
import destinationApi from '@/features/user/destination/destinationApi';

export const useCreateDestination = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  const createDestination = async (formData) => {
    setIsCreating(true);
    setCreateError(null);
    try {
      const res = await destinationApi.create(formData);
      return res?.data || res;
    } catch (err) {
      setCreateError(err.message || 'Thêm mới điểm đến thất bại');
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createDestination,
    isCreating,
    createError,
  };
};

export default useCreateDestination;

