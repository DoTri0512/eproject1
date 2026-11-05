import { useState } from 'react';
import adminApi from '../../adminApi';

export const useCreateCollection = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  const createCollection = async (formData) => {
    setIsCreating(true);
    setCreateError(null);
    try {
      const res = await adminApi.createCollection(formData);
      return res?.data || res;
    } catch (err) {
      setCreateError(err.message || 'Thêm mới bộ sưu tập thất bại');
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createCollection,
    isCreating,
    createError,
  };
};

export default useCreateCollection;

