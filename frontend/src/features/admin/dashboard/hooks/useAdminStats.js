import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminDashboardStats } from '../dashboardSlice';

export const useAdminStats = () => {
  const dispatch = useDispatch();
  const { stats, isLoading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchAdminDashboardStats());
  }, [dispatch]);

  const refetch = () => {
    dispatch(fetchAdminDashboardStats());
  };

  return {
    stats,
    isLoading,
    error,
    refetch,
  };
};

export default useAdminStats;
