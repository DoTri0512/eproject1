import React from "react";
import DestinationFilter from "../DestinationFilter";

export const DestinationMobileFilterDrawer = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className="relative ml-auto w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <h3 className="font-bold text-slate-900 text-lg">
              Bộ Lọc Điểm Đến
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <DestinationFilter
            filters={filters}
            onChange={onFilterChange}
            onReset={onResetFilters}
          />
        </div>

        <div className="pt-6 border-t border-slate-100 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-md"
          >
            Áp dụng bộ lọc
          </button>
        </div>
      </div>
    </div>
  );
};

export default DestinationMobileFilterDrawer;

