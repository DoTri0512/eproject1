import { useState } from 'react';
import adminApi from '../../adminApi';

export const useDeleteCollection = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const deleteCollection = async (id) => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await adminApi.deleteCollection(id);
      return res?.data || res;
    } catch (err) {
      setDeleteError(err.message || 'Xóa bộ sưu tập thất bại');
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteCollection,
    isDeleting,
    deleteError,
  };
};

export default useDeleteCollection;

