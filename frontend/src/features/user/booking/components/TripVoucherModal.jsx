import React from 'react';
import Modal from '../../../../components/common/Modal';
import formatCurrency from '../../../../utils/formatCurrency';
import formatDate from '../../../../utils/formatDate';

export const TripVoucherModal = ({ isOpen, onClose, booking }) => {
  if (!booking) return null;

  const tour = booking.tourId || {};
  const destination = tour.destinationId || {};
  const customer = booking.customerId || {};
  const guide = booking.guide_id || {};
  const bookingCode =
    booking.bookingCode || `#BK-${(booking._id || '0000').slice(-6).toUpperCase()}`;

  const guests = booking.numberOfGuests || { adults: 1, children: 0 };
  const totalGuests = (guests.adults || 0) + (guests.children || 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Vé Du Lịch Điện Tử (E-Voucher)" size="lg">
      <div className="space-y-6 print:m-0 print:p-0">
        {/* Printable Ticket Container */}
        <div
          id="printable-ticket"
          className="rounded-3xl border-2 border-dashed border-sky-300 bg-white overflow-hidden shadow-sm"
        >
          {/* Header Ticket Band */}
          <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="inline-block px-2.5 py-1 rounded bg-white/20 text-sky-300 font-extrabold text-[10px] tracking-widest uppercase mb-2">
                TRAVELTRAIL ELECTRONIC BOARDING PASS
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {tour.title || 'Tour Du Lịch Trọn Gói TravelTrail'}
              </h3>
              <p className="text-xs text-sky-200 mt-1">
                Điểm đến: <strong>{destination.name || 'Việt Nam'}</strong>
              </p>
            </div>

            {/* QR Code Container */}
            <div className="bg-white p-3 rounded-2xl shrink-0 flex flex-col items-center justify-center text-center shadow-md">
              <span className="material-symbols-outlined text-slate-900 text-[64px]">qr_code_2</span>
              <span className="text-[9px] font-mono font-black text-slate-700 tracking-wider">
                {bookingCode}
              </span>
            </div>
          </div>

          {/* Ticket Body Grid */}
          <div className="p-6 sm:p-8 bg-slate-50/50 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-xs border-b border-slate-100">
            <div>
              <span className="text-[11px] text-slate-400 font-bold uppercase block">Họ tên hành khách:</span>
              <span className="text-sm font-extrabold text-slate-900 mt-0.5 block truncate">
                {customer.fullName || 'Khách hàng'}
              </span>
              <span className="text-[11px] text-slate-500">{customer.phone}</span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 font-bold uppercase block">Ngày khởi hành:</span>
              <span className="text-sm font-extrabold text-sky-700 mt-0.5 block">
                {formatDate(booking.departureDate)}
              </span>
              <span className="text-[11px] text-slate-500">
                Gói {booking.selectedDuration?.days || 1}N{booking.selectedDuration?.nights || 0}Đ
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 font-bold uppercase block">Số lượng đoàn:</span>
              <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">
                {totalGuests} khách
              </span>
              <span className="text-[11px] text-slate-500">
                {guests.adults || 1} lớn, {guests.children || 0} trẻ
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 font-bold uppercase block">Hướng dẫn viên:</span>
              <span className="text-sm font-extrabold text-slate-900 mt-0.5 block truncate">
                {guide.name || 'HDV Đoàn'}
              </span>
              <span className="text-[11px] text-emerald-600 font-bold">Chính thức</span>
            </div>
          </div>

          {/* Ticket Footer / Instructions */}
          <div className="p-5 sm:p-6 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <span className="material-symbols-outlined text-[18px] text-sky-600">check_box</span>
              <span>
                Vui lòng xuất trình vé điện tử này hoặc mã <strong>{bookingCode}</strong> khi lên xe.
              </span>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[11px] text-slate-400 block font-semibold">Tổng thanh toán:</span>
              <span className="text-base font-black text-primary">
                {formatCurrency(booking.totalAmount || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-dark shadow-md shadow-sky-500/25 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[17px]">print</span>
            <span>In Vé Điện Tử (PDF)</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TripVoucherModal;
