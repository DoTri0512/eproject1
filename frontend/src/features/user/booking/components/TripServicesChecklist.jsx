import React from 'react';

export const TripServicesChecklist = ({ includes = [], excludes = [] }) => {
  const defaultIncludes = [
    'Xe ô tô du lịch đời mới máy lạnh đưa đón chất lượng cao suốt tuyến',
    'Khách sạn tiêu chuẩn phòng đôi tiện nghi (2 khách/phòng)',
    'Các bữa ăn theo tiêu chuẩn chương trình tour',
    'Vé tham quan tất cả các điểm danh lam thắng cảnh trong lịch trình',
    'Hướng dẫn viên du lịch chuyên nghiệp, nhiệt tình hỗ trợ đoàn',
    'Bảo hiểm du lịch trọn gói mức bồi thường tối đa 100.000.000 đ',
    'Nước suối đóng chai tinh khiết và nón du lịch thời trang',
  ];

  const defaultExcludes = [
    'Chi phí cá nhân ngoài chương trình: giặt ủi, điện thoại, nước uống minibar',
    'Vé tham quan và dịch vụ vui chơi giải trí ngoài danh mục bao gồm',
    'Tiền bồi dưỡng (Tip) cho lái xe và hướng dẫn viên (tùy tâm)',
    'Thuế giá trị gia tăng VAT (nếu quý khách có nhu cầu lấy hóa đơn GTGT)',
  ];

  const displayIncludes = includes.length > 0 ? includes : defaultIncludes;
  const displayExcludes = excludes.length > 0 ? excludes : defaultExcludes;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 mb-8">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
          <span className="material-symbols-outlined text-[22px]">checklist</span>
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
            Dịch Vụ Bao Gồm & Không Bao Gồm
          </h2>
          <p className="text-xs text-slate-500">
            Chính sách dịch vụ minh bạch để quý khách an tâm chuẩn bị hành lý.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Includes Column */}
        <div className="bg-emerald-50/40 rounded-2xl p-5 sm:p-6 border border-emerald-100">
          <div className="flex items-center gap-2 text-sm font-extrabold text-emerald-800 uppercase tracking-wider mb-4">
            <span className="material-symbols-outlined text-[20px] text-emerald-600">check_circle</span>
            <span>Dịch Vụ Đã Bao Gồm</span>
          </div>

          <ul className="space-y-3">
            {displayIncludes.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0 mt-0.5">
                  task_alt
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Excludes Column */}
        <div className="bg-rose-50/30 rounded-2xl p-5 sm:p-6 border border-rose-100">
          <div className="flex items-center gap-2 text-sm font-extrabold text-rose-800 uppercase tracking-wider mb-4">
            <span className="material-symbols-outlined text-[20px] text-rose-600">cancel</span>
            <span>Chi Phí Không Bao Gồm</span>
          </div>

          <ul className="space-y-3">
            {displayExcludes.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                <span className="material-symbols-outlined text-[18px] text-rose-500 shrink-0 mt-0.5">
                  close
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TripServicesChecklist;
