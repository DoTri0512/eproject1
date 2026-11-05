import React from 'react';
import { Link } from 'react-router-dom';
import FavouriteButton from '@/features/user/favourite/components/FavouriteButton';

export const DestinationItem = ({ destination }) => {
  if (!destination) return null;

  const idOrSlug = destination.slug || destination._id;

  return (
    <Link
      to={`/destinations/${idOrSlug}`}
      className="group flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
    >
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
        <div
          className="absolute top-3 right-3 z-10"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
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
            <div className="flex items-center gap-1 shrink-0 text-slate-400">
              <span className="material-symbols-outlined text-[14px]">
                schedule
              </span>
              <span>{destination.visitDuration}</span>
            </div>
          )}
        </div>

        {/* Destination Name */}
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1 mb-2">
          {destination.name}
        </h3>

        {/* Short Overview */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4 flex-1">
          {destination.overview || 'Khám phá danh lam thắng cảnh và văn hóa đặc sắc.'}
        </p>

        {/* Footer info: Best season & Action arrow */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-amber-500">
              sunny
            </span>
            <span>Mùa đẹp: {destination.bestSeason || 'Quanh năm'}</span>
          </div>

          <span className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
            <span>Chi tiết</span>
            <span className="material-symbols-outlined text-[16px]">
              arrow_forward
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default DestinationItem;

