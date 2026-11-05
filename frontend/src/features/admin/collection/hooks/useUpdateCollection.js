import { useState } from 'react';
import adminApi from '../../adminApi';

export const useUpdateCollection = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const updateCollection = async (id, formData) => {
    setIsUpdating(true);
    setUpdateError(null);
    try {
      const res = await adminApi.updateCollection(id, formData);
      return res?.data || res;
    } catch (err) {
      setUpdateError(err.message || 'Cập nhật bộ sưu tập thất bại');
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateCollection,
    isUpdating,
    updateError,
  };
};

export default useUpdateCollection;

