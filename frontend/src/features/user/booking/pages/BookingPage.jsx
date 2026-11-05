import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import useMyBookings from "../hooks/useMyBookings";
import useAuth from "@/hooks/useAuth";
import Modal from "@/components/common/Modal";
import BookingList from "../components/BookingList";

export const BookingPage = () => {
  const { isAuthenticated } = useAuth();
  const { bookings, isLoading, cancelBooking } = useMyBookings();

  const [activeTab, setActiveTab] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  const tabs = [
    { id: "all", label: "Tất cả chuyến đi" },
    { id: "pending", label: "Chờ xác nhận" },
    { id: "confirmed", label: "Đã xác nhận" },
    { id: "completed", label: "Đã hoàn thành" },
    { id: "cancelled", label: "Đã hủy" },
  ];

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // 1. Lọc theo trạng thái chuyến đi (bookingStatus)
      if (
        activeTab !== "all" &&
        (b.bookingStatus || "pending").toLowerCase() !== activeTab
      ) {
        return false;
      }
      // 2. Lọc theo trạng thái thanh toán (paymentStatus)
      if (
        paymentFilter !== "all" &&
        (b.paymentStatus || "pending").toLowerCase() !== paymentFilter
      ) {
        return false;
      }
      return true;
    });
  }, [bookings, activeTab, paymentFilter]);

  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;
    setIsCancelling(true);
    await cancelBooking(cancelTarget._id, cancelReason);
    setIsCancelling(false);
    setCancelTarget(null);
    setCancelReason("");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20 flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[32px]">lock</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Yêu Cầu Đăng Nhập
        </h2>
        <p className="text-slate-500 text-sm mb-6 max-w-sm">
          Vui lòng đăng nhập tài khoản để tra cứu toàn bộ lịch sử đơn đặt tour
          và vé du lịch của bạn.
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

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-20">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        {/* Header Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-8 bg-gradient-to-r from-sky-600 via-sky-500 to-sky-400 text-white p-8 sm:p-12 shadow-md">
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold tracking-wider uppercase mb-5 shadow-sm animate-in fade-in">
              <span className="material-symbols-outlined">receipt_long</span>
              <span>LỊCH SỬ CHUYẾN ĐI</span>
            </span>
            <h1 className="text-3xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-3 text-white">
              Đơn Đặt Chuyến Du Lịch Của Tôi
            </h1>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              Theo dõi tình trạng xử lý đơn hàng, xem vé du lịch điện tử và quản
              lý kế hoạch khởi hành.
            </p>
          </div>
        </div>

        {/* Status Tabs Bar (Booking Progress) */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
          {tabs.map((tab) => {
            const count =
              tab.id === "all"
                ? bookings.length
                : bookings.filter(
                    (b) =>
                      (b.bookingStatus || "pending").toLowerCase() === tab.id
                  ).length;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap shadow-xs cursor-pointer ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-sky-500/25"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Secondary Filter: Payment Status */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-3 mb-8 px-1">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold flex-wrap">
            <span className="material-symbols-outlined text-[16px] text-primary">
              payments
            </span>
            <span>Tình trạng thanh toán:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: "all", label: "Tất cả thanh toán" },
                { id: "pending", label: "Chờ thanh toán" },
                { id: "confirmed", label: "Đã thanh toán" },
                { id: "completed", label: "Hoàn tất thanh toán" },
              ].map((pTab) => {
                const isPActive = paymentFilter === pTab.id;
                return (
                  <button
                    key={pTab.id}
                    type="button"
                    onClick={() => setPaymentFilter(pTab.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                      isPActive
                        ? "bg-sky-100 text-sky-800 border border-sky-300 shadow-xs"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {pTab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-xs text-slate-400">
            Hiển thị <strong>{filteredBookings.length}</strong> đơn phù hợp
          </div>
        </div>

        {/* Booking List */}
        <BookingList
          isLoading={isLoading}
          bookings={filteredBookings}
          onOpenCancelModal={setCancelTarget}
        />
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelTarget && (
        <Modal
          isOpen={!!cancelTarget}
          onClose={() => setCancelTarget(null)}
          title="Xác nhận hủy đơn đặt tour"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Bạn có chắc chắn muốn hủy đơn đặt tour{" "}
              <strong>
                #BK-{(cancelTarget._id || "0000").slice(-6).toUpperCase()}
              </strong>{" "}
              không?
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Lý do hủy đơn:
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Nhập lý do hủy chuyến của bạn..."
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Giữ lại đơn
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs sm:text-sm font-bold hover:bg-rose-700 shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {isCancelling ? "Đang hủy..." : "Xác nhận hủy tour"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BookingPage;

