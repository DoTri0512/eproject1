import React from "react";
import formatCurrency from "@/utils/formatCurrency";

export const DestinationQuickStats = ({
  destination,
  activeTour,
  activeDurationOption,
  activeTourPrice,
}) => {
  return (
    <div
      className={`grid grid-cols-2 ${
        activeTour ? "lg:grid-cols-5" : "lg:grid-cols-4"
      } gap-4 mb-8`}
    >
      {/* 1. Duration */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-sky-200 transition-colors">
        <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[24px]">
            timelapse
          </span>
        </div>
        <div>
          <div className="text-xs text-slate-400 font-medium">
            Thời lượng hành trình
          </div>
          <div className="text-sm sm:text-base font-bold text-slate-900">
            {activeDurationOption
              ? `${activeDurationOption.days}N${activeDurationOption.nights}Đ`
              : activeTour?.duration?.text || destination.visitDuration || "2 - 3 ngày"}
          </div>
        </div>
      </div>

      {/* 2. Price */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-emerald-200 transition-colors">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[24px]">
            payments
          </span>
        </div>
        <div>
          <div className="text-xs text-slate-400 font-medium">
            Giá tour trọn gói
          </div>
          <div className="text-sm sm:text-base font-extrabold text-emerald-600">
            {activeTourPrice
              ? formatCurrency(activeTourPrice)
              : destination.budgetBand || "Liên hệ"}
          </div>
        </div>
      </div>

      {/* 3. Seats (if tour exists) */}
      {activeTour && (
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-sky-200 transition-colors">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              activeTour.availableSeats !== undefined && activeTour.availableSeats <= 0
                ? "bg-rose-50 text-rose-600"
                : activeTour.availableSeats !== undefined && activeTour.availableSeats < 5
                ? "bg-amber-50 text-amber-600"
                : "bg-sky-50 text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">
              {activeTour.availableSeats !== undefined && activeTour.availableSeats <= 0
                ? "event_busy"
                : "airline_seat_recline_normal"}
            </span>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">
              Chỗ trống / Sức chứa
            </div>
            <div
              className={`text-sm sm:text-base font-extrabold ${
                activeTour.availableSeats !== undefined && activeTour.availableSeats <= 0
                  ? "text-rose-600"
                  : "text-slate-900"
              }`}
            >
              {activeTour.availableSeats !== undefined
                ? activeTour.availableSeats
                : activeTour.maxPassengers || 20}
              {" / "}
              {activeTour.maxPassengers || 20} chỗ
            </div>
          </div>
        </div>
      )}

      {/* 4. Best Season */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-amber-200 transition-colors">
        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[24px]">
            wb_sunny
          </span>
        </div>
        <div>
          <div className="text-xs text-slate-400 font-medium">
            Mùa lý tưởng nhất
          </div>
          <div className="text-sm sm:text-base font-bold text-slate-900">
            {destination.bestSeason || "Quanh năm"}
          </div>
        </div>
      </div>

      {/* 5. Transport */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-purple-200 transition-colors">
        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[24px]">
            directions_bus
          </span>
        </div>
        <div>
          <div className="text-xs text-slate-400 font-medium">
            Phương tiện di chuyển
          </div>
          <div className="text-sm sm:text-base font-bold text-slate-900 truncate max-w-[150px]">
            {destination.transport
              ? destination.transport.split("(")[0]
              : "Máy bay / Ô tô"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationQuickStats;
