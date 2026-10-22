import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchTourDetail } from '../tourSlice';
import TourItinerary from '../components/TourItinerary';
import formatCurrency from '../../../../utils/formatCurrency';
import formatDate from '../../../../utils/formatDate';

const TourDetail = () => {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [tour, setTour] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState(0);
  const [activeTab, setActiveTab] = useState('overview'); // overview | itinerary | includes

  useEffect(() => {
    window.scrollTo(0, 0);
    const load = async () => {
      setIsLoading(true);
      try {
        const result = await dispatch(fetchTourDetail(idOrSlug)).unwrap();
        setTour(result.data || result);
      } catch {
        setTour(null);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [idOrSlug, dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Đang tải thông tin tour...</p>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20 flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[32px]">error</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Không tìm thấy tour</h2>
        <p className="text-slate-500 text-sm mb-6">Tour này có thể đã kết thúc hoặc không tồn tại.</p>
        <button
          onClick={() => navigate('/tours')}
          className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm"
        >
          Xem tất cả tour
        </button>
      </div>
    );
  }

  const destination = tour.destinationId;
  const durationOptions = tour.durationOptions || [];
  const selectedOption = durationOptions[selectedOptionIdx] || null;
  const nextDeparture = tour.departureDates?.[0];

  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: 'info' },
    { id: 'itinerary', label: 'Lịch trình', icon: 'map' },
    { id: 'includes', label: 'Bao gồm', icon: 'check_circle' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-20">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-primary">Trang chủ</Link>
          <span>/</span>
          <Link to="/tours" className="hover:text-primary">Tour du lịch</Link>
          <span>/</span>
          {destination && (
            <>
              <Link to={`/destinations/${destination.slug || destination._id}`} className="hover:text-primary">
                {destination.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-slate-800 font-semibold truncate max-w-[200px]">{tour.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Tour info */}
          <div className="lg:col-span-8 space-y-6">
            {/* Hero Image */}
            <div className="relative rounded-3xl overflow-hidden aspect-[16/9] bg-slate-100 shadow-md">
              <img
                src={
                  destination?.image ||
                  'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80'
                }
                alt={tour.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                {destination && (
                  <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {destination.name}
                  </span>
                )}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight drop-shadow-sm">
                  {tour.title}
                </h1>
              </div>

              {/* Status badge */}
              {tour.status === 'inactive' && (
                <div className="absolute top-4 right-4 bg-rose-600/90 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Tạm ngưng
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  icon: 'schedule',
                  label: 'Thời lượng',
                  value:
                    durationOptions.length > 0
                      ? `${durationOptions[0].days}–${durationOptions[durationOptions.length - 1].days} ngày`
                      : 'Linh hoạt',
                },
                {
                  icon: 'group',
                  label: 'Tối đa',
                  value: tour.maxPassengers ? `${tour.maxPassengers} người` : 'Không giới hạn',
                },
                {
                  icon: 'event_available',
                  label: 'Chỗ còn lại',
                  value:
                    tour.availableSeats !== undefined
                      ? tour.availableSeats <= 0
                        ? 'Hết chỗ'
                        : `${tour.availableSeats} chỗ`
                      : 'Liên hệ',
                },
                {
                  icon: 'calendar_month',
                  label: 'Gần nhất',
                  value: nextDeparture ? formatDate(nextDeparture) : 'Linh hoạt',
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs text-center"
                >
                  <span className="material-symbols-outlined text-primary text-[22px] block mb-1">
                    {stat.icon}
                  </span>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">
                    {stat.label}
                  </div>
                  <div className="text-sm font-bold text-slate-800">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex border-b border-slate-100 overflow-x-auto scrollbar-none">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap transition-all border-b-2 ${
                      activeTab === tab.id
                        ? 'border-primary text-primary bg-sky-50/60'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6 sm:p-8">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    {tour.overview ? (
                      <p className="text-slate-600 leading-relaxed text-sm">{tour.overview}</p>
                    ) : (
                      <p className="text-slate-400 text-sm">Chưa có mô tả chi tiết cho tour này.</p>
                    )}
                    {destination?.overview && (
                      <div className="pt-4 border-t border-slate-100">
                        <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-[16px]">place</span>
                          Về điểm đến {destination.name}
                        </h3>
                        <p className="text-slate-500 text-sm leading-relaxed line-clamp-4">
                          {destination.overview}
                        </p>
                        <Link
                          to={`/destinations/${destination.slug || destination._id}`}
                          className="text-primary font-bold text-xs mt-2 inline-flex items-center gap-1 hover:underline"
                        >
                          Xem chi tiết điểm đến
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* Itinerary Tab */}
                {activeTab === 'itinerary' && (
                  <div>
                    {durationOptions.length > 0 && (
                      <div className="mb-5 flex flex-wrap items-center gap-2">
                        <span className="text-xs text-slate-500 font-bold">Chọn gói lịch trình:</span>
                        {durationOptions.map((opt, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedOptionIdx(idx)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                              selectedOptionIdx === idx
                                ? 'bg-primary text-white border-primary shadow-xs'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-primary/40 hover:bg-sky-50/50'
                            }`}
                          >
                            {opt.days} Ngày {opt.nights} Đêm – {formatCurrency(opt.price)}
                          </button>
                        ))}
                      </div>
                    )}

                    {selectedOption && (
                      <div className="mb-4 p-3 rounded-xl bg-sky-50 border border-sky-100 text-xs text-primary font-semibold flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px]">info</span>
                          <span>
                            Hiển thị chi tiết <strong>{selectedOption.days} ngày</strong> (từ Ngày 1 đến Ngày {selectedOption.days})
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-sky-700 bg-white px-2 py-0.5 rounded-md border border-sky-200">
                          {selectedOption.days}N{selectedOption.nights}Đ
                        </span>
                      </div>
                    )}
                    <TourItinerary
                      itinerary={tour.itinerary}
                      selectedDays={selectedOption?.days}
                    />
                  </div>
                )}

                {/* Includes Tab */}
                {activeTab === 'includes' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Includes */}
                    <div>
                      <h3 className="font-bold text-emerald-700 text-sm mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        Dịch vụ đã bao gồm
                      </h3>
                      {tour.includes?.length > 0 ? (
                        <ul className="space-y-2">
                          {tour.includes.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                              <span className="material-symbols-outlined text-emerald-500 text-[16px] mt-0.5 shrink-0">
                                check
                              </span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-slate-400 text-sm">Chưa cập nhật</p>
                      )}
                    </div>

                    {/* Excludes */}
                    <div>
                      <h3 className="font-bold text-rose-600 text-sm mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">cancel</span>
                        Không bao gồm
                      </h3>
                      {tour.excludes?.length > 0 ? (
                        <ul className="space-y-2">
                          {tour.excludes.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                              <span className="material-symbols-outlined text-rose-400 text-[16px] mt-0.5 shrink-0">
                                close
                              </span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-slate-400 text-sm">Chưa cập nhật</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Duration Options + Book CTA */}
          <div className="lg:col-span-4 space-y-5 sticky top-24">
            {/* Duration Options Card */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-6">
              <h2 className="text-base font-extrabold text-slate-900 mb-4">
                Chọn gói thời lượng
              </h2>

              {durationOptions.length > 0 ? (
                <div className="space-y-3 mb-6">
                  {durationOptions.map((opt, idx) => {
                    const isSelected = selectedOptionIdx === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedOptionIdx(idx)}
                        className={`w-full p-4 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'border-primary bg-sky-50/80 ring-2 ring-primary/20 shadow-xs'
                            : 'border-slate-200 hover:border-primary/40 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-extrabold text-slate-900 text-sm">
                              {opt.days} ngày {opt.nights} đêm
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">
                              {tour.itinerary?.filter((d) => d.day <= opt.days).length || opt.days} điểm tham quan
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-base font-extrabold text-primary">
                              {formatCurrency(opt.price)}
                            </div>
                            <div className="text-[10px] text-slate-400">/ khách</div>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="mt-2 pt-2 border-t border-primary/10 text-xs text-primary font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">check_circle</span>
                            Gói đang chọn
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-slate-400 text-sm mb-4">Liên hệ để biết giá tour.</p>
              )}

              {/* Selected Option Summary */}
              {selectedOption && (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs mb-5 space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span>Gói đã chọn</span>
                    <span className="font-bold text-slate-800">
                      {selectedOption.days}N{selectedOption.nights}Đ
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Giá / khách</span>
                    <span className="font-extrabold text-primary">{formatCurrency(selectedOption.price)}</span>
                  </div>
                </div>
              )}

              {/* Book Button */}
              {(() => {
                const isSoldOut = tour.availableSeats !== undefined && tour.availableSeats <= 0;
                const isInactive = tour.status === 'inactive';
                const isDisabled = isInactive || isSoldOut;

                return (
                  <>
                    <Link
                      to={`/tour-booking/${tour.slug || tour._id}${selectedOption ? `?duration=${selectedOptionIdx}` : ''}`}
                      className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-extrabold text-sm text-white transition-all shadow-md ${
                        isDisabled
                          ? 'bg-slate-300 pointer-events-none text-slate-500 cursor-not-allowed shadow-none'
                          : 'bg-gradient-to-r from-primary via-sky-600 to-secondary hover:opacity-95 shadow-sky-500/25 active:scale-[0.99]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {isSoldOut ? 'event_busy' : 'luggage'}
                      </span>
                      {isInactive ? 'Tour tạm ngưng' : isSoldOut ? 'Đã Hết Chỗ (Sold Out)' : 'Đặt Ngay'}
                    </Link>

                    {isSoldOut && !isInactive && (
                      <p className="text-center text-[11px] text-rose-500 font-bold mt-2">
                        ⚡ Tour hiện đã hết chỗ trống. Vui lòng liên hệ hoặc chọn tour khác!
                      </p>
                    )}

                    {!isSoldOut && tour.availableSeats !== undefined && tour.availableSeats < 5 && tour.status === 'active' && (
                      <p className="text-center text-[11px] text-rose-500 font-semibold mt-2">
                        ⚡ Chỉ còn {tour.availableSeats} chỗ — đặt ngay!
                      </p>
                    )}
                  </>
                );
              })()}
            </div>

            {/* Departure Dates */}
            {tour.departureDates?.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">date_range</span>
                  Lịch khởi hành gần nhất
                </h3>
                <div className="space-y-2">
                  {tour.departureDates.slice(0, 4).map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs py-1.5 border-b border-slate-50 last:border-0"
                    >
                      <span className="text-slate-700 font-medium">{formatDate(d)}</span>
                      <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                        Còn chỗ
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Back to destination */}
            {destination && (
              <Link
                to={`/destinations/${destination.slug || destination._id}`}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors font-semibold"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Xem điểm đến {destination.name}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetail;
