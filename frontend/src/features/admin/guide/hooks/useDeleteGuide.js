import { useState } from 'react';
import adminApi from '../../adminApi';

export const useDeleteGuide = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const deleteGuide = async (id) => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await adminApi.deleteGuide(id);
      return res?.data || res;
    } catch (err) {
      setDeleteError(err.message || 'Xóa hướng dẫn viên thất bại');
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteGuide,
    isDeleting,
    deleteError,
  };
};

export default useDeleteGuide;

