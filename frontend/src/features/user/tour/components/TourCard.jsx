import React from 'react';
import { Link } from 'react-router-dom';
import formatCurrency from '../../../../utils/formatCurrency';
import formatDate from '../../../../utils/formatDate';

/**
 * TourCard – hiển thị thông tin tour theo schema backend:
 *  - durationOptions: [{ days, nights, price }]
 *  - departureDates: Date[]
 *  - itinerary: [{ day, title }]
 *  - availableSeats, destinationId.name, destinationId.image
 */
export const TourCard = ({ tour }) => {
  if (!tour) return null;

  // Dùng slug nếu có, fallback về _id
  const tourLink = tour.slug || tour._id || tour.id;

  const destinationName = tour.destinationId?.name || '';

  // Giá thấp nhất từ durationOptions
  const minPrice =
    tour.durationOptions?.length > 0
      ? Math.min(...tour.durationOptions.map((o) => o.price))
      : null;

  // Option ngắn nhất để show trên badge
  const shortestOption = tour.durationOptions?.length > 0
    ? tour.durationOptions.reduce((a, b) => (a.days <= b.days ? a : b))
    : null;

  const nextDeparture =
    tour.departureDates && tour.departureDates.length > 0
      ? formatDate(tour.departureDates[0])
      : 'Khởi hành linh hoạt';

  const totalDurationOptions = tour.durationOptions?.length || 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
        <img
          src={
            tour.destinationId?.image ||
            'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80'
          }
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Duration badge */}
        {shortestOption && (
          <div className="absolute top-3 left-3 bg-slate-900/75 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
            <span className="material-symbols-outlined text-[13px]">schedule</span>
            <span>
              {shortestOption.days}N{shortestOption.nights}Đ
              {totalDurationOptions > 1 && ` + ${totalDurationOptions - 1} gói`}
            </span>
          </div>
        )}

        {destinationName && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-primary text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
            {destinationName}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Departure & Availability */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 gap-2">
            <span className="flex items-center gap-1 truncate text-sky-700 font-medium">
              <span className="material-symbols-outlined text-[15px]">calendar_month</span>
              <span>Gần nhất: {nextDeparture}</span>
            </span>
            {tour.availableSeats !== undefined && (
              <span
                className={`shrink-0 px-2 py-0.5 rounded font-bold text-[11px] ${
                  tour.availableSeats <= 0
                    ? 'text-rose-600 bg-rose-50'
                    : 'text-emerald-600 bg-emerald-50'
                }`}
              >
                {tour.availableSeats <= 0 ? 'Hết chỗ' : `Còn ${tour.availableSeats} chỗ`}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors text-base line-clamp-2 mb-2">
            <Link to={`/tours/${tourLink}`}>{tour.title}</Link>
          </h3>

          {/* Itinerary Preview */}
          {tour.itinerary && tour.itinerary.length > 0 && (
            <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
              {tour.itinerary.map((it) => it.title).join(' • ')}
            </p>
          )}

          {/* Duration options pills */}
          {tour.durationOptions?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {tour.durationOptions.map((opt, i) => (
                <span
                  key={i}
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100"
                >
                  {opt.days}N{opt.nights}Đ – {formatCurrency(opt.price)}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer: Price and CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Giá từ</div>
            <div className="text-base sm:text-lg font-extrabold text-primary">
              {minPrice !== null ? formatCurrency(minPrice) : 'Liên hệ'}
            </div>
          </div>

          <Link
            to={`/tours/${tourLink}`}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs sm:text-sm hover:opacity-95 transition-all shadow-sm shadow-sky-500/20 shrink-0 flex items-center gap-1"
          >
            <span>Xem Tour</span>
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
