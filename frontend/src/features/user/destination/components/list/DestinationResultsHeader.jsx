import React from "react";

export const DestinationResultsHeader = ({
  isLoading,
  totalCount,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 mb-6 border-b border-slate-200">
      <div className="text-sm font-semibold text-slate-700">
        {isLoading ? (
          <span>Đang tìm kiếm điểm đến...</span>
        ) : (
          <span>
            Hiển thị{" "}
            <span className="text-primary font-bold">{totalCount}</span> điểm
            đến phù hợp
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        <label className="text-xs font-medium text-slate-500 whitespace-nowrap">
          Sắp xếp theo:
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
        >
          <option value="newest">Mới nhất</option>
          <option value="name-asc">Tên A-Z</option>
          <option value="name-desc">Tên Z-A</option>
        </select>
      </div>
    </div>
  );
};

export default DestinationResultsHeader;

