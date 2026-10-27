import React from 'react';
import Modal from '../../../../components/common/Modal';
import formatDate from '../../../../utils/formatDate';

export const PassengersListModal = ({
  isOpen,
  onClose,
  plan,
}) => {
  if (!plan) return null;

  const passengers = plan.passengersList || [];
  const guide = plan.guideId || null;
  const tour = plan.tourId || {};

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Thông Tin Chi Tiết Đoàn Khởi Hành & Danh Sách Hành Khách"
      size="2xl"
    >
      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/20 text-sky-200">
              ĐỢT KHỞI HÀNH THEO CHUYẾN
            </span>
            <h3 className="text-lg sm:text-xl font-bold mt-1 text-white">
              {tour.title || 'Tour Du Lịch'}
            </h3>
            <p className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-3">
              <span>
                Khởi hành: <strong className="text-cyan-300">{formatDate(plan.departureDate)}</strong>
              </span>
              {plan.endDate && (
                <span>
                  Về ngày: <strong className="text-cyan-300">{formatDate(plan.endDate)}</strong>
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {guide ? (
              <div className="flex items-center gap-2.5 p-2 px-3 rounded-xl bg-white/10 border border-white/10 text-xs">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-700">
                  <img
                    src={
                      guide.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
                    }
                    alt={guide.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Hướng dẫn viên</div>
                  <strong className="text-white text-xs">{guide.name}</strong>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-amber-300 text-xs font-semibold">
                <span className="material-symbols-outlined text-[16px]">person_off</span>
                <span>Chưa phân công HDV</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Info Bar */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
          <span className="text-slate-600">
            Tổng số khách đoàn: <strong className="text-slate-900 font-bold text-sm">{passengers.length || plan.totalPassengers || 0} người</strong>
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Mã đoàn: <span className="font-mono font-bold text-primary">#{plan._id ? plan._id.slice(-6).toUpperCase() : 'PLAN'}</span>
          </span>
        </div>

        {/* Passengers Table */}
        {passengers.length === 0 ? (
          <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <span className="material-symbols-outlined text-[32px] text-slate-300 mb-1">group_off</span>
            <p className="text-xs font-semibold text-slate-600">
              Đoàn chưa có danh sách chi tiết từng hành khách
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Số lượng khách tạm tính từ đơn booking: {plan.totalPassengers || 0} người
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 border-b border-slate-200">
                <tr className="whitespace-nowrap">
                  <th className="py-2.5 px-3">STT</th>
                  <th className="py-2.5 px-3">Họ và tên hành khách</th>
                  <th className="py-2.5 px-3">Giới tính</th>
                  <th className="py-2.5 px-3">Phân loại</th>
                  <th className="py-2.5 px-3">Ngày sinh</th>
                  <th className="py-2.5 px-3">Số CCCD / Hộ chiếu</th>
                  <th className="py-2.5 px-3">Số điện thoại</th>
                  <th className="py-2.5 px-3">Mã đơn liên kết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {passengers.map((p, i) => {
                  const bCode = p.bookingId
                    ? `#BK-${(typeof p.bookingId === 'object' ? p.bookingId._id : p.bookingId).slice(-6).toUpperCase()}`
                    : '—';

                  return (
                    <tr
                      key={i}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-2.5 px-3 font-mono text-slate-400">{i + 1}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        {p.fullName}
                      </td>
                      <td className="py-2.5 px-3 capitalize text-slate-600">
                        {p.gender === 'male' ? 'Nam' : p.gender === 'female' ? 'Nữ' : 'Khác'}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {p.passengerType === 'child' ? 'Trẻ em' : p.passengerType === 'infant' ? 'Em bé' : 'Người lớn'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {p.dob ? formatDate(p.dob) : '—'}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-800">
                        {p.idCardNumber || '—'}
                      </td>
                      <td className="py-2.5 px-3 text-slate-800">
                        {p.phone || '—'}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-xs text-primary font-bold">
                        {bCode}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>In Danh Sách Khách Đoàn</span>
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

export default PassengersListModal;
