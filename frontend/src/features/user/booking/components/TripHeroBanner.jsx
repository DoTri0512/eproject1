import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BookingStatusBadge from './BookingStatusBadge';

export const TripHeroBanner = ({
  booking,
  onOpenCancelModal,
  onOpenVoucherModal,
  onOpenAiAssistant,
}) => {
  const [copied, setCopied] = useState(false);

  const tour = booking?.tourId || {};
  const destination = tour?.destinationId || {};
  const bookingCode =
    booking?.bookingCode || `#BK-${(booking?._id || '0000').slice(-6).toUpperCase()}`;

  const isPending = (booking?.bookingStatus || 'pending') === 'pending';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(bookingCode.replace('#', ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const paymentStatusConfig = {
    pending: { label: 'Chờ thanh toán', className: 'bg-amber-500/20 text-amber-200 border-amber-400/30' },
    confirmed: { label: 'Đã thanh toán', className: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30' },
    completed: { label: 'Đã thanh toán', className: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30' },
  };

  const paymentBadge = paymentStatusConfig[booking?.paymentStatus] || paymentStatusConfig.pending;

  const bgImage =
    destination?.image ||
    tour?.image ||
    'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80';

  return (
    <div className="relative rounded-3xl overflow-hidden mb-8 shadow-xl bg-slate-950 text-white min-h-[380px] flex flex-col justify-between">
      {/* Background with Dark Glass Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt={tour?.title || 'Tour'}
          className="w-full h-full object-cover object-center transform scale-105 filter brightness-75 transition-transform duration-700 hover:scale-100"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/75 to-slate-900/40" />
      </div>

      {/* Top Bar: Breadcrumb & Booking Code */}
      <div className="relative z-10 p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-300 font-medium">
          <Link to="/" className="hover:text-white transition-colors">
            Trang chủ
          </Link>
          <span className="text-slate-500">/</span>
          <Link to="/my-bookings" className="hover:text-white transition-colors">
            Đơn của tôi
          </Link>
          <span className="text-slate-500">/</span>
          <span className="text-sky-300 font-semibold">Kế hoạch chuyến đi (Trip Planner)</span>
        </nav>

        {/* Booking Code with Copy Action */}
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Mã đơn:</span>
          <span className="font-mono text-sm font-extrabold text-white tracking-wide">{bookingCode}</span>
          <button
            type="button"
            onClick={handleCopyCode}
            title="Sao chép mã đơn"
            className="text-slate-300 hover:text-white transition-colors flex items-center"
          >
            <span className="material-symbols-outlined text-[16px]">
              {copied ? 'check' : 'content_copy'}
            </span>
          </button>
        </div>
      </div>

      {/* Middle: Title & Status Badges */}
      <div className="relative z-10 px-6 sm:px-8 py-4 max-w-4xl">
        {/* Badges Cluster */}
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          <BookingStatusBadge status={booking?.bookingStatus} />

          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-xs ${paymentBadge.className}`}
          >
            <span className="material-symbols-outlined text-[15px]">credit_card</span>
            <span>{paymentBadge.label}</span>
          </span>

          {booking?.selectedDuration && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-200 border border-sky-400/30 backdrop-blur-md">
              <span className="material-symbols-outlined text-[15px]">schedule</span>
              <span>
                {booking.selectedDuration.days} Ngày {booking.selectedDuration.nights} Đêm
              </span>
            </span>
          )}

          {destination?.name && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-200 border border-white/15 backdrop-blur-md">
              <span className="material-symbols-outlined text-[15px]">location_on</span>
              <span>{destination.name}</span>
            </span>
          )}
        </div>

        {/* Tour Title H1 */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-snug mb-3">
          {tour?.title || 'Kế hoạch Khám Phá Chuyến Đi Của Bạn'}
        </h1>

        {tour?.overview && (
          <p className="text-slate-200 text-sm sm:text-base line-clamp-2 max-w-3xl leading-relaxed font-light">
            {tour.overview}
          </p>
        )}
      </div>

      {/* Bottom: Action Buttons Bar */}
      <div className="relative z-10 p-6 sm:p-8 pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-slate-950/40 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-3">
          {/* E-Voucher / Ticket Button */}
          <button
            type="button"
            onClick={onOpenVoucherModal}
            className="px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">confirmation_number</span>
            <span>Vé Điện Tử / In Voucher</span>
          </button>

          {/* AI Travel Assistant Prompt */}
          <button
            type="button"
            onClick={onOpenAiAssistant}
            className="px-4 py-2.5 rounded-xl bg-sky-600/80 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm border border-sky-400/30 shadow-md backdrop-blur-md transition-all flex items-center gap-2 active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px] text-amber-300">smart_toy</span>
            <span>Hỏi Trợ Lý AI về Chuyến Đi</span>
          </button>
        </div>

        {/* Cancel Action (Only when pending) */}
        {isPending && (
          <button
            type="button"
            onClick={onOpenCancelModal}
            className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/30 font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5 active:scale-95"
          >
            <span className="material-symbols-outlined text-[17px]">cancel</span>
            <span>Hủy Đơn Đặt Tour</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TripHeroBanner;
