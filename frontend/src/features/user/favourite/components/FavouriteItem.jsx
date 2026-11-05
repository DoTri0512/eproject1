import React from "react";
import { Link } from "react-router-dom";

export const FavouriteItem = ({ favourite, onRemove }) => {
  const dest = favourite?.destinationId || favourite;
  if (!dest) return null;
  const idOrSlug = dest.slug || dest._id;

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between">
      {/* Top Image */}
      <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
        <img
          src={dest.image}
          alt={dest.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80";
          }}
        />

        {/* Tags */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {dest.region && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 backdrop-blur-md text-primary">
              {dest.region}
            </span>
          )}
          {dest.theme && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-900/70 text-white">
              {dest.theme}
            </span>
          )}
        </div>

        {/* Remove Heart Button */}
        <button
          type="button"
          onClick={() => onRemove(dest)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center shadow-sm cursor-pointer"
          title="Bỏ lưu khỏi yêu thích"
        >
          <span
            className="material-symbols-outlined text-[20px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            favorite
          </span>
        </button>
      </div>

      {/* Body Info */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
          <span className="material-symbols-outlined text-[15px]">
            location_on
          </span>
          <span className="truncate">{dest.location}</span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1 mb-2">
          <Link to={`/destinations/${idOrSlug}`}>{dest.name}</Link>
        </h3>

        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed flex-1">
          {dest.overview || "Thắng cảnh thiên nhiên tuyệt đẹp và văn hóa bản sắc."}
        </p>

        {/* Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          <Link
            to={`/destinations/${idOrSlug}`}
            className="text-xs font-bold text-slate-600 hover:text-primary transition-colors flex items-center gap-1"
          >
            <span>Chi tiết</span>
            <span className="material-symbols-outlined text-[15px]">
              arrow_forward
            </span>
          </Link>

          <Link
            to={`/destinations/${idOrSlug}#available-tours`}
            className="px-3.5 py-1.5 rounded-lg bg-sky-50 hover:bg-primary hover:text-white text-primary text-xs font-bold transition-all"
          >
            Đặt Tour ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FavouriteItem;

