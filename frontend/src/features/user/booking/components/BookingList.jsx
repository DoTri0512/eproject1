import React from "react";
import { Link } from "react-router-dom";
import BookingItem from "./BookingItem";

export const BookingList = ({
  isLoading,
  bookings = [],
  onOpenCancelModal,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm animate-pulse flex flex-col md:flex-row gap-6"
          >
            <div className="w-full md:w-48 aspect-[16/10] bg-slate-200 rounded-2xl" />
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-slate-200 rounded w-1/3" />
              <div className="h-4 bg-slate-100 rounded w-2/3" />
              <div className="h-4 bg-slate-100 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center max-w-lg mx-auto my-12">
        <div className="w-20 h-20 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-[36px]">luggage</span>
        </div>
        <h3 className="text-xl font-extrabold text-slate-800 mb-2">
          Bạn chưa có đơn đặt chuyến du lịch nào!
        </h3>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          Hãy khám phá các danh thắng nổi tiếng và chọn cho mình một chuyến du
          lịch đầy ắp niềm vui.
        </p>
        <Link
          to="/destinations"
          className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-all shadow-md inline-flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">
            travel_explore
          </span>
          <span>Khám phá Tour du lịch ngay</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <BookingItem
          key={booking._id}
          booking={booking}
          onOpenCancelModal={onOpenCancelModal}
        />
      ))}
    </div>
  );
};

export default BookingList;

