import React, { useState, useEffect } from 'react';
import Modal from '../../../../components/common/Modal';
import formatDate from '../../../../utils/formatDate';

export const CreateBookingPlanModal = ({
  isOpen,
  onClose,
  tours = [],
  guides = [],
  onSubmit,
  isSubmitting,
}) => {
  const [tourId, setTourId] = useState('');
  const [duration, setDuration] = useState({ days: 2, nights: 1 });
  const [departureDate, setDepartureDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guideId, setGuideId] = useState('');
  const [status, setStatus] = useState('scheduled');
  const [error, setError] = useState('');

  const selectedTour = tours.find((t) => t._id === tourId);

  // When tour changes, auto-select first duration option if available
  useEffect(() => {
    if (selectedTour?.durationOptions && selectedTour.durationOptions.length > 0) {
      const firstOpt = selectedTour.durationOptions[0];
      setDuration({ days: firstOpt.days, nights: firstOpt.nights });
    }
  }, [tourId, selectedTour]);

  // Auto-calculate endDate = departureDate + (duration.days - 1)
  useEffect(() => {
    if (departureDate && duration.days) {
      const dep = new Date(departureDate);
      if (!isNaN(dep.getTime())) {
        const end = new Date(dep);
        end.setDate(dep.getDate() + Math.max(Number(duration.days) - 1, 0));
        setEndDate(end.toISOString().slice(0, 10));
      }
    } else {
      setEndDate('');
    }
  }, [departureDate, duration.days]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!tourId) {
      setError('Vui lòng chọn Tour du lịch!');
      return;
    }

    if (!departureDate) {
      setError('Vui lòng chọn ngày khởi hành!');
      return;
    }

    const payload = {
      tourId,
      duration: {
        days: Number(duration.days) || 1,
        nights: Number(duration.nights) || 0,
      },
      departureDate,
      endDate: endDate || departureDate,
      guideId: guideId || null,
      status,
    };

    const success = await onSubmit(payload);
    if (success) {
      setTourId('');
      setDepartureDate('');
      setEndDate('');
      setGuideId('');
      setStatus('scheduled');
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Lập Đợt Đoàn Khởi Hành Mới"
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-600 text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tour Selection */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
              Tour Du Lịch <span className="text-rose-500">*</span>
            </label>
            <select
              value={tourId}
              onChange={(e) => setTourId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">-- Chọn gói Tour du lịch --</option>
              {tours.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>

          {/* Duration Package Selection */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
              Gói Thời Lượng Của Đoàn
            </label>
            {selectedTour?.durationOptions && selectedTour.durationOptions.length > 0 ? (
              <select
                value={`${duration.days}-${duration.nights}`}
                onChange={(e) => {
                  const [days, nights] = e.target.value.split('-').map(Number);
                  setDuration({ days, nights });
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-semibold text-slate-800"
              >
                {selectedTour.durationOptions.map((opt, i) => (
                  <option key={i} value={`${opt.days}-${opt.nights}`}>
                    {opt.days} Ngày {opt.nights} Đêm (Giá: {opt.price?.toLocaleString('vi-VN')}đ/khách)
                  </option>
                ))}
              </select>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min="1"
                  value={duration.days}
                  onChange={(e) => setDuration((prev) => ({ ...prev, days: Number(e.target.value) }))}
                  placeholder="Số ngày"
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
                <input
                  type="number"
                  min="0"
                  value={duration.nights}
                  onChange={(e) => setDuration((prev) => ({ ...prev, nights: Number(e.target.value) }))}
                  placeholder="Số đêm"
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            )}
          </div>

          {/* Guide Assignment */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
              Hướng Dẫn Viên Phụ Trách
            </label>
            <select
              value={guideId}
              onChange={(e) => setGuideId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">-- Chưa gán HDV (Gán sau) --</option>
              {guides.map((g) => (
                <option key={g._id} value={g._id}>
                  {g.name} - {g.specialisation || 'HDV chính'}
                </option>
              ))}
            </select>
          </div>

          {/* Departure Date */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
              Ngày Khởi Hành <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Auto-calculated End Date */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
              Ngày Kết Thúc Chuyến Đi (Tự động tính)
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
            />
          </div>

          {/* Status */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
              Trạng Thái Đợt Khởi Hành
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-semibold"
            >
              <option value="scheduled">Đã lên lịch (Scheduled)</option>
              <option value="in_progress">Đang diễn ra (In Progress)</option>
              <option value="completed">Đã hoàn thành (Completed)</option>
              <option value="cancelled">Đã hủy (Cancelled)</option>
            </select>
          </div>
        </div>

        {/* Schedule preview card */}
        {departureDate && (
          <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-between text-xs text-sky-900">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">calendar_month</span>
              <div>
                <span className="font-semibold">Hành trình dự kiến: </span>
                <strong>{formatDate(departureDate)}</strong>
                {endDate && (
                  <>
                    {' '}đến <strong>{formatDate(endDate)}</strong> ({duration.days}N{duration.nights}Đ)
                  </>
                )}
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-sky-200/70 text-sky-900 font-bold text-[11px]">
              Tự động khớp đoàn
            </span>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">add_task</span>
                <span>Tạo đoàn khởi hành</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateBookingPlanModal;
