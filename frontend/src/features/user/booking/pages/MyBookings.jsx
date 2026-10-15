import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useMyBookings from '../hooks/useMyBookings';
import useAuth from '../../../../hooks/useAuth';
import formatCurrency from '../../../../utils/formatCurrency';
import formatDate from '../../../../utils/formatDate';
import BookingStatusBadge from '../components/BookingStatusBadge';
import Modal from '../../../../components/common/Modal';

export const MyBookings = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { bookings, isLoading, cancelBooking } = useMyBookings();

  const [activeTab, setActiveTab] = useState('all');
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  const tabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'pending', label: 'Chờ xác nhận' },
    { id: 'confirmed', label: 'Đã xác nhận' },
    { id: 'completed', label: 'Hoàn thành' },
    { id: 'cancelled', label: 'Đã hủy' },
  ];

  const filteredBookings = useMemo(() => {
    if (activeTab === 'all') return bookings;
    return bookings.filter(
      (b) => (b.bookingStatus || 'pending').toLowerCase() === activeTab
    );
  }, [bookings, activeTab]);

  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;
    setIsCancelling(true);
    await cancelBooking(cancelTarget._id, cancelReason);
    setIsCancelling(false);
    setCancelTarget(null);
    setCancelReason('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20 flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[32px]">lock</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Yêu Cầu Đăng Nhập</h2>
        <p className="text-slate-500 text-sm mb-6 max-w-sm">
          Vui lòng đăng nhập tài khoản để tra cứu toàn bộ lịch sử đơn đặt tour và vé du lịch của bạn.
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
        <div className="relative rounded-3xl overflow-hidden mb-8 bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-8 sm:p-12 shadow-md">
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-sky-300 text-xs font-semibold mb-3">
              <span className="material-symbols-outlined text-[16px]">receipt_long</span>
              <span>LỊCH SỬ CHUYẾN ĐI</span>
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3 text-white">
              Đơn Đặt Chuyến Du Lịch Của Tôi
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Theo dõi tình trạng xử lý đơn hàng, xem vé du lịch điện tử và quản lý kế hoạch khởi hành.
            </p>
          </div>
        </div>

        {/* Status Tabs Bar */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
          {tabs.map((tab) => {
            const count =
              tab.id === 'all'
                ? bookings.length
                : bookings.filter((b) => (b.bookingStatus || 'pending').toLowerCase() === tab.id).length;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap shadow-xs ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-sky-500/25'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bookings List or Empty State */}
        {isLoading ? (
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
        ) : filteredBookings.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center max-w-lg mx-auto my-12">
            <div className="w-20 h-20 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[36px]">luggage</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-800 mb-2">
              Bạn chưa có đơn đặt chuyến du lịch nào!
            </h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Hãy khám phá các danh thắng nổi tiếng và chọn cho mình một chuyến du lịch đầy ắp niềm vui.
            </p>
            <Link
              to="/destinations"
              className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-all shadow-md inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">travel_explore</span>
              <span>Khám phá Tour du lịch ngay</span>
            </Link>
          </div>
        ) : (
          /* List of Bookings */
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const tour = booking.tourId || {};
              const bookingCode = `#BK-${(booking._id || '0000').slice(-6).toUpperCase()}`;
              const isPending = (booking.bookingStatus || 'pending') === 'pending';
              const isFinished = ['completed', 'cancelled'].includes(booking.bookingStatus);
              const totalGuests =
                (booking.numberOfGuests?.adults || 1) + (booking.numberOfGuests?.children || 0);

              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 sm:p-6 transition-all hover:shadow-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6"
                >
                  {/* Left: Thumbnail & Tour Details */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
                    <div className="w-full sm:w-40 aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 shrink-0">
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

                    <div className="flex-1">
                      {/* Booking Code & Status */}
                      <div className="flex flex-wrap items-center gap-2.5 mb-2">
                        <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded">
                          {bookingCode}
                        </span>
                        <BookingStatusBadge status={booking.bookingStatus} />
                        <span className="text-[11px] text-slate-400">
                          Đặt lúc: {formatDate(booking.createdAt || booking.bookingDate)}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-1 mb-2 hover:text-primary transition-colors">
                        <Link to={`/destinations`}>
                          {tour.title || 'Tour Du Lịch Khám Phá Việt Nam'}
                        </Link>
                      </h3>

                      {/* Metadata */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-medium text-sky-800">
                          <span className="material-symbols-outlined text-[15px]">event</span>
                          <span>Khởi hành: {formatDate(booking.departureDate)}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px]">group</span>
                          <span>{totalGuests} hành khách</span>
                        </span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <span className="material-symbols-outlined text-[15px]">credit_card</span>
                          <span className="capitalize">{booking.paymentMethod?.replace('_', ' ') || 'Chuyển khoản'}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Total Amount & Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0 gap-3">
                    <div className="text-left sm:text-right">
                      <div className="text-[11px] text-slate-400 font-semibold uppercase">Tổng thanh toán</div>
                      <div className="text-lg sm:text-xl font-black text-primary">
                        {formatCurrency(booking.totalAmount)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedVoucher(booking)}
                        className="px-4 py-2 rounded-xl bg-sky-50 text-primary hover:bg-primary hover:text-white font-bold text-xs transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[15px]">confirmation_number</span>
                        <span>Vé / Voucher</span>
                      </button>

                      {isPending && (
                        <button
                          type="button"
                          onClick={() => setCancelTarget(booking)}
                          className="px-3 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold text-xs transition-colors"
                        >
                          Hủy đơn
                        </button>
                      )}

                      {isFinished && (
                        <button
                          type="button"
                          onClick={() => navigate(`/destinations`)}
                          className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors"
                        >
                          Đặt lại
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* VOUCHER / TICKET MODAL */}
      {selectedVoucher && (
        <Modal
          isOpen={Boolean(selectedVoucher)}
          onClose={() => setSelectedVoucher(null)}
          title="Vé Du Lịch Điện Tử / Voucher"
          size="lg"
        >
          <div className="space-y-6">
            {/* Top Ticket Header */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-900 to-indigo-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/20">
                  TRAVELTRAIL BOARDING PASS
                </span>
                <h4 className="text-lg sm:text-xl font-bold mt-1">
                  {selectedVoucher.tourId?.title || 'Tour Du Lịch Trọn Gói'}
                </h4>
                <p className="text-xs text-sky-200 mt-1">
                  Mã vé: <strong className="font-mono text-sm">#BK-{(selectedVoucher._id || '').slice(-6).toUpperCase()}</strong>
                </p>
              </div>

              {/* QR Code Simulation */}
              <div className="w-24 h-24 bg-white p-2 rounded-xl shrink-0 flex flex-col items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-slate-900 text-[60px]">qr_code_2</span>
                <span className="text-[8px] font-mono font-bold text-slate-600">QUÉT TRA CỨU</span>
              </div>
            </div>

            {/* Ticket Info Details */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block mb-0.5">Ngày khởi hành</span>
                <strong className="text-slate-800 text-sm">{formatDate(selectedVoucher.departureDate)}</strong>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block mb-0.5">Thời lượng chuyến đi</span>
                <strong className="text-slate-800 text-sm">
                  {selectedVoucher.tourId?.duration?.text || '3 ngày 2 đêm'}
                </strong>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block mb-0.5">Số lượng khách</span>
                <strong className="text-slate-800 text-sm">
                  {(selectedVoucher.numberOfGuests?.adults || 1) + (selectedVoucher.numberOfGuests?.children || 0)} người
                </strong>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block mb-0.5">Trạng thái đơn</span>
                <BookingStatusBadge status={selectedVoucher.bookingStatus} />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block mb-0.5">Thanh toán</span>
                <strong className="text-slate-800 uppercase">{selectedVoucher.paymentMethod?.replace('_', ' ')}</strong>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block mb-0.5">Tổng số tiền</span>
                <strong className="text-primary text-sm font-black">{formatCurrency(selectedVoucher.totalAmount)}</strong>
              </div>
            </div>

            {/* Passenger & Contact Info */}
            {selectedVoucher.customerId && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                <h5 className="font-bold text-slate-800 mb-1">Thông tin liên hệ đại diện:</h5>
                <p>Họ tên: <strong>{selectedVoucher.customerId.fullName}</strong></p>
                <p>Điện thoại: <strong>{selectedVoucher.customerId.phone}</strong></p>
                <p>Email: <strong>{selectedVoucher.customerId.email}</strong></p>
              </div>
            )}

            {/* Print simulated button */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs sm:text-sm hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                <span>In vé / Tải PDF</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* CANCEL CONFIRMATION MODAL */}
      {cancelTarget && (
        <Modal
          isOpen={Boolean(cancelTarget)}
          onClose={() => setCancelTarget(null)}
          title="Xác nhận hủy đơn đặt tour"
        >
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Bạn có chắc chắn muốn hủy đơn đặt tour <strong className="text-slate-900">#BK-{(cancelTarget._id || '').slice(-6).toUpperCase()}</strong> không? Đơn sau khi hủy sẽ không thể tự hoàn tác.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lý do hủy đơn (tùy chọn):
              </label>
              <textarea
                rows={2}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Thay đổi lịch trình bận việc, v.v..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50"
              >
                Giữ lại đơn
              </button>
              <button
                type="button"
                disabled={isCancelling}
                onClick={handleConfirmCancel}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-sm"
              >
                {isCancelling ? 'Đang hủy...' : 'Xác nhận hủy tour'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MyBookings;
