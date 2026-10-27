import React from 'react';
import { Link } from 'react-router-dom';
import formatCurrency from '../../../../utils/formatCurrency';
import formatDate from '../../../../utils/formatDate';

export const TripSpecsCard = ({ booking, countdownDays }) => {
  const tour = booking?.tourId || {};
  const destination = tour?.destinationId || {};
  const customer = booking?.customerId || {};
  const guide = booking?.guide_id || null;
  const duration = booking?.selectedDuration || { days: 1, nights: 0 };
  const guests = booking?.numberOfGuests || { adults: 1, children: 0 };
  const totalGuests = (guests.adults || 0) + (guests.children || 0);

  const paymentMethods = {
    cash: 'Tiền mặt tại quầy',
    bank_transfer: 'Chuyển khoản ngân hàng',
    credit_card: 'Thẻ tín dụng / Ghi nợ quốc tế',
    e_wallet: 'Ví điện tử (MoMo / ZaloPay)',
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 mb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-primary flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[22px]">info</span>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Thông Tin Chi Tiết Chuyến Đi Đã Đặt
            </h2>
            <p className="text-xs text-slate-500">
              Kiểm tra lịch khởi hành, danh sách người đi và hướng dẫn viên đồng hành.
            </p>
          </div>
        </div>

        {/* Countdown Badge */}
        {countdownDays !== null && (
          <div
            className={`hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold ${
              countdownDays > 0
                ? 'bg-sky-50 text-sky-700 border border-sky-200'
                : countdownDays === 0
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
            <span>
              {countdownDays > 0
                ? `Còn ${countdownDays} ngày nữa đến chuyến đi!`
                : countdownDays === 0
                ? 'Hôm nay là ngày khởi hành!'
                : 'Chuyến đi đã diễn ra'}
            </span>
          </div>
        )}
      </div>

      {/* Main Grid: 4 cols on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Item 1: Departure & Return Dates */}
        <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[18px] text-primary">calendar_month</span>
              <span>Thời Gian Hành Trình</span>
            </div>
            <div className="space-y-1.5 mt-2">
              <div>
                <span className="text-[11px] text-slate-400 block">Ngày khởi hành:</span>
                <span className="text-sm font-bold text-slate-900">
                  {formatDate(booking?.departureDate)}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Ngày kết thúc:</span>
                <span className="text-sm font-bold text-slate-900">
                  {formatDate(booking?.endDate || booking?.departureDate)}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-200/60 text-xs text-sky-700 font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">timelapse</span>
            <span>
              {duration.days} ngày {duration.nights} đêm
            </span>
          </div>
        </div>

        {/* Item 2: Destination & Tour Type */}
        <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[18px] text-emerald-600">pin_drop</span>
              <span>Điểm Đến & Gói Đặt</span>
            </div>
            <div className="space-y-1 mt-2">
              <h4 className="text-sm font-bold text-slate-900 line-clamp-2">
                {destination?.name || 'Điểm đến du lịch'}
              </h4>
              <p className="text-xs text-slate-500">
                {destination?.location || 'Việt Nam'}
              </p>
            </div>
          </div>
          {destination?.slug ? (
            <Link
              to={`/destinations/${destination.slug}`}
              className="mt-3 pt-3 border-t border-slate-200/60 text-xs text-primary font-bold hover:underline flex items-center gap-1"
            >
              <span>Xem trang điểm đến</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          ) : (
            <div className="mt-3 pt-3 border-t border-slate-200/60 text-xs text-slate-400 font-medium">
              Gói trọn gói cao cấp
            </div>
          )}
        </div>

        {/* Item 3: Guests & Passengers */}
        <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[18px] text-indigo-600">group</span>
              <span>Số Lượng Khách</span>
            </div>
            <div className="space-y-1.5 mt-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-900">{totalGuests}</span>
                <span className="text-xs text-slate-500 font-medium">hành khách</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <span>
                  <strong>{guests.adults || 1}</strong> Người lớn
                </span>
                <span>•</span>
                <span>
                  <strong>{guests.children || 0}</strong> Trẻ em
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-200/60 text-[11px] text-slate-500">
            Bảo hiểm trọn gói từng khách
          </div>
        </div>

        {/* Item 4: Payment & Total Amount */}
        <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-sky-900 uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[18px] text-sky-600">payments</span>
              <span>Tổng Chi Phí Đã Đặt</span>
            </div>
            <div className="mt-2">
              <span className="text-[11px] text-sky-700 font-semibold block">Tổng tiền thanh toán:</span>
              <div className="text-xl sm:text-2xl font-black text-primary">
                {formatCurrency(booking?.totalAmount || 0)}
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-sky-200/60 text-xs text-slate-600">
            <span className="font-semibold">Hình thức: </span>
            <span>{paymentMethods[booking?.paymentMethod] || 'Chuyển khoản'}</span>
          </div>
        </div>
      </div>

      {/* Guide & Representative Details Bar */}
      <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Guide Card */}
        <div className="p-4 rounded-2xl bg-white border border-slate-100 flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-sm overflow-hidden">
            {guide?.avatar ? (
              <img src={guide.avatar} alt={guide.name} className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-[28px]">person</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                Hướng Dẫn Viên
              </span>
              {guide && (
                <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[13px]">check_circle</span>
                  Đã phân công
                </span>
              )}
            </div>
            <h4 className="text-sm font-bold text-slate-900 truncate">
              {guide?.name || 'Đang cập nhật hướng dẫn viên'}
            </h4>
            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
              {guide?.specialisation || 'Chuyên viên hướng dẫn du lịch TravelTrail'}
            </p>
            {guide?.languages && guide.languages.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500">
                <span className="material-symbols-outlined text-[13px] text-slate-400">translate</span>
                <span>{guide.languages.join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Booker / Customer Info */}
        <div className="p-4 rounded-2xl bg-white border border-slate-100 flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xl shrink-0">
            <span className="material-symbols-outlined text-[28px]">contact_mail</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                Người Đại Diện Đặt
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 truncate">
              {customer?.fullName || 'Khách hàng'}
            </h4>
            <div className="space-y-0.5 mt-1 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 truncate">
                <span className="material-symbols-outlined text-[14px] text-slate-400">mail</span>
                <span>{customer?.email || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-slate-400">call</span>
                <span>{customer?.phone || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Special Notes Box */}
      {booking?.notes && (
        <div className="mt-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2.5">
          <span className="material-symbols-outlined text-[18px] text-amber-600 shrink-0 mt-0.5">
            sticky_note_2
          </span>
          <div>
            <strong className="font-bold">Ghi chú đặc biệt từ khách hàng: </strong>
            <span className="leading-relaxed whitespace-pre-line">{booking.notes}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripSpecsCard;
