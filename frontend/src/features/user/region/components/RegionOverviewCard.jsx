import React from "react";
import { Link } from "react-router-dom";

export const RegionOverviewCard = ({
  currentRegion,
  destinationsCount,
  toursCount,
}) => {
  if (!currentRegion) return null;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Image Banner */}
        <div className="lg:col-span-5 relative aspect-[16/10] lg:aspect-auto min-h-[280px]">
          <img
            src={currentRegion.image}
            alt={currentRegion.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:hidden" />
          <div className="absolute bottom-4 left-4 right-4 lg:hidden text-white">
            <h3 className="text-xl font-bold">{currentRegion.name}</h3>
            <p className="text-xs text-white/80 line-clamp-1">
              {currentRegion.tagline}
            </p>
          </div>
        </div>

        {/* Content Details */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="hidden lg:block mb-3">
              <span className="text-xs font-bold text-primary tracking-wider uppercase">
                ĐẶC TRƯNG ĐỊA LÝ
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                {currentRegion.name}
              </h2>
              <p className="text-sm font-semibold text-slate-500 mt-0.5">
                {currentRegion.tagline}
              </p>
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
              {currentRegion.description}
            </p>

            {/* Highlights & Best Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-sky-900 mb-2">
                  <span className="material-symbols-outlined text-[16px] text-primary">
                    verified
                  </span>
                  <span>Điểm nhấn tiêu biểu</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-1">
                  {currentRegion.highlights?.map((h, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2">
                  <span className="material-symbols-outlined text-[16px] text-amber-600">
                    wb_sunny
                  </span>
                  <span>Mùa du lịch đẹp nhất</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {currentRegion.bestTime}
                </p>
                <div className="mt-2 text-[11px] text-slate-500 font-medium">
                  Ẩm thực đặc sản:{" "}
                  <span className="text-slate-700">
                    {currentRegion.cuisine}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Counter Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span>
                Điểm đến:{" "}
                <strong className="text-slate-800 text-sm">
                  {destinationsCount}
                </strong>
              </span>
              <span>•</span>
              <span>
                Tour mở bán:{" "}
                <strong className="text-primary text-sm">
                  {toursCount}
                </strong>
              </span>
            </div>

            <Link
              to={`/destinations?region=${encodeURIComponent(currentRegion.name)}`}
              className="font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>Xem tất cả điểm đến</span>
              <span className="material-symbols-outlined text-[15px]">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionOverviewCard;

