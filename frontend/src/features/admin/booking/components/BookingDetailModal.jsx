import React, { useState, useEffect } from 'react';
import Modal from '../../../../components/common/Modal';
import formatCurrency from '../../../../utils/formatCurrency';
import formatDate from '../../../../utils/formatDate';

export const BookingDetailModal = ({
  isOpen,
  onClose,
  booking,
  onUpdateStatus,
  isSubmitting = false,
}) => {
  if (!booking) return null;

  const [bookingStatus, setBookingStatus] = useState(booking.bookingStatus || 'pending');
  const [paymentStatus, setPaymentStatus] = useState(booking.paymentStatus || 'pending');

  useEffect(() => {
    if (booking) {
      setBookingStatus(booking.bookingStatus || 'pending');
      setPaymentStatus(booking.paymentStatus || 'pending');
    }
  }, [booking]);

  const bookingCode = `#BK-${(booking._id || '').slice(-6).toUpperCase()}`;
  const tour = booking.tourId || {};
  const customer = booking.customerId || {};
  const user = booking.userId || {};

  const handleSaveStatus = () => {
    onUpdateStatus(booking._id, { bookingStatus, paymentStatus });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Chi Tiết Đơn Đặt Tour • ${bookingCode}`}
      size="xl"
    >
      <div className="space-y-6 max-h-[80vh] overflow-y-auto px-1 pr-2">
        {/* Top Header Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-sky-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-sky-300 font-bold">
              Mã Đơn Đặt Tour
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white mt-0.5">
              {bookingCode}
            </div>
            <div className="text-xs text-slate-300 mt-1">
              Đặt ngày: {formatDate(booking.createdAt || booking.bookingDate)}
            </div>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold">
              Tổng Giá Trị Đơn Hàng
            </div>
            <div className="text-2xl sm:text-3xl font-black text-cyan-400 mt-0.5">
              {formatCurrency(booking.totalAmount)}
            </div>
            <div className="text-xs text-sky-200 mt-1 uppercase font-bold">
              {booking.paymentMethod?.replace('_', ' ') || 'Chuyển khoản'}
            </div>
          </div>
        </div>

        {/* Section: Status Manager & Quick Actions */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Cập nhật Trạng thái Đơn hàng
            </span>
            <span className="text-xs text-slate-400">Thay đổi và nhấn Lưu cập nhật</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Trạng thái Đặt chỗ (Booking Status)
              </label>
              <select
                value={bookingStatus}
                onChange={(e) => setBookingStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="pending">Chờ xác nhận (Pending)</option>
                <option value="confirmed">Đã xác nhận (Confirmed)</option>
                <option value="completed">Đã hoàn thành (Completed)</option>
                <option value="cancelled">Đã hủy (Cancelled)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Trạng thái Thanh toán (Payment Status)
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="pending">Chưa thanh toán / Chờ (Pending)</option>
                <option value="confirmed">Đã thanh toán (Confirmed)</option>
                <option value="completed">Hoàn tất quyết toán (Completed)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setBookingStatus('confirmed');
                  setPaymentStatus('confirmed');
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold hover:bg-emerald-200 transition-colors"
              >
                ✓ Duyệt nhanh đơn
              </button>
              <button
                type="button"
                onClick={() => {
                  setBookingStatus('completed');
                  setPaymentStatus('completed');
                }}
                className="px-3 py-1.5 rounded-lg bg-sky-100 text-sky-800 text-xs font-bold hover:bg-sky-200 transition-colors"
              >
                ✓ Hoàn thành tour
              </button>
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSaveStatus}
              className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-sm hover:bg-primary-dark transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  <span>Lưu Cập Nhật</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Section: Customer & Tour Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Card */}
          <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-100">
              <span className="material-symbols-outlined text-[18px]">person</span>
              <span>Thông tin Khách hàng đại diện</span>
            </div>
            <div className="text-xs space-y-1.5 text-slate-600">
              <p>
                Họ và tên:{' '}
                <strong className="text-slate-900 text-sm font-bold">
                  {customer.fullName || user.name || 'Khách vãng lai'}
                </strong>
              </p>
              <p>
                Email:{' '}
                <strong className="text-slate-800">{customer.email || user.email || '—'}</strong>
              </p>
              <p>
                Số điện thoại:{' '}
                <strong className="text-slate-800">{customer.phone || '—'}</strong>
              </p>
              {customer.idCardNumber && (
                <p>
                  Số CCCD / Hộ chiếu:{' '}
                  <strong className="text-slate-800 font-mono">{customer.idCardNumber}</strong>
                </p>
              )}
              {customer.address && (
                <p>
                  Địa chỉ: <span className="text-slate-700">{customer.address}, {customer.city}</span>
                </p>
              )}
            </div>
          </div>

          {/* Tour Card */}
          <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-100">
              <span className="material-symbols-outlined text-[18px]">travel_explore</span>
              <span>Thông tin Tour & Chuyến đi</span>
            </div>
            <div className="text-xs space-y-1.5 text-slate-600">
              <p className="font-bold text-slate-900 text-sm line-clamp-1">
                {tour.title || 'Tour Du Lịch Trọn Gói'}
              </p>
              <p>
                Khởi hành:{' '}
                <strong className="text-sky-800 font-bold">{formatDate(booking.departureDate)}</strong>
              </p>
              <p>
                Thời lượng: <strong className="text-slate-800">{tour.duration?.text || '—'}</strong>
              </p>
              <p>
                Số lượng khách:{' '}
                <strong className="text-slate-800">
                  {(booking.numberOfGuests?.adults || 1) + (booking.numberOfGuests?.children || 0)} người{' '}
                  ({booking.numberOfGuests?.adults || 1} lớn, {booking.numberOfGuests?.children || 0} trẻ em)
                </strong>
              </p>
              {booking.specialRequests && (
                <div className="p-2 rounded-lg bg-amber-50 text-amber-800 text-[11px] mt-2">
                  <strong>Yêu cầu đặc biệt:</strong> {booking.specialRequests}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section: Passengers List if exists */}
        {booking.passengers && booking.passengers.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Danh Sách Hành Khách Đi Cùng ({booking.passengers.length} người)
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold">
                  <tr>
                    <th className="py-2 px-3">STT</th>
                    <th className="py-2 px-3">Họ và tên</th>
                    <th className="py-2 px-3">Giới tính</th>
                    <th className="py-2 px-3">Ngày sinh</th>
                    <th className="py-2 px-3">Số CCCD / Hộ chiếu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {booking.passengers.map((p, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono">{i + 1}</td>
                      <td className="py-2 px-3 font-bold text-slate-800">{p.fullName}</td>
                      <td className="py-2 px-3 capitalize">{p.gender === 'male' ? 'Nam' : p.gender === 'female' ? 'Nữ' : 'Khác'}</td>
                      <td className="py-2 px-3">{p.dob ? formatDate(p.dob) : '—'}</td>
                      <td className="py-2 px-3 font-mono">{p.idCardNumber || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>In Phiếu Thu / Vé</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default BookingDetailModal;
