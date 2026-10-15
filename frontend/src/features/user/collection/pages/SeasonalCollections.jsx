import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import collectionApi from '../collectionApi';
import DestinationCard from '../../destination/components/DestinationCard';

export const SeasonalCollections = () => {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadCollections = async () => {
      setIsLoading(true);
      try {
        const res = await collectionApi.getAll();
        const items = res.items || (Array.isArray(res) ? res : []);
        if (isMounted) {
          setCollections(items);
          if (items.length > 0) {
            setSelectedCollection(items[0]);
          }
        }
      } catch (err) {
        console.error('Error loading collections:', err);
        if (isMounted) {
          setCollections([]);
          setSelectedCollection(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCollections();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-20">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        {/* 1. HERO SECTION */}
        <div className="relative rounded-3xl overflow-hidden mb-10 bg-gradient-to-r from-teal-950 via-slate-900 to-sky-950 text-white p-8 sm:p-12 shadow-md">
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-teal-300 text-xs font-semibold mb-3">
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              <span>Ý TƯỞNG DU LỊCH TRUYỀN CẢM HỨNG</span>
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
              Bộ Sưu Tập Du Lịch Theo Chủ Đề
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Những gợi ý hành trình đặc sắc được tuyển chọn kỹ lưỡng, phù hợp với sở thích xê dịch, mùa trong năm và lịch trình nghỉ ngơi của bạn.
            </p>
          </div>
        </div>

        {/* 2. COLLECTION CARDS GRID */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Khám Phá Các Bộ Sưu Tập Nổi Bật
            </h2>
            <span className="text-xs sm:text-sm font-semibold text-slate-500">
              {collections.length} chủ đề chuyến đi
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-2xl h-56 animate-pulse border border-slate-100" />
              ))}
            </div>
          ) : collections.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((col) => {
                const isSelected = selectedCollection?._id === col._id;
                const count = col.destinationsCount || col.destinations?.length || 0;

                return (
                  <div
                    key={col._id || col.slug}
                    onClick={() => setSelectedCollection(col)}
                    className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 p-6 flex flex-col justify-end min-h-[220px] shadow-sm hover:shadow-hover hover:-translate-y-1 ${
                      isSelected
                        ? 'ring-4 ring-primary ring-offset-2'
                        : 'border border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    {/* Background Image */}
                    <img
                      src={col.image || 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80'}
                      alt={col.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent" />

                    {/* Badges & Content */}
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <div className="flex justify-between items-start">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/20 backdrop-blur-md text-white border border-white/20">
                          {count} điểm đến
                        </span>
                        {isSelected && (
                          <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
                            <span className="material-symbols-outlined text-[16px]">check</span>
                          </span>
                        )}
                      </div>

                      <div className="mt-8">
                        <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-sky-300 transition-colors mb-1.5 leading-snug">
                          {col.name}
                        </h3>
                        <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                          {col.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-100 text-slate-500">
              <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">auto_awesome_motion</span>
              <p className="text-sm font-medium">Hiện chưa có bộ sưu tập nào được công bố.</p>
            </div>
          )}
        </div>

        {/* 3. SELECTED COLLECTION DETAIL VIEW */}
        {selectedCollection && (
          <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm animate-in fade-in duration-300">
            {/* Banner of selected collection */}
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 mb-8 border-b border-slate-100 gap-6">
              <div className="max-w-2xl">
                <span className="text-xs font-bold text-primary tracking-wider uppercase">
                  ĐANG XEM BỘ SƯU TẬP
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 mb-3">
                  {selectedCollection.name}
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {selectedCollection.description}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <Link
                  to="/destinations"
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-50 transition-colors"
                >
                  Khám phá thêm
                </Link>
              </div>
            </div>

            {/* Included Destinations */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800">
                  Các Điểm Đến Nổi Bật Thuộc Bộ Sưu Tập Này
                </h3>
                <span className="text-xs font-semibold text-slate-500">
                  {selectedCollection.destinations?.length || 0} điểm đến
                </span>
              </div>

              {selectedCollection.destinations && selectedCollection.destinations.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedCollection.destinations.map((dest) => (
                    <DestinationCard
                      key={dest._id || dest.slug}
                      destination={typeof dest === 'object' ? dest : { _id: dest, name: 'Điểm đến' }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 text-sm">
                  Đang cập nhật danh sách điểm đến cho bộ sưu tập này.
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default SeasonalCollections;
