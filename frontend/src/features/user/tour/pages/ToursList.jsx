import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTours } from '../tourSlice';
import TourCard from '../components/TourCard';
import { useEffect } from 'react';

const ToursList = () => {
  const dispatch = useDispatch();
  const { items: tours, isLoading } = useSelector((state) => state.tour);
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState('active');
  const [visibleCount, setVisibleCount] = useState(9);

  useEffect(() => {
    dispatch(fetchTours({ status: 'active', limit: 100 }));
  }, [dispatch]);

  // Client-side search
  const filteredTours = useMemo(() => {
    let list = [...tours];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.title?.toLowerCase().includes(q) ||
          t.destinationId?.name?.toLowerCase().includes(q) ||
          t.overview?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [tours, search]);

  const displayedTours = filteredTours.slice(0, visibleCount);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    setVisibleCount(9);
    const params = new URLSearchParams();
    if (val) params.set('search', val);
    setSearchParams(params);
  };

  const handleClear = () => {
    setSearch('');
    setSearchParams(new URLSearchParams());
    setVisibleCount(9);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-[115px] pb-20">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        {/* Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-8 bg-gradient-to-r from-indigo-700 via-sky-600 to-sky-500 text-white p-8 sm:p-12 shadow-md">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-sky-200 text-xs font-semibold mb-3">
              <span className="material-symbols-outlined text-[16px]">luggage</span>
              <span>KHÁM PHÁ CÁC CHUYẾN ĐI</span>
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
              Danh Sách Tour Du Lịch
            </h1>
            <p className="text-sky-100 text-sm sm:text-base leading-relaxed mb-6">
              Tìm kiếm và đặt chuyến du lịch phù hợp với lịch trình và ngân sách của bạn.
            </p>

            {/* Search bar */}
            <div className="relative max-w-lg mx-auto">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Tìm kiếm tour theo tên, điểm đến..."
                className="w-full pl-10 pr-10 py-3.5 rounded-2xl text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white shadow-sm"
              />
              {search && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results info */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
          <p className="text-sm text-slate-600 font-medium">
            {isLoading ? (
              'Đang tải...'
            ) : (
              <>
                Tìm thấy{' '}
                <span className="font-extrabold text-primary">{filteredTours.length}</span>{' '}
                tour du lịch
                {search && (
                  <>
                    {' '}
                    cho "<span className="font-bold">{search}</span>"
                  </>
                )}
              </>
            )}
          </p>
          {search && (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">close</span>
              Xóa tìm kiếm
            </button>
          )}
        </div>

        {/* Loading skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-pulse">
                <div className="aspect-[16/10] bg-slate-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                  <div className="h-3 bg-slate-100 rounded w-2/3" />
                  <div className="h-8 bg-slate-200 rounded-xl mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tour Grid */}
        {!isLoading && (
          <>
            {displayedTours.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedTours.map((tour) => (
                    <TourCard key={tour._id} tour={tour} />
                  ))}
                </div>

                {visibleCount < filteredTours.length && (
                  <div className="flex justify-center mt-10">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((prev) => prev + 9)}
                      className="px-8 py-3 rounded-2xl border-2 border-primary text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all"
                    >
                      Xem thêm tour
                      <span className="material-symbols-outlined text-[16px] align-middle ml-1">expand_more</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <span className="material-symbols-outlined text-[56px] text-slate-200 block mb-4">
                  search_off
                </span>
                <h3 className="text-xl font-bold text-slate-700 mb-2">
                  {search ? 'Không tìm thấy tour phù hợp' : 'Chưa có tour nào'}
                </h3>
                <p className="text-slate-400 text-sm mb-6">
                  {search
                    ? 'Thử từ khóa khác hoặc xóa bộ lọc'
                    : 'Các tour du lịch sẽ được cập nhật sớm.'}
                </p>
                {search && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm"
                  >
                    Xóa tìm kiếm
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ToursList;
