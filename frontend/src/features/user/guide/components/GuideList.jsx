import React from "react";
import GuideItem from "./GuideItem";

export const GuideList = ({
  isLoading,
  guides = [],
  pagination = {},
  currentPage = 1,
  onPageChange,
  onSelectGuide,
  onResetFilters,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse flex flex-col gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/2" />
                <div className="h-3 bg-slate-100 rounded w-3/4" />
              </div>
            </div>
            <div className="h-3 bg-slate-100 rounded w-full" />
            <div className="h-3 bg-slate-100 rounded w-2/3" />
            <div className="h-10 bg-slate-200 rounded-xl w-full mt-2" />
          </div>
        ))}
      </div>
    );
  }

  if (guides.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center max-w-lg mx-auto my-12">
        <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-[32px]">
            person_search
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">
          Không tìm thấy hướng dẫn viên phù hợp
        </h3>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          Hãy thử chọn ngôn ngữ hoặc chuyên môn khác để tìm kiếm lại.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors shadow-sm cursor-pointer"
          >
            Đặt lại bộ lọc
          </button>
        )}
      </div>
    );
  }

  const totalPages = pagination?.totalPages || 1;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide) => (
          <GuideItem
            key={guide._id || guide.id}
            guide={guide}
            onSelect={onSelectGuide}
          />
        ))}
      </div>

      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              chevron_left
            </span>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`w-10 h-10 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                currentPage === p
                  ? "bg-primary text-white shadow-xs"
                  : "border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              chevron_right
            </span>
          </button>
        </div>
      )}
    </>
  );
};

export default GuideList;

