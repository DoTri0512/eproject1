import { useState } from 'react';
import adminApi from '../../adminApi';

export const useDeleteTour = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const deleteTour = async (id) => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await adminApi.deleteTour(id);
      return res?.data || res;
    } catch (err) {
      setDeleteError(err.message || 'Xóa tour thất bại');
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteTour,
    isDeleting,
    deleteError,
  };
};

export default useDeleteTour;

