import React from 'react';

/**
 * Common Pagination Component
 * @param {number} currentPage - Trang hiện tại (1-indexed)
 * @param {number} totalPages - Tổng số trang
 * @param {number} totalItems - Tổng số bản ghi
 * @param {number} limit - Số bản ghi trên mỗi trang
 * @param {function} onPageChange - Callback khi đổi trang: (page) => void
 * @param {function} [onLimitChange] - (Tùy chọn) Callback đổi số lượng bản ghi: (limit) => void
 * @param {number} [showingCount] - Số bản ghi đang hiển thị ở trang hiện tại
 */
export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  limit = 10,
  onPageChange,
  onLimitChange,
  showingCount,
}) => {
  if (totalItems <= 0 && totalPages <= 1) return null;

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = showingCount !== undefined 
    ? (currentPage - 1) * limit + showingCount 
    : Math.min(currentPage * limit, totalItems);

  // Generate page numbers with ellipses
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="p-4 sm:p-5 border-t border-slate-200/80 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Left: Summary text & Limit selector */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
        <div>
          Hiển thị <span className="font-bold text-slate-800">{startItem}-{endItem}</span> trên tổng số{' '}
          <span className="font-bold text-slate-800">{totalItems}</span> bản ghi
        </div>

        {onLimitChange && (
          <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200">
            <span className="text-[11px] text-slate-400">Hiển thị:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="h-8 px-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 outline-none focus:border-primary cursor-pointer"
            >
              <option value={10}>10 / trang</option>
              <option value={20}>20 / trang</option>
              <option value={50}>50 / trang</option>
              <option value={100}>100 / trang</option>
            </select>
          </div>
        )}
      </div>

      {/* Right: Page navigation buttons */}
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-9 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
          title="Trang trước"
        >
          <span className="material-symbols-outlined text-[16px]">chevron_left</span>
          <span className="hidden sm:inline">Trước</span>
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="w-8 h-9 flex items-center justify-center text-slate-400 font-bold text-xs"
                >
                  •••
                </span>
              );
            }

            const isActive = currentPage === page;
            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={`min-w-9 h-9 px-2 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-9 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
          title="Trang sau"
        >
          <span className="hidden sm:inline">Sau</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
