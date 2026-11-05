import React from "react";
import { useNavigate } from "react-router-dom";
import FavouriteItem from "./FavouriteItem";

export const FavouriteList = ({
  isLoading,
  favourites = [],
  count = 0,
  onRemove,
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm animate-pulse"
          >
            <div className="aspect-[16/9] bg-slate-200 rounded-xl mb-3" />
            <div className="h-5 bg-slate-200 rounded w-2/3 mb-2" />
            <div className="h-4 bg-slate-100 rounded w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (count === 0 || favourites.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center max-w-lg mx-auto my-12">
        <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto mb-5">
          <span className="material-symbols-outlined text-[40px]">
            favorite_border
          </span>
        </div>
        <h3 className="text-xl font-extrabold text-slate-800 mb-2">
          Bạn chưa lưu điểm đến yêu thích nào!
        </h3>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed max-w-sm mx-auto">
          Hãy nhấn biểu tượng trái tim tại các điểm đến du lịch để tạo danh
          sách mong ước cho hành trình của riêng bạn.
        </p>
        <button
          type="button"
          onClick={() => navigate("/destinations")}
          className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-all shadow-md shadow-sky-500/20 inline-flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">
            travel_explore
          </span>
          <span>Khám phá các điểm đến ngay</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {favourites.map((fav) => {
        const dest = fav.destinationId || fav;
        const idOrSlug = dest?.slug || dest?._id || fav._id;
        return (
          <FavouriteItem
            key={idOrSlug}
            favourite={fav}
            onRemove={onRemove}
          />
        );
      })}
    </div>
  );
};

export default FavouriteList;

