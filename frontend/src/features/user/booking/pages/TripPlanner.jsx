import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useTripPlanner from '../hooks/useTripPlanner';
import TripHeroBanner from '../components/TripHeroBanner';
import TripSpecsCard from '../components/TripSpecsCard';
import TripItineraryTimeline from '../components/TripItineraryTimeline';
import TripServicesChecklist from '../components/TripServicesChecklist';
import TripSupportCard from '../components/TripSupportCard';
import TripCancelModal from '../components/TripCancelModal';
import TripVoucherModal from '../components/TripVoucherModal';

export const TripPlanner = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const {
    booking,
    filteredItinerary,
    countdownDays,
    isLoading,
    error,
    isCancelling,
    cancelBooking,
    isAuthenticated,
  } = useTripPlanner(bookingId);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState(null);

  // Trigger Chatbot AI modal with customized query context
  const handleOpenAiAssistant = () => {
    const tourTitle = booking?.tourId?.title || 'chuyến đi';
    const query = `Xin tư vấn chuẩn bị hành lý, trang phục và thời tiết cho chuyến du lịch: ${tourTitle}`;
    window.dispatchEvent(
      new CustomEvent('open-chatbot', {
        detail: { query },
      })
    );
  };

  // Handle Cancel Booking
  const handleConfirmCancel = async (reason) => {
    const success = await cancelBooking(reason);
    if (success) {
      setIsCancelModalOpen(false);
      setActionNotice({
        type: 'success',
        message: 'Đơn đặt tour đã được hủy thành công. Cảm ơn bạn đã phản hồi!',
      });
      setTimeout(() => setActionNotice(null), 6000);
    }
  };

  // Not authenticated screen
  if (!isAuthenticated && !isLoading && !booking) {
    return (
      <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20 flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[32px]">lock</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Yêu Cầu Đăng Nhập</h2>
        <p className="text-slate-500 text-sm mb-6 max-w-sm">
          Vui lòng đăng nhập tài khoản để xem kế hoạch lịch trình chi tiết của chuyến đi này.
        </p>
        <Link
          to="/login"
          className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-md"
        >
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  // Loading skeleton screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] pt-24 pb-20">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
          {/* Skeleton Hero */}
          <div className="w-full h-80 rounded-3xl bg-slate-200 animate-pulse mb-8" />
          {/* Skeleton Specs */}
          <div className="w-full h-64 rounded-3xl bg-slate-200 animate-pulse mb-8" />
          {/* Skeleton Timeline */}
          <div className="space-y-4">
            <div className="w-1/3 h-8 bg-slate-200 rounded animate-pulse" />
            <div className="w-full h-44 bg-slate-200 rounded-3xl animate-pulse" />
            <div className="w-full h-44 bg-slate-200 rounded-3xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Not found / Error state
  if (!booking) {
    return (
      <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20 flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-[36px]">travel_explore</span>
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">
          Không Tìm Thấy Đơn Đặt Tour
        </h2>
        <p className="text-sm text-slate-500 mb-6 max-w-md leading-relaxed">
          Đơn đặt tour bạn đang tra cứu không tồn tại hoặc bạn không có quyền truy cập vào thông tin này.
        </p>
        <div className="flex items-center gap-3">
          <Link
            to="/my-bookings"
            className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-md"
          >
            Quay về đơn đặt tour của tôi
          </Link>
          <Link
            to="/destinations"
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
          >
            Khám phá điểm đến
          </Link>
        </div>
      </div>
    );
  }

  const tour = booking?.tourId || {};
  const destination = tour?.destinationId || {};

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-20">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        {/* Action Notice / Toast */}
        {actionNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-emerald-600">
                check_circle
              </span>
              <span>{actionNotice.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setActionNotice(null)}
              className="text-emerald-700 hover:text-emerald-900"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        )}

        {/* 1. Trip Hero Banner with Status & Actions */}
        <TripHeroBanner
          booking={booking}
          onOpenCancelModal={() => setIsCancelModalOpen(true)}
          onOpenVoucherModal={() => setIsVoucherModalOpen(true)}
          onOpenAiAssistant={handleOpenAiAssistant}
        />

        {/* 2. Specifications Card: Dates, Duration, Guests, Payment, Guide */}
        <TripSpecsCard booking={booking} countdownDays={countdownDays} />

        {/* 3. Day-by-day Itinerary Planner Timeline */}
        <TripItineraryTimeline
          itinerary={filteredItinerary}
          departureDate={booking.departureDate}
          destinationGallery={destination.gallery || []}
        />

        {/* 4. Amenities: Includes & Excludes */}
        <TripServicesChecklist
          includes={tour.includes || []}
          excludes={tour.excludes || []}
        />

        {/* 5. Support & Emergency Card */}
        <TripSupportCard />
      </div>

      {/* Cancel Confirmation Modal */}
      <TripCancelModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        isCancelling={isCancelling}
      />

      {/* E-Voucher / Boarding Pass Modal */}
      <TripVoucherModal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        booking={booking}
      />
    </div>
  );
};

export default TripPlanner;
