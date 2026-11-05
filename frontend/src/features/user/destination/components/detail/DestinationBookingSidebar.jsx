import React from "react";
import formatCurrency from "@/utils/formatCurrency";
import formatDate from "@/utils/formatDate";

export const DestinationBookingSidebar = ({
  activeTour,
  destinationName,
  activeTourPrice,
  selectedDurationIdx,
  onSelectDurationIdx,
  selectedDate,
  onSelectDate,
  onProceedBooking,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/50">
      {/* Tour Header in Sticky */}
      <div className="pb-4 mb-4 border-b border-slate-100">
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-50 text-primary uppercase tracking-wider">
          GÓI TOUR TRỌN GÓI
        </span>
        <h3 className="font-extrabold text-slate-900 text-lg mt-1 line-clamp-2">
          {activeTour?.title || `Du lịch ${destinationName}`}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold mt-1">
          <span>★ 4.9</span>
          <span className="text-slate-400 font-normal">
            (128 du khách hài lòng)
          </span>
        </div>
      </div>

      {/* Duration Options Selector */}
      {activeTour?.durationOptions?.length > 0 && (
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Chọn Gói Thời Lượng:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {activeTour.durationOptions.map((opt, optIdx) => (
              <button
                key={optIdx}
                type="button"
                onClick={() => onSelectDurationIdx(optIdx)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedDurationIdx === optIdx
                    ? "border-primary bg-sky-50/80 text-primary ring-2 ring-primary/20 font-bold"
                    : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                }`}
              >
                <div className="text-xs font-extrabold">
                  {opt.days}N{opt.nights}Đ
                </div>
                <div className="text-[11px] font-bold text-primary">
                  {formatCurrency(opt.price)}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Display */}
      <div className="mb-5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
        <div className="text-xs text-slate-400 font-medium">
          {activeTour?.durationOptions?.length > 1
            ? "Giá gói đang chọn"
            : "Giá vé trọn gói từ"}
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-black text-primary">
            {activeTourPrice ? formatCurrency(activeTourPrice) : "Liên hệ"}
          </span>
          <span className="text-xs text-slate-500 font-medium">/ khách</span>
        </div>

        {/* Available Seats Progress Bar */}
        {activeTour && (
          <div className="mt-3 pt-3 border-t border-slate-200/60">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-600 font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">
                  airline_seat_recline_normal
                </span>
                Chỗ trống khả dụng:
              </span>
              <span
                className={`font-black text-xs ${
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
              </span>
            </div>

            <div className="w-full h-2 bg-slate-200/70 rounded-full overflow-hidden mb-1.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  (activeTour.availableSeats ?? activeTour.maxPassengers ?? 20) <= 0
                    ? "bg-rose-500"
                    : (activeTour.availableSeats ?? activeTour.maxPassengers ?? 20) < 5
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(
                      0,
                      (((activeTour.availableSeats ?? activeTour.maxPassengers ?? 20) /
                        (activeTour.maxPassengers || 20)) *
                        100)
                    )
                  )}%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px]">
              {activeTour.availableSeats !== undefined && activeTour.availableSeats <= 0 ? (
                <span className="text-rose-600 font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">
                    event_busy
                  </span>
                  Đã hết chỗ (Sold Out)
                </span>
              ) : (
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Còn {activeTour.availableSeats ?? activeTour.maxPassengers ?? 20} chỗ
                  sẵn sàng nhận khách
                </span>
              )}
              <span className="text-slate-400">
                Đã đặt:{" "}
                {Math.max(
                  0,
                  (activeTour.maxPassengers || 20) -
                    (activeTour.availableSeats ?? activeTour.maxPassengers ?? 20)
                )}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Departure Dates Selector */}
      {activeTour?.departureDates && activeTour.departureDates.length > 0 && (
        <div className="mb-5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Chọn Ngày Khởi Hành:
          </label>
          <div className="space-y-2">
            {activeTour.departureDates.map((dateStr, i) => {
              const isSelected = selectedDate === dateStr;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onSelectDate(dateStr)}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? "border-primary bg-sky-50/80 text-primary ring-2 ring-primary/20 font-bold"
                      : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-primary">
                      calendar_today
                    </span>
                    <span className="text-xs sm:text-sm">
                      {formatDate(dateStr)}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      check_circle
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Booking Action */}
      {activeTour ? (
        <button
          type="button"
          disabled={activeTour.availableSeats !== undefined && activeTour.availableSeats <= 0}
          onClick={onProceedBooking}
          className={`w-full py-4 rounded-2xl font-extrabold text-sm sm:text-base transition-all flex items-center justify-center gap-2 mb-3 cursor-pointer ${
            activeTour.availableSeats !== undefined && activeTour.availableSeats <= 0
              ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
              : "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-sky-500/30 hover:opacity-95"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {activeTour.availableSeats !== undefined && activeTour.availableSeats <= 0
              ? "event_busy"
              : "airplane_ticket"}
          </span>
          <span>
            {activeTour.availableSeats !== undefined && activeTour.availableSeats <= 0
              ? "TOUR ĐÃ HẾT CHỖ (SOLD OUT)"
              : "TIẾN HÀNH ĐẶT TOUR"}
          </span>
        </button>
      ) : (
        <div className="p-3 rounded-xl bg-amber-50 text-amber-800 text-xs text-center font-medium mb-3">
          Điểm đến hiện chưa có tour mở bán định kỳ
        </div>
      )}

      {/* Hotline Support */}
      <a
        href="tel:19006868"
        className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
      >
        <span className="material-symbols-outlined text-[16px] text-primary">
          call
        </span>
        <span>Hotline tư vấn: 1900 6868 (24/7)</span>
      </a>

      {/* Trust Badges */}
      <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <span className="material-symbols-outlined text-emerald-500 text-[16px]">
            verified_user
          </span>
          <span>Bảo hiểm du lịch trọn gói lên tới 100tr</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <span className="material-symbols-outlined text-primary text-[16px]">
            autorenew
          </span>
          <span>Miễn phí đổi ngày khởi hành 01 lần</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <span className="material-symbols-outlined text-amber-500 text-[16px]">
            support_agent
          </span>
          <span>Đội ngũ HDV bản địa nhiệt tình, chu đáo</span>
        </div>
      </div>
    </div>
  );
};

export default DestinationBookingSidebar;
