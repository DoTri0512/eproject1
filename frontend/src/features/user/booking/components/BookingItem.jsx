import React from "react";
import { Link } from "react-router-dom";
import formatCurrency from "@/utils/formatCurrency";
import formatDate from "@/utils/formatDate";
import BookingStatusBadge from "./BookingStatusBadge";
import PaymentStatusBadge from "./PaymentStatusBadge";

export const BookingItem = ({
  booking,
  onOpenCancelModal,
}) => {
  if (!booking) return null;

  const tour = booking.tourId || {};
  const bookingCode = `#BK-${(booking._id || "0000").slice(-6).toUpperCase()}`;
  const isPending = (booking.bookingStatus || "pending") === "pending";
  const isFinished = ["completed", "cancelled"].includes(booking.bookingStatus);
  const totalGuests =
    (booking.numberOfGuests?.adults || 1) +
    (booking.numberOfGuests?.children || 0);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 sm:p-6 transition-all hover:shadow-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
      {/* Left: Thumbnail & Tour Details */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
        <div className="w-full sm:w-40 aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 shrink-0">
          <img
            src={tour.destinationId?.image}
            alt={tour.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=400&q=80";
            }}
          />
        </div>

        <div className="flex-1">
          {/* Booking Code & Status */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded">
              {bookingCode}
            </span>
            <BookingStatusBadge status={booking.bookingStatus} />
            <PaymentStatusBadge status={booking.paymentStatus} />
            <span className="text-[11px] text-slate-400">
              Đặt lúc: {formatDate(booking.createdAt || booking.bookingDate)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-1 mb-2 hover:text-primary transition-colors">
            <Link to={`/destinations/${tour.destinationId?.slug || tour.destinationId?._id}`}>
              {tour.title || "Tour Du Lịch Khám Phá Việt Nam"}
            </Link>
          </h3>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1 font-medium text-sky-800">
              <span className="material-symbols-outlined text-[15px]">
                calendar_month
              </span>
              <span>
                Khởi hành: <strong>{formatDate(booking.departureDate)}</strong>
              </span>
            </span>

            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">
                group
              </span>
              <span>{totalGuests} hành khách</span>
            </span>

            {tour.duration?.text && (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">
                  timelapse
                </span>
                <span>{tour.duration.text}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Price & Action Buttons */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100 gap-3 shrink-0">
        <div className="text-left sm:text-right">
          <span className="text-xs text-slate-400 block font-medium">
            Tổng thanh toán
          </span>
          <span className="text-lg sm:text-xl font-black text-primary">
            {formatCurrency(booking.totalPrice || 0)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Cancel button if pending */}
          {isPending && onOpenCancelModal && (
            <button
              type="button"
              onClick={() => onOpenCancelModal(booking)}
              className="px-3 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
            >
              Hủy đơn
            </button>
          )}

          {/* View Trip Details / Plan */}
          <Link
            to={`/my-bookings/${booking._id}`}
            className="px-4 py-2 rounded-xl bg-sky-50 text-primary hover:bg-primary hover:text-white text-xs font-bold transition-all inline-flex items-center gap-1"
          >
            <span>Vé & Kế hoạch</span>
            <span className="material-symbols-outlined text-[15px]">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingItem;

