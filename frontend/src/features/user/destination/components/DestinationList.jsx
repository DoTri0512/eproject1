import React from "react";
import DestinationItem from "./DestinationItem";

export const DestinationList = ({
  isLoading,
  destinations = [],
  totalCount = 0,
  onResetFilters,
  onLoadMore,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm animate-pulse flex flex-col gap-3"
          >
            <div className="aspect-[16/9] bg-slate-200 rounded-xl w-full" />
            <div className="h-5 bg-slate-200 rounded w-2/3" />
            <div className="h-4 bg-slate-100 rounded w-full" />
            <div className="h-4 bg-slate-100 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (destinations.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center max-w-lg mx-auto my-12">
        <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-[32px]">
            travel_explore
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">
          Không tìm thấy điểm đến phù hợp
        </h3>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          Hãy thử tìm kiếm với từ khóa khác hoặc xóa bớt các tiêu chí lọc để xem
          thêm nhiều điểm đến thú vị.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors shadow-sm cursor-pointer"
          >
            Xóa tất cả bộ lọc
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((destination) => (
          <DestinationItem
            key={destination._id || destination.slug}
            destination={destination}
          />
        ))}
      </div>

      {onLoadMore && destinations.length < totalCount && (
        <div className="text-center mt-12">
          <button
            type="button"
            onClick={onLoadMore}
            className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm inline-flex items-center gap-2 cursor-pointer"
          >
            <span>
              Xem thêm điểm đến ({totalCount - destinations.length})
            </span>
            <span className="material-symbols-outlined text-[18px]">
              expand_more
            </span>
          </button>
        </div>
      )}
    </>
  );
};

export default DestinationList;

