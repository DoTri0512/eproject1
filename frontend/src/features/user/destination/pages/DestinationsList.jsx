import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import DestinationCard from '../components/DestinationCard';
import DestinationFilter from '../components/DestinationFilter';
import DestinationSearch from '../components/DestinationSearch';
import useDestinations from '../hooks/useDestinations';

export const DestinationsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state from URL query or defaults
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    region: searchParams.get('region') || '',
    theme: searchParams.get('theme') || '',
    budget: searchParams.get('budget') || '',
    season: searchParams.get('season') || '',
  });

  const [sortBy, setSortBy] = useState('newest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);

  // Sync to API hook
  const { destinations, isLoading } = useDestinations(filters);

  // Update URL and filters
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    const params = new URLSearchParams();
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.region) params.set('region', newFilters.region);
    if (newFilters.theme) params.set('theme', newFilters.theme);
    if (newFilters.budget) params.set('budget', newFilters.budget);
    if (newFilters.season) params.set('season', newFilters.season);
    setSearchParams(params);
    setVisibleCount(9);
  };

  const handleResetFilters = () => {
    const emptyFilters = { search: '', region: '', theme: '', budget: '', season: '' };
    setFilters(emptyFilters);
    setSearchParams(new URLSearchParams());
    setVisibleCount(9);
  };

  // Sort destinations
  const sortedDestinations = useMemo(() => {
    const list = [...destinations];
    if (sortBy === 'name-asc') {
      list.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    } else if (sortBy === 'name-desc') {
      list.sort((a, b) => b.name.localeCompare(a.name, 'vi'));
    }
    return list;
  }, [destinations, sortBy]);

  const displayedDestinations = sortedDestinations.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-20">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        {/* Banner Section */}
        <div className="relative rounded-3xl overflow-hidden mb-8 bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-950 text-white p-8 sm:p-12 shadow-md">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-sky-200 text-xs font-semibold mb-3">
              <span className="material-symbols-outlined text-[16px]">travel_explore</span>
              <span>KHÁM PHÁ VIỆT NAM</span>
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
              Danh Sách Điểm Đến Du Lịch
            </h1>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6 max-w-xl mx-auto">
              Tra cứu thông tin danh thắng, cảnh quan kỳ vĩ và những nét văn hóa đặc sắc trên dải đất hình chữ S.
            </p>

            {/* Search Input */}
            <DestinationSearch
              value={filters.search}
              onChange={(val) => handleFilterChange({ ...filters, search: val })}
            />
          </div>
        </div>

        {/* Filters Topbar (Desktop) & Trigger (Mobile) */}
        <div className="mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex-1">
            <DestinationFilter
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
              className="hidden lg:block"
            />
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm shadow-xs hover:bg-slate-50"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">filter_list</span>
              <span>Bộ lọc</span>
              {(filters.region || filters.theme || filters.budget || filters.season) && (
                <span className="w-2 h-2 rounded-full bg-primary" />
              )}
            </button>
          </div>
        </div>

        {/* Results Header: Count & Sort */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 mb-6 border-b border-slate-200">
          <div className="text-sm font-semibold text-slate-700">
            {isLoading ? (
              <span>Đang tìm kiếm điểm đến...</span>
            ) : (
              <span>
                Hiển thị <span className="text-primary font-bold">{sortedDestinations.length}</span> điểm đến phù hợp
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <label className="text-xs font-medium text-slate-500 whitespace-nowrap">
              Sắp xếp theo:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
            >
              <option value="newest">Mới nhất</option>
              <option value="name-asc">Tên A-Z</option>
              <option value="name-desc">Tên Z-A</option>
            </select>
          </div>
        </div>

        {/* Content State */}
        {isLoading ? (
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
        ) : displayedDestinations.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center max-w-lg mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[32px]">travel_explore</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Không tìm thấy điểm đến phù hợp
            </h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Hãy thử tìm kiếm với từ khóa khác hoặc xóa bớt các tiêu chí lọc để xem thêm nhiều điểm đến thú vị.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors shadow-sm"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        ) : (
          /* Grid of Destinations */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedDestinations.map((destination) => (
              <DestinationCard key={destination._id || destination.slug} destination={destination} />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!isLoading && displayedDestinations.length < sortedDestinations.length && (
          <div className="text-center mt-12">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm inline-flex items-center gap-2"
            >
              <span>Xem thêm điểm đến ({sortedDestinations.length - displayedDestinations.length})</span>
              <span className="material-symbols-outlined text-[18px]">expand_more</span>
            </button>
          </div>
        )}
      </div>

      {/* Mobile Off-canvas Filter Sheet */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <h3 className="font-bold text-slate-900 text-lg">Bộ Lọc Điểm Đến</h3>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <DestinationFilter
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleResetFilters}
              />
            </div>

            <div className="pt-6 border-t border-slate-100 mt-6">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-md"
              >
                Áp dụng bộ lọc
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationsList;
