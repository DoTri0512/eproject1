import { useDispatch } from 'react-redux';
import { clearAllFavourites } from '../favouriteSlice';

export const useClearFavourites = () => {
  const dispatch = useDispatch();

  const handleClearAll = () => {
    return dispatch(clearAllFavourites());
  };

  return {
    clearAll: handleClearAll,
  };
};

export default useClearFavourites;

