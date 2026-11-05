import { useState } from 'react';
import adminApi from '../../adminApi';

export const useUpdateContact = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const updateContactStatus = async (id, status) => {
    setIsUpdating(true);
    setUpdateError(null);
    try {
      const res = await adminApi.updateContactStatus(id, status);
      return res?.data || res;
    } catch (err) {
      setUpdateError(err.message || 'Cập nhật trạng thái liên hệ thất bại');
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateContactStatus,
    isUpdating,
    updateError,
  };
};

export default useUpdateContact;

