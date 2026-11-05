import { useState } from 'react';
import destinationApi from '@/features/user/destination/destinationApi';

export const useUpdateDestination = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const updateDestination = async (id, formData) => {
    setIsUpdating(true);
    setUpdateError(null);
    try {
      const res = await destinationApi.update(id, formData);
      return res?.data || res;
    } catch (err) {
      setUpdateError(err.message || 'Cập nhật điểm đến thất bại');
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateDestination,
    isUpdating,
    updateError,
  };
};

export default useUpdateDestination;

