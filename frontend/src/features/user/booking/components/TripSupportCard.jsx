import React from 'react';

export const TripSupportCard = () => {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-sky-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left: Travel Guidelines */}
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400 mb-2">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span>Lưu Ý Chuẩn Bị & Quy Định Chuyến Đi</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black mb-3">
            Hành Trang Vững Vàng Cho Chuyến Đi Tuyệt Vời
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-sky-400">badge</span>
              <span>Mang theo <strong>CCCD / Hộ chiếu gốc</strong> còn hạn tối thiểu 6 tháng.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-sky-400">luggage</span>
              <span>Hành lý gọn gàng, trang phục mát mẻ và đồ bơi nếu đi tour biển đảo.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-sky-400">medication</span>
              <span>Chuẩn bị sẵn thuốc cá nhân chống say xe, kem chống nắng và sạc dự phòng.</span>
            </li>
          </ul>
        </div>

        {/* Right: 24/7 Hotline & Emergency Box */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 w-full lg:w-auto shrink-0 space-y-3">
          <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            Tổng Đài Hỗ Trợ Khẩn Cấp 24/7
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[22px]">phone_in_talk</span>
            </div>
            <div>
              <div className="text-lg font-black text-white font-mono">1900 6868</div>
              <div className="text-[11px] text-slate-300">Điều hành tour TravelTrail</div>
            </div>
          </div>
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-sky-200">
            <span>Email hỗ trợ:</span>
            <span className="font-semibold text-white">support@traveltrail.vn</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripSupportCard;
