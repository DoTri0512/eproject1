import { useState } from 'react';
import adminApi from '../../adminApi';

export const useUpdateGuide = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const updateGuide = async (id, formData) => {
    setIsUpdating(true);
    setUpdateError(null);
    try {
      const res = await adminApi.updateGuide(id, formData);
      return res?.data || res;
    } catch (err) {
      setUpdateError(err.message || 'Cập nhật hướng dẫn viên thất bại');
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const addDestinationsToGuide = async (guideId, destinationIds) => {
    setIsUpdating(true);
    setUpdateError(null);
    try {
      const res = await adminApi.addDestinationsToGuide(guideId, destinationIds);
      return res?.data || res;
    } catch (err) {
      setUpdateError(err.message || 'Thêm điểm đến cho hướng dẫn viên thất bại');
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const removeDestinationFromGuide = async (guideId, destinationId) => {
    setIsUpdating(true);
    setUpdateError(null);
    try {
      const res = await adminApi.removeDestinationFromGuide(guideId, destinationId);
      return res?.data || res;
    } catch (err) {
      setUpdateError(err.message || 'Gỡ điểm đến khỏi hướng dẫn viên thất bại');
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateGuide,
    addDestinationsToGuide,
    removeDestinationFromGuide,
    isUpdating,
    updateError,
  };
};

export default useUpdateGuide;

