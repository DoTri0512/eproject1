import React, { useState } from 'react';
import formatDate from '../../../../utils/formatDate';

export const TripItineraryTimeline = ({ itinerary = [], departureDate, destinationGallery = [] }) => {
  const [selectedDay, setSelectedDay] = useState('all');

  const getDayDate = (dayNumber) => {
    if (!departureDate) return null;
    const date = new Date(departureDate);
    date.setDate(date.getDate() + (dayNumber - 1));
    return formatDate(date);
  };

  const displayedItinerary =
    selectedDay === 'all'
      ? itinerary
      : itinerary.filter((item) => item.day === Number(selectedDay));

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-primary flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[22px]">route</span>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Kế Hoạch Lịch Trình Chi Tiết Từng Ngày
            </h2>
            <p className="text-xs text-slate-500">
              Hành trình trải nghiệm thực tế khớp đúng với gói thời lượng bạn đã lựa chọn.
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-semibold bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200/60 self-start sm:self-auto">
          Tổng cộng: <strong className="text-primary">{itinerary.length} Ngày</strong> hoạt động
        </div>
      </div>

      {/* Day Selection Tabs Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedDay('all')}
          className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-xs ${
            selectedDay === 'all'
              ? 'bg-primary text-white shadow-md shadow-sky-500/20'
              : 'bg-slate-50 text-slate-600 border border-slate-200/80 hover:bg-slate-100'
          }`}
        >
          Tất cả các ngày ({itinerary.length})
        </button>

        {itinerary.map((item) => {
          const isActive = selectedDay === String(item.day);
          return (
            <button
              key={item.day}
              type="button"
              onClick={() => setSelectedDay(String(item.day))}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-xs flex items-center gap-1.5 ${
                isActive
                  ? 'bg-primary text-white shadow-md shadow-sky-500/20'
                  : 'bg-slate-50 text-slate-600 border border-slate-200/80 hover:bg-slate-100'
              }`}
            >
              <span>Ngày {item.day}</span>
              {departureDate && (
                <span
                  className={`text-[10px] font-normal hidden md:inline ${
                    isActive ? 'text-white/80' : 'text-slate-400'
                  }`}
                >
                  ({getDayDate(item.day)})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Vertical Interactive Timeline */}
      <div className="relative border-l-2 border-sky-100 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-8">
        {displayedItinerary.map((dayPlan, index) => {
          const dayDate = getDayDate(dayPlan.day);
          const galleryPreview = destinationGallery[index % Math.max(destinationGallery.length, 1)];

          return (
            <div key={dayPlan.day || index} className="relative group">
              {/* Timeline Node Dot / Circle */}
              <div className="absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-xs shadow-md shadow-sky-500/30 border-4 border-white ring-1 ring-sky-200 group-hover:scale-110 transition-transform">
                {dayPlan.day}
              </div>

              {/* Day Card Box */}
              <div className="bg-slate-50/70 border border-slate-200/70 rounded-3xl p-5 sm:p-7 hover:shadow-md transition-shadow">
                {/* Day Header */}
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-sky-100 text-sky-800 text-[11px] font-extrabold uppercase">
                      NGÀY {dayPlan.day}
                    </span>
                    {dayDate && (
                      <span className="text-xs font-semibold text-slate-500">
                        {dayDate}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Lịch trình chuẩn TravelTrail
                  </span>
                </div>

                {/* Day Title */}
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                  {dayPlan.title}
                </h3>

                {/* Day Full Description */}
                {dayPlan.description && (
                  <p className="text-sm text-slate-600 leading-relaxed font-normal mb-5 whitespace-pre-line">
                    {dayPlan.description}
                  </p>
                )}

                {/* Time Slots Breakdown Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 mb-1">
                      <span className="material-symbols-outlined text-[16px]">wb_twilight</span>
                      <span>Buổi Sáng (08:00)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Đón khách tại điểm hẹn, xe đời mới đưa đón, tham quan danh thắng mốc 1.
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 mb-1">
                      <span className="material-symbols-outlined text-[16px]">wb_sunny</span>
                      <span>Buổi Trưa (11:30)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Dùng bữa trưa tại nhà hàng đặc sản địa phương, nhận phòng nghỉ ngơi.
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-sky-600 mb-1">
                      <span className="material-symbols-outlined text-[16px]">sailing</span>
                      <span>Buổi Chiều (14:00)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Khám phá danh lam trọng điểm, trải nghiệm hoạt động văn hóa đặc trưng.
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 mb-1">
                      <span className="material-symbols-outlined text-[16px]">bedtime</span>
                      <span>Buổi Tối (18:30)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Thưởng thức ẩm thực đêm, dạo phố cổ/chợ đêm hoặc tự do nghỉ dưỡng.
                    </p>
                  </div>
                </div>

                {/* Important Tips & Attraction Photo */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4 border-t border-slate-200/60">
                  <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/50">
                    <span className="material-symbols-outlined text-[16px] text-amber-600">tips_and_updates</span>
                    <span>
                      <strong>Lưu ý ngày này: </strong> Mang giày thể thao thoải mái, nón nón và chuẩn bị máy ảnh.
                    </span>
                  </div>

                  {galleryPreview?.url && (
                    <div className="flex items-center gap-2">
                      <img
                        src={galleryPreview.url}
                        alt={galleryPreview.caption || 'Điểm tham quan'}
                        className="w-12 h-12 rounded-xl object-cover shadow-2xs border border-white"
                      />
                      <span className="text-[11px] text-slate-500 font-medium max-w-[140px] truncate">
                        {galleryPreview.caption || 'Danh lam thắng cảnh'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TripItineraryTimeline;
