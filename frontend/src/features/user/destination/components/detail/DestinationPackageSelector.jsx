import React from "react";
import formatCurrency from "@/utils/formatCurrency";

export const DestinationPackageSelector = ({
  tours,
  destinationName,
  selectedTourIndex,
  onSelectTour,
}) => {
  if (!tours || tours.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">
            package_2
          </span>
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
            {tours.length > 1
              ? `Chọn Gói Khám Phá ${destinationName} (${tours.length} gói tour)`
              : `Gói Tour Khám Phá ${destinationName} Được Lựa Chọn Nhiều Nhất`}
          </h3>
        </div>
        <span className="text-xs text-slate-500">
          Giá trọn gói đã bao gồm lưu trú & vé tham quan
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tours.map((t, idx) => {
          const isSelected = selectedTourIndex === idx;
          return (
            <button
              key={t._id || idx}
              type="button"
              onClick={() => onSelectTour(idx)}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 relative cursor-pointer ${
                isSelected
                  ? "border-primary bg-sky-50/60 ring-2 ring-primary/20 shadow-xs"
                  : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-slate-800 line-clamp-1">
                  {t.title}
                </span>
                {isSelected && (
                  <span className="material-symbols-outlined text-primary text-[18px] shrink-0">
                    check_circle
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                <span className="text-slate-500 font-medium">
                  {t.durationOptions?.length > 0
                    ? `${t.durationOptions[0].days}N${t.durationOptions[0].nights}Đ${
                        t.durationOptions.length > 1
                          ? ` (+${t.durationOptions.length - 1} gói)`
                          : ""
                      }`
                    : t.duration?.text || `${t.duration?.days || 3} ngày`}
                </span>
                <span className="font-extrabold text-primary">
                  {t.durationOptions?.length > 0
                    ? formatCurrency(
                        Math.min(...t.durationOptions.map((o) => o.price))
                      )
                    : formatCurrency(t.price || 0)}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-slate-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">
                    airline_seat_recline_normal
                  </span>
                  Chỗ trống:
                </span>
                <span
                  className={`font-bold ${
                    t.availableSeats !== undefined && t.availableSeats <= 0
                      ? "text-rose-600"
                      : "text-emerald-600"
                  }`}
                >
                  {t.availableSeats !== undefined && t.availableSeats <= 0
                    ? "Hết chỗ"
                    : `${t.availableSeats ?? t.maxPassengers ?? 20}/${
                        t.maxPassengers || 20
                      } chỗ`}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DestinationPackageSelector;
