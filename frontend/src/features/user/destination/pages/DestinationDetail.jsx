import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import destinationApi from '../destinationApi';
import tourApi from '../../tour/tourApi';
import FavouriteButton from '../../favourite/components/FavouriteButton';
import TourCard from '../../tour/components/TourCard';

export const DestinationDetail = () => {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();

  const [destination, setDestination] = useState(null);
  const [tours, setTours] = useState([]);
  const [relatedList, setRelatedList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadDetail = async () => {
      setIsLoading(true);
      try {
        let currentDest = null;
        try {
          const res = await destinationApi.getByIdOrSlug(idOrSlug);
          currentDest = res.data || res;
        } catch (err) {
          console.error('Failed to load destination by ID/slug:', err);
        }

        setDestination(currentDest);

        if (currentDest) {
          // Fetch Tours for this destination
          try {
            const tourRes = await tourApi.getByDestination(currentDest._id);
            const tourItems = Array.isArray(tourRes) ? tourRes : tourRes.items || [];
            setTours(tourItems);
          } catch {
            setTours([]);
          }

          // Related destinations
          if (currentDest.relatedDestinations && currentDest.relatedDestinations.length > 0) {
            const fullRelated = currentDest.relatedDestinations.map((rel) => {
              if (typeof rel === 'object' && rel.name) return rel;
              return { _id: rel, name: 'Điểm đến liên quan' };
            });
            setRelatedList(fullRelated);
          } else if (currentDest.region) {
            try {
              const relRes = await destinationApi.getAll({ region: currentDest.region });
              const relItems = relRes.items || (Array.isArray(relRes) ? relRes : []);
              setRelatedList(relItems.filter((d) => d._id !== currentDest._id).slice(0, 3));
            } catch {
              setRelatedList([]);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load destination details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDetail();
  }, [idOrSlug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Đang tải thông tin điểm đến...</p>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20 flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[32px]">error</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Không tìm thấy điểm đến</h2>
        <p className="text-slate-500 text-sm mb-6">Điểm đến này có thể đã bị thay đổi hoặc không tồn tại.</p>
        <button
          onClick={() => navigate('/destinations')}
          className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm"
        >
          Quay lại danh sách điểm đến
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-20 pb-24">
      {/* 1. HERO BANNER SECTION */}
      <section className="relative w-full h-[480px] sm:h-[540px] md:h-[600px] overflow-hidden bg-slate-900">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover object-center brightness-[0.8] scale-105 transform hover:scale-100 transition-transform duration-1000"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80';
          }}
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/30" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col justify-between max-w-[1360px] mx-auto px-4 sm:px-6 pt-6 pb-10 z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-white/80 backdrop-blur-md bg-black/20 w-fit px-3 py-1.5 rounded-full border border-white/10">
            <Link to="/" className="hover:text-white transition-colors">Trang chủ</Link>
            <span className="text-white/40">/</span>
            <Link to="/destinations" className="hover:text-white transition-colors">Điểm đến</Link>
            <span className="text-white/40">/</span>
            <span className="text-sky-300 font-semibold truncate max-w-[200px]">{destination.name}</span>
          </nav>

          {/* Title & Action Bar */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary text-white shadow-xs">
                  {destination.region}
                </span>
                {destination.theme && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/30">
                    {destination.theme}
                  </span>
                )}
                {destination.bestSeason && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/80 backdrop-blur-md text-white flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">sunny</span>
                    <span>Mùa đẹp: {destination.bestSeason}</span>
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-md mb-2">
                {destination.name}
              </h1>

              {/* Location Tag */}
              <div className="flex items-center gap-1.5 text-white/90 text-sm sm:text-base drop-shadow">
                <span className="material-symbols-outlined text-[20px] text-sky-400">location_on</span>
                <span>{destination.location}</span>
              </div>
            </div>

            {/* Quick Hero Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <FavouriteButton
                destination={destination}
                className="w-12 h-12 bg-white/90 text-slate-700 hover:text-rose-500 hover:bg-white shadow-lg text-[24px]"
              />

              <button
                type="button"
                onClick={handleShare}
                className="w-12 h-12 rounded-full bg-white/90 text-slate-700 hover:bg-white hover:text-primary transition-all flex items-center justify-center shadow-lg"
                title="Chia sẻ liên kết"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {copied ? 'check' : 'share'}
                </span>
              </button>

              <a
                href="#available-tours"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm shadow-lg shadow-sky-500/30 hover:opacity-95 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">airplane_ticket</span>
                <span>Xem Tour Khởi Hành</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT BODY */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 mt-8">
        {/* Quick Info Grid (4 Cards) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">timelapse</span>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Thời lượng đề xuất</div>
              <div className="text-sm sm:text-base font-bold text-slate-800">
                {destination.visitDuration || '2 - 3 ngày'}
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">payments</span>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Mức ngân sách</div>
              <div className="text-sm sm:text-base font-bold text-slate-800">
                {destination.budgetBand || 'Phổ thông'}
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">wb_sunny</span>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Mùa lý tưởng nhất</div>
              <div className="text-sm sm:text-base font-bold text-slate-800">
                {destination.bestSeason || 'Quanh năm'}
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">directions_bus</span>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Phương tiện phổ biến</div>
              <div className="text-sm sm:text-base font-bold text-slate-800 truncate max-w-[150px]">
                {destination.transport ? destination.transport.split('(')[0] : 'Máy bay / Ô tô'}
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs Navigation */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-10 overflow-hidden">
          <div className="flex border-b border-slate-100 overflow-x-auto scrollbar-none">
            {[
              { id: 'overview', label: 'Tổng quan điểm đến', icon: 'description' },
              { id: 'attractions', label: 'Điểm tham quan nổi tiếng', icon: 'photo_camera' },
              { id: 'activities', label: 'Trải nghiệm gợi ý', icon: 'surfing' },
              { id: 'transport', label: 'Hướng dẫn di chuyển', icon: 'commute' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary text-primary bg-sky-50/40'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-6 sm:p-8">
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Về {destination.name}</h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {destination.overview || 'Điểm đến du lịch với cảnh sắc thiên nhiên hữu tình và chiều sâu văn hóa.'}
                  </p>
                </div>

                {destination.climate && (
                  <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-100 flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-[22px] shrink-0 mt-0.5">
                      thermostat
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                        Khí hậu & Thời tiết đặc trưng
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {destination.climate}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: ATTRACTIONS */}
            {activeTab === 'attractions' && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-5">Danh Thắng Nổi Bật</h3>
                {destination.attractions && destination.attractions.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {destination.attractions.map((att, i) => (
                      <div
                        key={i}
                        className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-sky-200 hover:bg-sky-50/30 transition-all flex items-center gap-3"
                      >
                        <div className="w-9 h-9 rounded-full bg-white text-primary font-bold flex items-center justify-center shadow-xs shrink-0">
                          {i + 1}
                        </div>
                        <span className="font-bold text-slate-800 text-sm">{att}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">Đang cập nhật danh sách các điểm tham quan nổi bật.</p>
                )}
              </div>
            )}

            {/* TAB 3: ACTIVITIES */}
            {activeTab === 'activities' && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-5">Hoạt Động Trải Nghiệm Gợi Ý</h3>
                {destination.activities && destination.activities.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {destination.activities.map((act, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-2xl border border-slate-100 bg-white shadow-xs flex items-center gap-3.5"
                      >
                        <div className="w-10 h-10 rounded-xl bg-sky-100 text-primary flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[20px]">explore</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-800">{act}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">Đang cập nhật danh sách hoạt động trải nghiệm.</p>
                )}
              </div>
            )}

            {/* TAB 4: TRANSPORT */}
            {activeTab === 'transport' && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Thông Tin Di Chuyển</h3>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 leading-relaxed text-sm text-slate-700 flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[24px] shrink-0 mt-0.5">
                    alt_route
                  </span>
                  <div>
                    <p className="font-medium text-slate-800 mb-1">
                      {destination.transport || 'Có thể di chuyển bằng máy bay đến sân bay gần nhất hoặc ô tô / xe khách limousine.'}
                    </p>
                    <p className="text-xs text-slate-500">
                      Mẹo: Đặt trước vé máy bay hoặc xe khách limousine trước ngày đi từ 1-2 tuần để có giá ưu đãi và giữ được chỗ ngồi đẹp.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. AVAILABLE TOURS SECTION */}
        <section id="available-tours" className="mb-14 scroll-mt-28">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <span className="text-xs font-bold text-primary tracking-wider uppercase">
                GÓI TOUR TRỌN GÓI
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Các Chuyến Du Lịch Đặt Nhiều Nhất Tại {destination.name}
              </h2>
            </div>
            <span className="text-sm font-semibold text-slate-500">
              Có <span className="text-primary font-bold">{tours.length}</span> gói tour đang mở bán
            </span>
          </div>

          {tours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map((tour) => (
                <TourCard key={tour._id || tour.id} tour={tour} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-slate-100 text-center text-slate-500">
              Hiện chưa có tour mở bán cho điểm đến này. Vui lòng quay lại sau!
            </div>
          )}
        </section>

        {/* 4. RELATED DESTINATIONS */}
        {relatedList && relatedList.length > 0 && (
          <section className="mb-12">
            <div className="mb-6">
              <span className="text-xs font-bold text-primary tracking-wider uppercase">
                GỢI Ý THÊM
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Điểm Đến Cùng Khu Vực Nên Ghé Thăm
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedList.map((rel, idx) => {
                const target = typeof rel === 'object' ? rel : null;
                if (!target) return null;
                return (
                  <Link
                    key={target._id || idx}
                    to={`/destinations/${target.slug || target._id}`}
                    className="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-hover hover:-translate-y-1 transition-all"
                  >
                    <div className="aspect-[16/9] w-full bg-slate-100 overflow-hidden relative">
                      <img
                        src={target.image}
                        alt={target.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-primary">
                        {target.region || 'Việt Nam'}
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors text-base line-clamp-1 mb-1">
                        {target.name}
                      </h4>
                      <div className="text-xs text-slate-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        <span className="truncate">{target.location}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default DestinationDetail;
