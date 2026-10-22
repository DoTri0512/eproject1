import React, { useState, useEffect } from 'react';

/**
 * TourItinerary
 * Hiển thị lịch trình từng ngày theo durationOption đã chọn.
 *
 * Props:
 *  - itinerary: { day: Number, title: String, description: String }[]
 *  - selectedDays: number — số ngày của option đang chọn (filter hiển thị: 2 ngày hiện 2 ngày, 3 ngày hiện 3 ngày)
 */
const TourItinerary = ({ itinerary = [], selectedDays = null }) => {
  const [openDay, setOpenDay] = useState(1);

  // Reset về ngày 1 mỗi khi đổi gói duration
  useEffect(() => {
    setOpenDay(1);
  }, [selectedDays]);

  // Nếu có selectedDays, chỉ hiển thị đúng các ngày <= selectedDays (2 ngày hiện 2 ngày, 3 ngày hiện 3 ngày)
  const filteredItinerary = selectedDays
    ? itinerary.filter((item, idx) => {
        const dayNumber = Number(item.day) || idx + 1;
        return dayNumber <= Number(selectedDays);
      })
    : itinerary;

  if (!filteredItinerary.length) {
    return (
      <div className="text-center py-8 text-slate-400 text-sm">
        <span className="material-symbols-outlined text-[32px] block mb-2 opacity-40">
          map
        </span>
        Chưa có lịch trình chi tiết cho chuyến đi này.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredItinerary.map((item) => {
        const isOpen = openDay === item.day;
        return (
          <div
            key={item.day}
            className={`rounded-2xl border transition-all overflow-hidden ${
              isOpen
                ? 'border-primary/30 bg-sky-50/60 shadow-xs'
                : 'border-slate-100 bg-white hover:border-slate-200'
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenDay(isOpen ? null : item.day)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 ${
                    isOpen
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.day}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                    Ngày {item.day}
                  </span>
                  <span className="font-bold text-slate-900 text-sm leading-snug">
                    {item.title}
                  </span>
                </div>
              </div>
              <span
                className={`material-symbols-outlined text-[20px] text-slate-400 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              >
                expand_more
              </span>
            </button>

            {isOpen && item.description && (
              <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-primary/10 pt-4">
                <div className="flex gap-2">
                  <span className="material-symbols-outlined text-[16px] text-primary shrink-0 mt-0.5">
                    schedule
                  </span>
                  <p>{item.description}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TourItinerary;
