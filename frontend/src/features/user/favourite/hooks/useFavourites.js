import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchFavourites,
  toggleFavourite,
  syncGuestFavourites,
  clearAllLocalFavourites,
} from '../favouriteSlice';
import useAuth from '../../../../hooks/useAuth';

export const useFavourites = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const { items, isLoading, error } = useSelector((state) => state.favourite);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(syncGuestFavourites()).then(() => {
        dispatch(fetchFavourites());
      });
    } else {
      dispatch(fetchFavourites());
    }
  }, [dispatch, isAuthenticated]);

  const isFavourite = (destinationId) => {
    if (!destinationId) return false;
    return items.some((item) => {
      const id = item.destinationId?._id || item.destinationId?.id || item.destinationId || item._id;
      return id === destinationId;
    });
  };

  const handleToggle = (destination) => {
    return dispatch(toggleFavourite(destination));
  };

  const handleClearAll = () => {
    dispatch(clearAllLocalFavourites());
  };

  return {
    favourites: items,
    count: items.length,
    isLoading,
    error,
    isFavourite,
    toggleFavourite: handleToggle,
    clearAll: handleClearAll,
  };
};

export default useFavourites;
