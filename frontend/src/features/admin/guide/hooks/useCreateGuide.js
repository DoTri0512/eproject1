import { useState } from 'react';
import adminApi from '../../adminApi';

export const useCreateGuide = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  const createGuide = async (formData) => {
    setIsCreating(true);
    setCreateError(null);
    try {
      const res = await adminApi.createGuide(formData);
      return res?.data || res;
    } catch (err) {
      setCreateError(err.message || 'Thêm mới hướng dẫn viên thất bại');
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createGuide,
    isCreating,
    createError,
  };
};

export default useCreateGuide;

