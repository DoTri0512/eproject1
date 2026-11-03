import React from 'react';
import useFavourites from '../hooks/useFavourites';

export const FavouriteButton = ({ destination, className = '' }) => {
  const { isFavourite, toggleFavourite } = useFavourites();
  const destId = destination?._id || destination?.id;
  const active = isFavourite(destId);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (destination) {
      toggleFavourite(destination);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={active ? 'Bỏ lưu yêu thích' : 'Lưu vào yêu thích'}
      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all backdrop-blur-md shadow-sm ${className} ${
        active
          ? '!bg-rose-50 !text-rose-500 scale-105 hover:!bg-rose-100 hover:!text-rose-600'
          : 'bg-white/80 text-slate-500 hover:text-rose-500 hover:bg-white hover:scale-105'
      }`}
    >
      <span
        className={`material-symbols-outlined text-[20px] transition-transform ${
          active ? 'font-variation-fill scale-110 text-rose-500' : ''
        }`}
        style={active ? { fontVariationSettings: "'FILL' 1" } : {}}
      >
        favorite
      </span>
    </button>
  );
};

export default FavouriteButton;
