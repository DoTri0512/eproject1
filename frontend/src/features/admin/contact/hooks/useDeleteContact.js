import { useState } from 'react';
import adminApi from '../../adminApi';

export const useDeleteContact = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const deleteContact = async (id) => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await adminApi.deleteContact(id);
      return res?.data || res;
    } catch (err) {
      setDeleteError(err.message || 'Xóa liên hệ thất bại');
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteContact,
    isDeleting,
    deleteError,
  };
};

export default useDeleteContact;

