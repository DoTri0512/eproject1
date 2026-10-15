import { useSelector, useDispatch } from 'react-redux';
import { logoutUser, forceLogout } from '../features/auth/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

  const isAdmin = user?.role === 'admin';

  const logout = () => {
    dispatch(logoutUser());
  };

  const handleForceLogout = () => {
    dispatch(forceLogout());
  };

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    isLoading,
    error,
    logout,
    forceLogout: handleForceLogout,
  };
};

export default useAuth;
