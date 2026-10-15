import React from 'react';
import { Link } from 'react-router-dom';
import FavouriteButton from '../../favourite/components/FavouriteButton';

export const DestinationCard = ({ destination }) => {
  if (!destination) return null;

  const idOrSlug = destination.slug || destination._id;

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* 16:9 Image Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {destination.region && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 backdrop-blur-md text-primary shadow-xs">
              {destination.region}
            </span>
          )}
          {destination.theme && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-900/70 backdrop-blur-md text-white shadow-xs">
              {destination.theme}
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <div className="absolute top-3 right-3 z-10">
          <FavouriteButton destination={destination} />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Location & Duration */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2 gap-2">
          <div className="flex items-center gap-1 truncate">
            <span className="material-symbols-outlined text-[16px] text-slate-400 shrink-0">
              location_on
            </span>
            <span className="truncate">{destination.location}</span>
          </div>
          {destination.visitDuration && (
            <div className="flex items-center gap-1 shrink-0 text-slate-600 font-medium bg-slate-50 px-2 py-0.5 rounded">
              <span className="material-symbols-outlined text-[14px] text-slate-400">
                schedule
              </span>
              <span>{destination.visitDuration}</span>
            </div>
          )}
        </div>

        {/* Destination Name */}
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1 mb-2">
          <Link to={`/destinations/${idOrSlug}`}>
            {destination.name}
          </Link>
        </h3>

        {/* Overview (2 lines) */}
        <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mb-5 flex-1 leading-relaxed">
          {destination.overview || 'Khám phá vẻ đẹp kỳ thú và những trải nghiệm khó quên tại điểm đến này.'}
        </p>

        {/* Action Button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          {destination.budgetBand && (
            <div className="text-xs text-slate-500">
              Chi phí: <span className="font-semibold text-slate-700">{destination.budgetBand}</span>
            </div>
          )}
          <Link
            to={`/destinations/${idOrSlug}`}
            className="ml-auto inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:text-primary-dark transition-colors"
          >
            <span>Khám phá chi tiết</span>
            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
