import { useDispatch } from 'react-redux';
import { toggleFavourite } from '../favouriteSlice';

export const useToggleFavourite = () => {
  const dispatch = useDispatch();

  const handleToggle = (destination) => {
    return dispatch(toggleFavourite(destination));
  };

  return {
    toggleFavourite: handleToggle,
  };
};

export default useToggleFavourite;

