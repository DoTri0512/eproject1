import React from 'react';

export const DestinationFilter = ({
  filters,
  onChange,
  onReset,
  className = '',
}) => {
  const regions = ['Tất cả', 'Miền Bắc', 'Miền Trung', 'Tây Nguyên', 'Miền Nam'];
  const themes = ['Tất cả', 'Biển đảo', 'Di sản', 'Núi rừng', 'Khám phá mạo hiểm', 'Nghỉ dưỡng', 'Sinh thái'];
  const budgets = ['Tất cả', 'Tiết kiệm', 'Phổ thông', 'Cao cấp'];
  const seasons = ['Tất cả', 'Mùa Xuân', 'Mùa Hè', 'Mùa Thu', 'Mùa Đông', 'Quanh năm'];

  const hasActiveFilters = Boolean(
    (filters.region && filters.region !== 'Tất cả') ||
    (filters.theme && filters.theme !== 'Tất cả') ||
    (filters.budget && filters.budget !== 'Tất cả') ||
    (filters.season && filters.season !== 'Tất cả') ||
    filters.search
  );

  const handleSelect = (key, val) => {
    onChange({
      ...filters,
      [key]: val === 'Tất cả' ? '' : val,
    });
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm sm:text-base">
          <span className="material-symbols-outlined text-primary text-[20px]">
            tune
          </span>
          <span>Bộ Lọc Điểm Đến</span>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1 hover:underline transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">restart_alt</span>
            <span>Xóa tất cả</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Region */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Vùng miền
          </label>
          <select
            value={filters.region || 'Tất cả'}
            onChange={(e) => handleSelect('region', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Travel Theme */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Chủ đề du lịch
          </label>
          <select
            value={filters.theme || 'Tất cả'}
            onChange={(e) => handleSelect('theme', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            {themes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Budget Band */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Mức ngân sách
          </label>
          <select
            value={filters.budget || 'Tất cả'}
            onChange={(e) => handleSelect('budget', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            {budgets.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Best Season */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Mùa lý tưởng
          </label>
          <select
            value={filters.season || 'Tất cả'}
            onChange={(e) => handleSelect('season', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            {seasons.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default DestinationFilter;
