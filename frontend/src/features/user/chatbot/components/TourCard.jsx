import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

export const TourCard = ({ tour, onSelect }) => {
  if (!tour) return null;

  const minPrice = tour.durationOptions?.length > 0
    ? Math.min(...tour.durationOptions.map((opt) => opt.price))
    : 0;

  const primaryDuration = tour.durationOptions?.[0]
    ? `${tour.durationOptions[0].days}N${tour.durationOptions[0].nights}Đ`
    : 'Linh hoạt';

  const destinationName = tour.destinationId?.name || 'Điểm đến nổi bật';
  const tourImage = tour.destinationId?.image || 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="bg-white rounded-xl border border-sky-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col w-[260px] shrink-0 text-left">
      {/* Thumbnail */}
      <div className="relative h-32 w-full overflow-hidden bg-slate-100">
        <img
          src={tourImage}
          alt={tour.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 left-2 bg-sky-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
          <Clock className="w-3 h-3 text-sky-300" />
          {primaryDuration}
        </div>
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
          <MapPin className="w-3 h-3 text-rose-500" />
          <span className="truncate max-w-[140px]">{destinationName}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug mb-1 hover:text-sky-600 transition-colors">
            {tour.title}
          </h4>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mb-2">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>Còn {tour.availableSeats || 20} chỗ trống</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div>
            <span className="text-[10px] text-slate-400 block leading-tight">Giá chỉ từ</span>
            <span className="text-xs font-bold text-sky-600">
              {minPrice > 0 ? `${new Intl.NumberFormat('vi-VN').format(minPrice)}đ` : 'Liên hệ'}
            </span>
          </div>

          <Link
            to={`/tour-booking/${tour._id}`}
            onClick={onSelect}
            className="inline-flex items-center gap-1 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg hover:from-sky-600 hover:to-blue-700 transition-all shadow-sm active:scale-95"
          >
            <span>Đặt tour</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
