import { useState } from 'react';
import destinationApi from '@/features/user/destination/destinationApi';

export const useDeleteDestination = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const deleteDestination = async (id) => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await destinationApi.delete(id);
      return res?.data || res;
    } catch (err) {
      setDeleteError(err.message || 'Xóa điểm đến thất bại');
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteDestination,
    isDeleting,
    deleteError,
  };
};

export default useDeleteDestination;

