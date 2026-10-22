import React, { useState } from 'react';
import formatCurrency from '../../../../utils/formatCurrency';
import formatDate from '../../../../utils/formatDate';

/**
 * BookingSummary – sidebar tóm tắt đơn đặt tour.
 *
 * Props:
 *  - tour: object — tour data (có destinationId, title, durationOptions)
 *  - selectedDuration: { days, nights, price } — option đã chọn từ durationOptions
 *  - selectedDate: string — ngày khởi hành
 *  - selectedGuide: object | null
 *  - adults: number
 *  - children: number (trẻ em 75% giá)
 *  - infants: number (miễn phí)
 *  - voucherDiscount: number
 *  - onApplyVoucher: (amount) => void
 *  - onSubmit: () => void
 *  - isSubmitting: boolean
 */
export const BookingSummary = ({
  tour,
  selectedDuration,
  selectedDate,
  selectedGuide,
  adults = 1,
  children = 0,
  infants = 0,
  voucherDiscount = 0,
  onApplyVoucher,
  onSubmit,
  isSubmitting = false,
}) => {
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherMessage, setVoucherMessage] = useState(null);

  if (!tour) return null;

  // Tính giá theo selectedDuration (theo backend: selectedDuration.price * số lượng khách)
  const adultPrice = selectedDuration?.price || 0;
  const childPrice = Math.round(adultPrice * 0.75);

  const subtotal = adults * adultPrice + children * childPrice;
  const total = Math.max(subtotal - voucherDiscount, 0);

  // Tính endDate
  const endDate =
    selectedDate && selectedDuration?.days
      ? (() => {
          const d = new Date(selectedDate);
          d.setDate(d.getDate() + selectedDuration.days - 1);
          return d;
        })()
      : null;

  const handleVoucher = (e) => {
    e.preventDefault();
    if (!voucherCode.trim()) return;
    if (['TRAVEL200', 'VIETNAM2026'].includes(voucherCode.trim().toUpperCase())) {
      onApplyVoucher?.(200000);
      setVoucherMessage({ type: 'success', text: 'Áp dụng mã giảm 200.000 VNĐ thành công!' });
    } else {
      setVoucherMessage({ type: 'error', text: 'Mã ưu đãi không hợp lệ hoặc đã hết hạn.' });
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-6 sm:p-7 sticky top-24 flex flex-col justify-between">
      <div>
        {/* Tour thumbnail & title */}
        <div className="flex gap-4 pb-5 mb-5 border-b border-slate-100">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
            <img
              src={
                tour.destinationId?.image ||
                'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=400&q=80'
              }
              alt={tour.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=400&q=80';
              }}
            />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-sky-50 text-primary">
              Mã: TOUR-{(tour._id || 'VN').slice(-5).toUpperCase()}
            </span>
            <h3 className="text-sm font-bold text-slate-900 line-clamp-2 mt-1 mb-1 leading-snug">
              {tour.title}
            </h3>
            {selectedDuration && (
              <span className="text-xs text-slate-500 font-medium">
                {selectedDuration.days} ngày {selectedDuration.nights} đêm
              </span>
            )}
          </div>
        </div>

        {/* Selected info */}
        <div className="space-y-2.5 mb-5 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
          {selectedDuration && (
            <div className="flex items-center justify-between text-slate-700">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">schedule</span>
                <span>Gói thời lượng:</span>
              </span>
              <span className="font-bold text-slate-900">
                {selectedDuration.days}N{selectedDuration.nights}Đ
              </span>
            </div>
          )}

          <div className="flex items-center justify-between text-slate-700">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">calendar_month</span>
              <span>Ngày khởi hành:</span>
            </span>
            <span className="font-bold text-slate-900">
              {selectedDate ? formatDate(selectedDate) : 'Chưa chọn ngày'}
            </span>
          </div>

          {endDate && (
            <div className="flex items-center justify-between text-slate-700">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">event</span>
                <span>Ngày về:</span>
              </span>
              <span className="font-bold text-slate-900">{formatDate(endDate.toISOString())}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-slate-700">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">person</span>
              <span>Hướng dẫn viên:</span>
            </span>
            <span className="font-bold text-slate-900 truncate max-w-[140px]">
              {selectedGuide ? selectedGuide.name : 'Hệ thống tự phân công'}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-700">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">group</span>
              <span>Hành khách:</span>
            </span>
            <span className="font-bold text-slate-900">
              {adults + children + infants} người
              {children > 0 && ` (${children} trẻ)`}
              {infants > 0 && ` (${infants} bé)`}
            </span>
          </div>
        </div>

        {/* Voucher Input */}
        <div className="mb-5">
          <form onSubmit={handleVoucher} className="flex gap-2">
            <input
              type="text"
              placeholder="Mã ưu đãi (TRAVEL200)..."
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs uppercase focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 transition-colors shrink-0"
            >
              Áp dụng
            </button>
          </form>
          {voucherMessage && (
            <p
              className={`text-[11px] mt-1.5 font-medium ${
                voucherMessage.type === 'success' ? 'text-emerald-600' : 'text-rose-500'
              }`}
            >
              {voucherMessage.text}
            </p>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="space-y-2.5 pb-5 mb-5 border-b border-slate-100 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>
              Người lớn ({adults} x {formatCurrency(adultPrice)})
            </span>
            <span className="font-semibold text-slate-800">{formatCurrency(adults * adultPrice)}</span>
          </div>

          {children > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>
                Trẻ em ({children} x {formatCurrency(childPrice)})
              </span>
              <span className="font-semibold text-slate-800">{formatCurrency(children * childPrice)}</span>
            </div>
          )}

          {infants > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>Em bé ({infants} bé)</span>
              <span className="font-semibold text-emerald-600">Miễn phí</span>
            </div>
          )}

          {voucherDiscount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Ưu đãi voucher</span>
              <span>- {formatCurrency(voucherDiscount)}</span>
            </div>
          )}
        </div>

        {/* Seat Availability Notice */}
        {tour.availableSeats !== undefined && (
          <div
            className={`p-2.5 rounded-xl text-xs mb-4 flex items-center justify-between ${
              tour.availableSeats <= 0
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : tour.availableSeats < 5
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            <span className="flex items-center gap-1.5 font-bold">
              <span className="material-symbols-outlined text-[16px]">
                {tour.availableSeats <= 0 ? 'event_busy' : 'airline_seat_recline_normal'}
              </span>
              {tour.availableSeats <= 0
                ? 'Tour đã hết chỗ'
                : `Còn ${tour.availableSeats} chỗ trống`}
            </span>
            <span className="text-[11px] opacity-80">
              (Sức chứa: {tour.maxPassengers || 20} chỗ)
            </span>
          </div>
        )}

        {/* Total */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
              Tổng tiền thanh toán
            </span>
            <span className="text-2xl font-black text-primary">{formatCurrency(total)}</span>
          </div>
          <span className="text-[11px] text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
            Đã bao gồm VAT
          </span>
        </div>
      </div>

      {/* Submit */}
      {(() => {
        const isSoldOut = tour.availableSeats !== undefined && tour.availableSeats <= 0;
        const isOverCapacity =
          tour.availableSeats !== undefined && adults + children > tour.availableSeats;
        const isButtonDisabled =
          isSubmitting || !selectedDate || !selectedDuration || isSoldOut || isOverCapacity;

        return (
          <>
            <button
              type="button"
              disabled={isButtonDisabled}
              onClick={onSubmit}
              className={`w-full py-4 rounded-2xl text-white font-extrabold text-sm sm:text-base transition-all duration-300 shadow-md flex items-center justify-center gap-2 ${
                isButtonDisabled
                  ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                  : 'bg-gradient-to-r from-primary via-sky-600 to-secondary hover:opacity-95 shadow-sky-500/25 active:scale-[0.99]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang ghi nhận đơn đặt...</span>
                </>
              ) : isSoldOut ? (
                <>
                  <span className="material-symbols-outlined text-[20px]">event_busy</span>
                  <span>Tour Đã Hết Chỗ (Sold Out)</span>
                </>
              ) : isOverCapacity ? (
                <>
                  <span className="material-symbols-outlined text-[20px]">group_off</span>
                  <span>Chỉ còn {tour.availableSeats} chỗ trống</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  <span>Xác Nhận Đặt Chuyến Du Lịch</span>
                </>
              )}
            </button>

            {isSoldOut && (
              <p className="text-center text-[11px] text-rose-500 font-bold mt-2">
                ⚡ Tour đã hết chỗ (0 chỗ trống). Vui lòng chọn tour khác!
              </p>
            )}

            {!isSoldOut && isOverCapacity && (
              <p className="text-center text-[11px] text-rose-500 font-bold mt-2">
                Số khách ({adults + children}) vượt quá số chỗ còn lại ({tour.availableSeats} chỗ).
              </p>
            )}

            {(!selectedDate || !selectedDuration) && (
              <p className="text-center text-[11px] text-rose-500 font-semibold mt-2">
                {!selectedDuration
                  ? 'Vui lòng chọn gói thời lượng'
                  : 'Vui lòng chọn ngày khởi hành để tiếp tục'}
              </p>
            )}
          </>
        );
      })()}
    </div>
  );
};

export default BookingSummary;
