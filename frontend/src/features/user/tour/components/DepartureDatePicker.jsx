import React, { useState } from 'react';
import formatDate from '../../../../utils/formatDate';

/**
 * DepartureDatePicker
 * Hiển thị danh sách ngày khởi hành cố định nếu có, hoặc cho phép tự chọn ngày.
 *
 * Props:
 *  - departureDates: Date[] — mảng ngày từ tour.departureDates
 *  - selectedDate: string — ngày đang chọn (ISO string)
 *  - onSelect: (dateStr: string) => void
 */
const DepartureDatePicker = ({ departureDates = [], selectedDate, onSelect }) => {
  const [mode, setMode] = useState(
    departureDates.length > 0 ? 'preset' : 'custom'
  );
  const [customDate, setCustomDate] = useState('');

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const handlePresetSelect = (dateStr) => {
    onSelect(dateStr);
  };

  const handleCustomChange = (e) => {
    const val = e.target.value;
    setCustomDate(val);
    if (val) onSelect(val);
  };

  return (
    <div>
      {departureDates.length > 0 && (
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setMode('preset')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
              mode === 'preset'
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-slate-600 border-slate-200 hover:border-primary'
            }`}
          >
            Ngày có sẵn
          </button>
          <button
            type="button"
            onClick={() => setMode('custom')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
              mode === 'custom'
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-slate-600 border-slate-200 hover:border-primary'
            }`}
          >
            Tự chọn ngày
          </button>
        </div>
      )}

      {mode === 'preset' && departureDates.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {departureDates.map((dateStr, i) => {
            const isSelected =
              selectedDate &&
              new Date(selectedDate).toDateString() === new Date(dateStr).toDateString();
            const isPast = new Date(dateStr) < today;
            return (
              <button
                key={i}
                type="button"
                disabled={isPast}
                onClick={() => handlePresetSelect(dateStr)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  isPast
                    ? 'border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed'
                    : isSelected
                    ? 'border-primary bg-sky-50/70 text-primary shadow-xs ring-2 ring-primary/20'
                    : 'border-slate-200 hover:border-primary/50 text-slate-700 bg-white hover:bg-sky-50/30'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[20px] text-primary">
                    calendar_today
                  </span>
                  <div>
                    <div className="font-bold text-sm">{formatDate(dateStr)}</div>
                    <div className="text-[11px] text-slate-400">
                      {isPast ? 'Đã qua' : 'Còn chỗ'}
                    </div>
                  </div>
                </div>
                {isSelected && (
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    check_circle
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {mode === 'custom' && (
        <div>
          <input
            type="date"
            min={todayStr}
            value={
              customDate ||
              (selectedDate ? new Date(selectedDate).toISOString().split('T')[0] : '')
            }
            onChange={handleCustomChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
          />
          {selectedDate && (
            <p className="text-xs text-primary font-semibold mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              Đã chọn: {formatDate(selectedDate)}
            </p>
          )}
        </div>
      )}

      {!departureDates.length && !selectedDate && (
        <p className="text-xs text-slate-400 mt-1">Chọn ngày khởi hành bên trên</p>
      )}
    </div>
  );
};

export default DepartureDatePicker;
