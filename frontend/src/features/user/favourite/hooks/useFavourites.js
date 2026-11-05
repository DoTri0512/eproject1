import useGetFavourites from './useGetFavourites';
import useToggleFavourite from './useToggleFavourite';
import useClearFavourites from './useClearFavourites';

export {
  useGetFavourites,
  useToggleFavourite,
  useClearFavourites,
};

export const useFavourites = () => {
  const query = useGetFavourites();
  const { toggleFavourite } = useToggleFavourite();
  const { clearAll } = useClearFavourites();

  return {
    ...query,
    toggleFavourite,
    clearAll,
  };
};

export default useFavourites;
