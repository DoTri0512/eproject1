import React, { useState } from 'react';
import formatCurrency from '../../../../utils/formatCurrency';
import formatDate from '../../../../utils/formatDate';

export const BookingSummary = ({
  tour,
  selectedDate,
  selectedGuide,
  adults = 1,
  childrenCount = 0,
  children = childrenCount,
  infants = 0,
  voucherDiscount = 0,
  onApplyVoucher,
  onSubmit,
  isSubmitting = false,
}) => {
  const actualChildren = childrenCount !== undefined ? childrenCount : children;
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherMessage, setVoucherMessage] = useState(null);

  if (!tour) return null;

  const adultPrice = tour.price || 0;
  const childPrice = Math.round(adultPrice * 0.75);

  const subtotal = adults * adultPrice + actualChildren * childPrice;
  const total = Math.max(subtotal - voucherDiscount, 0);

  const handleVoucher = (e) => {
    e.preventDefault();
    if (!voucherCode.trim()) return;
    if (voucherCode.trim().toUpperCase() === 'TRAVEL200' || voucherCode.trim().toUpperCase() === 'VIETNAM2026') {
      onApplyVoucher(200000);
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
            <span className="text-xs text-slate-500 font-medium">
              {tour.duration?.text || `${tour.duration?.days || 3} ngày`}
            </span>
          </div>
        </div>

        {/* Selected date & guide info */}
        <div className="space-y-3 mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">calendar_month</span>
              <span>Ngày khởi hành:</span>
            </span>
            <span className="font-bold text-slate-900">
              {selectedDate ? formatDate(selectedDate) : 'Chưa chọn ngày'}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-700">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">person</span>
              <span>Người hướng dẫn:</span>
            </span>
            <span className="font-bold text-slate-900 truncate max-w-[150px]">
              {selectedGuide ? selectedGuide.name : 'Hệ thống tự phân công'}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-700">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">group</span>
              <span>Tổng hành khách:</span>
            </span>
            <span className="font-bold text-slate-900">
              {adults + actualChildren + infants} người ({adults} lớn{actualChildren > 0 ? `, ${actualChildren} trẻ` : ''}{infants > 0 ? `, ${infants} bé` : ''})
            </span>
          </div>
        </div>

        {/* Voucher Input */}
        <div className="mb-6">
          <form onSubmit={handleVoucher} className="flex gap-2">
            <input
              type="text"
              placeholder="Nhập mã ưu đãi (TRAVEL200)..."
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
            <p className={`text-[11px] mt-1.5 font-medium ${voucherMessage.type === 'success' ? 'text-emerald-600' : 'text-rose-500'}`}>
              {voucherMessage.text}
            </p>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="space-y-2.5 pb-5 mb-5 border-b border-slate-100 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Vé người lớn ({adults} x {formatCurrency(adultPrice)})</span>
            <span className="font-semibold text-slate-800">{formatCurrency(adults * adultPrice)}</span>
          </div>

          {actualChildren > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>Vé trẻ em ({actualChildren} x {formatCurrency(childPrice)})</span>
              <span className="font-semibold text-slate-800">{formatCurrency(actualChildren * childPrice)}</span>
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

        {/* Total Price */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
              Tổng tiền thanh toán
            </span>
            <span className="text-2xl font-black text-primary">
              {formatCurrency(total)}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
            Đã bao gồm VAT
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="button"
        disabled={isSubmitting || !selectedDate}
        onClick={onSubmit}
        className={`w-full py-4 rounded-2xl text-white font-extrabold text-sm sm:text-base transition-all duration-300 shadow-md flex items-center justify-center gap-2 ${
          isSubmitting || !selectedDate
            ? 'bg-slate-300 cursor-not-allowed text-slate-500'
            : 'bg-gradient-to-r from-primary via-sky-600 to-secondary hover:opacity-95 shadow-sky-500/25 active:scale-[0.99]'
        }`}
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Đang ghi nhận đơn đặt...</span>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span>Xác Nhận Đặt Chuyến Du Lịch</span>
          </>
        )}
      </button>
      {!selectedDate && (
        <p className="text-center text-[11px] text-rose-500 font-semibold mt-2">
          Vui lòng chọn ngày khởi hành để tiếp tục
        </p>
      )}
    </div>
  );
};

export default BookingSummary;
