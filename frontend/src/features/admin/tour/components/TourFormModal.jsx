import React, { useState, useEffect } from 'react';
import Modal from '../../../../components/common/Modal';

/**
 * TourFormModal – Admin form tạo / chỉnh sửa Tour.
 * Schema khớp 100% với backend Tour model:
 *  - durationOptions: [{ days, nights, price }]  (thay thế price + duration cũ)
 *  - departureDates: Date[]
 *  - itinerary: [{ day, title, description }]
 *  - includes, excludes, maxPassengers, availableSeats, status
 */
const DEFAULT_DURATION_OPTIONS = [
  { days: 2, nights: 1, price: 2000000 },
  { days: 3, nights: 2, price: 3500000 },
  { days: 4, nights: 3, price: 5000000 },
];

export const TourFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  tour,
  destinations = [],
  isSubmitting = false,
}) => {
  const isEdit = Boolean(tour?._id);

  const [formData, setFormData] = useState({
    title: '',
    destinationId: '',
    overview: '',
    durationOptions: DEFAULT_DURATION_OPTIONS,
    maxPassengers: 25,
    availableSeats: 25,
    status: 'active',
    departureDates: [],
    itinerary: [
      { day: 1, title: 'Khởi hành & Nhận phòng', description: 'Tập trung tại điểm hẹn, di chuyển và nhận phòng khách sạn.' },
      { day: 2, title: 'Tham quan thắng cảnh', description: 'Khám phá các điểm đến nổi bật và thưởng thức ẩm thực địa phương.' },
      { day: 3, title: 'Mua sắm & Trở về', description: 'Tự do dạo phố, mua quà đặc sản và trở về điểm xuất phát.' },
    ],
    includes: ['Xe đưa đón đời mới', 'Khách sạn tiêu chuẩn', 'Vé tham quan', 'Bảo hiểm du lịch'],
    excludes: ['Chi phí cá nhân', 'Đồ uống gọi thêm', 'Tiền tip HDV'],
  });

  const [newDateInput, setNewDateInput] = useState('');
  const [newIncludeInput, setNewIncludeInput] = useState('');
  const [newExcludeInput, setNewExcludeInput] = useState('');
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    setFormError(null);
    if (tour) {
      setFormData({
        title: tour.title || '',
        destinationId:
          typeof tour.destinationId === 'object'
            ? tour.destinationId?._id
            : tour.destinationId || '',
        overview: tour.overview || '',
        // Map durationOptions từ backend, fallback về array mặc định nếu chưa có
        durationOptions:
          tour.durationOptions?.length > 0
            ? tour.durationOptions.map((opt) => ({
                days: opt.days,
                nights: opt.nights,
                price: opt.price,
              }))
            : DEFAULT_DURATION_OPTIONS,
        maxPassengers: tour.maxPassengers || 20,
        availableSeats: tour.availableSeats ?? tour.maxPassengers ?? 20,
        status: tour.status || 'active',
        departureDates: (tour.departureDates || []).map((d) =>
          typeof d === 'string' ? d.slice(0, 10) : new Date(d).toISOString().slice(0, 10)
        ),
        itinerary:
          tour.itinerary?.length > 0
            ? tour.itinerary
            : [{ day: 1, title: 'Khởi hành', description: 'Bắt đầu hành trình' }],
        includes: tour.includes || [],
        excludes: tour.excludes || [],
      });
    } else {
      setFormData({
        title: '',
        destinationId: destinations[0]?._id || '',
        overview: '',
        durationOptions: DEFAULT_DURATION_OPTIONS,
        maxPassengers: 25,
        availableSeats: 25,
        status: 'active',
        departureDates: [
          new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
          new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
        ],
        itinerary: [
          { day: 1, title: 'Khởi hành & Nhận phòng', description: 'Tập trung tại điểm hẹn, di chuyển và nhận phòng khách sạn.' },
          { day: 2, title: 'Tham quan thắng cảnh', description: 'Khám phá các điểm đến nổi bật và thưởng thức ẩm thực địa phương.' },
          { day: 3, title: 'Mua sắm & Trở về', description: 'Tự do dạo phố, mua quà đặc sản và trở về điểm xuất phát.' },
        ],
        includes: ['Xe đưa đón đời mới', 'Khách sạn tiêu chuẩn', 'Vé tham quan', 'Bảo hiểm du lịch'],
        excludes: ['Chi phí cá nhân', 'Đồ uống ngoài thực đơn', 'Tiền tip HDV'],
      });
    }
  }, [tour, destinations, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ========== durationOptions handlers ==========
  const handleDurationOptionChange = (idx, field, val) => {
    setFormData((prev) => {
      const opts = [...prev.durationOptions];
      opts[idx] = { ...opts[idx], [field]: field === 'price' ? Number(val) : Number(val) };
      return { ...prev, durationOptions: opts };
    });
  };

  const handleAddDurationOption = () => {
    setFormData((prev) => ({
      ...prev,
      durationOptions: [
        ...prev.durationOptions,
        { days: prev.durationOptions.length + 2, nights: prev.durationOptions.length + 1, price: 0 },
      ],
    }));
  };

  const handleRemoveDurationOption = (idx) => {
    setFormData((prev) => ({
      ...prev,
      durationOptions: prev.durationOptions.filter((_, i) => i !== idx),
    }));
  };

  // ========== Departure dates handlers ==========
  const handleAddDate = () => {
    if (!newDateInput) return;
    if (!formData.departureDates.includes(newDateInput)) {
      setFormData((prev) => ({
        ...prev,
        departureDates: [...prev.departureDates, newDateInput].sort(),
      }));
    }
    setNewDateInput('');
  };

  const handleRemoveDate = (dateToRemove) => {
    setFormData((prev) => ({
      ...prev,
      departureDates: prev.departureDates.filter((d) => d !== dateToRemove),
    }));
  };

  // ========== Itinerary handlers ==========
  const handleItineraryChange = (idx, field, value) => {
    setFormData((prev) => {
      const list = [...prev.itinerary];
      list[idx] = { ...list[idx], [field]: value };
      return { ...prev, itinerary: list };
    });
  };

  const handleAddItineraryDay = () => {
    setFormData((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        {
          day: prev.itinerary.length + 1,
          title: `Ngày ${prev.itinerary.length + 1}: Hoạt động tham quan`,
          description: '',
        },
      ],
    }));
  };

  const handleRemoveItineraryDay = (idx) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary
        .filter((_, i) => i !== idx)
        .map((item, i) => ({ ...item, day: i + 1 })),
    }));
  };

  const maxDurationDays = formData.durationOptions?.length > 0
    ? Math.max(...formData.durationOptions.map((o) => Number(o.days) || 1))
    : 1;

  const handleAutoFillMissingDays = () => {
    setFormData((prev) => {
      const list = [...prev.itinerary];
      while (list.length < maxDurationDays) {
        const nextDay = list.length + 1;
        list.push({
          day: nextDay,
          title: `Ngày ${nextDay}: Tham quan & Trải nghiệm`,
          description: 'Khám phá danh lam thắng cảnh, trải nghiệm văn hóa ẩm thực địa phương và nghỉ ngơi tại khách sạn.',
        });
      }
      return { ...prev, itinerary: list };
    });
  };

  // ========== Includes / Excludes handlers ==========
  const handleAddInclude = () => {
    if (newIncludeInput.trim()) {
      setFormData((prev) => ({ ...prev, includes: [...prev.includes, newIncludeInput.trim()] }));
      setNewIncludeInput('');
    }
  };

  const handleRemoveInclude = (idx) => {
    setFormData((prev) => ({ ...prev, includes: prev.includes.filter((_, i) => i !== idx) }));
  };

  const handleAddExclude = () => {
    if (newExcludeInput.trim()) {
      setFormData((prev) => ({ ...prev, excludes: [...prev.excludes, newExcludeInput.trim()] }));
      setNewExcludeInput('');
    }
  };

  const handleRemoveExclude = (idx) => {
    setFormData((prev) => ({ ...prev, excludes: prev.excludes.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.title.trim()) {
      setFormError('Vui lòng nhập tên / tiêu đề tour du lịch.');
      return;
    }
    if (!formData.destinationId) {
      setFormError('Vui lòng chọn điểm đến liên kết cho tour này.');
      return;
    }
    if (!formData.durationOptions || formData.durationOptions.length === 0) {
      setFormError('Tour phải có ít nhất một gói thời lượng (durationOptions).');
      return;
    }
    for (let i = 0; i < formData.durationOptions.length; i++) {
      const opt = formData.durationOptions[i];
      if (!opt.days || Number(opt.days) < 1) {
        setFormError(`Gói thời lượng thứ ${i + 1}: Số ngày phải lớn hơn hoặc bằng 1.`);
        return;
      }
      if (opt.nights === undefined || Number(opt.nights) < 0) {
        setFormError(`Gói thời lượng thứ ${i + 1}: Số đêm phải lớn hơn hoặc bằng 0.`);
        return;
      }
      if (opt.price === undefined || Number(opt.price) < 0) {
        setFormError(`Gói thời lượng thứ ${i + 1}: Mức giá vé phải lớn hơn hoặc bằng 0.`);
        return;
      }
    }

    const maxP = Math.max(1, Number(formData.maxPassengers) || 20);
    // Theo logic analyst.md: nếu ban đầu chưa có ai đặt tour maxPassengers = availableSeats
    const availSeats = isEdit
      ? Math.min(maxP, Math.max(0, Number(formData.availableSeats ?? maxP)))
      : maxP;

    const sanitizedItinerary = (formData.itinerary || []).map((item, idx) => ({
      day: Number(item.day) || idx + 1,
      title: (item.title || '').trim() || `Ngày ${idx + 1}: Hoạt động tham quan`,
      description: (item.description || '').trim(),
    }));

    onSubmit({
      ...formData,
      title: formData.title.trim(),
      maxPassengers: maxP,
      availableSeats: availSeats,
      itinerary: sanitizedItinerary,
      durationOptions: formData.durationOptions.map((opt) => ({
        days: Number(opt.days),
        nights: Number(opt.nights),
        price: Number(opt.price),
      })),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Chỉnh Sửa Thông Tin Tour Du Lịch' : 'Thêm Mới Tour Du Lịch'}
      size="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {formError && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <span className="material-symbols-outlined text-[18px] shrink-0 text-rose-500">
              error
            </span>
            <span>{formError}</span>
          </div>
        )}

        {/* Section 1: Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tên / Tiêu đề Tour <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ví dụ: Tour Vịnh Hạ Long Du Thuyền 5 Sao 3N2Đ"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Điểm đến liên kết <span className="text-rose-500">*</span>
            </label>
            <select
              name="destinationId"
              value={formData.destinationId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
            >
              <option value="">-- Chọn Điểm Đến --</option>
              {destinations.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name} ({d.region || 'Việt Nam'})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Số chỗ tối đa (Sức chứa)
            </label>
            <input
              type="number"
              name="maxPassengers"
              min={1}
              value={formData.maxPassengers}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              {isEdit
                ? `Chỗ trống hiện tại: ${formData.availableSeats ?? formData.maxPassengers} (tự động tính)`
                : `Chỗ trống ban đầu = ${formData.maxPassengers || 20}`}
            </span>
          </div>

          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Trạng thái bán</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white font-semibold text-primary"
            >
              <option value="active">Đang mở bán</option>
              <option value="inactive">Tạm ngưng</option>
            </select>
          </div>

          <div className="md:col-span-12">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tổng quan tour (Overview)
            </label>
            <textarea
              name="overview"
              rows={3}
              value={formData.overview}
              onChange={handleChange}
              placeholder="Mô tả ngắn gọn về điểm đặc sắc và trải nghiệm nổi bật của tour..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            />
          </div>
        </div>

        {/* Section 2: Duration Options (durationOptions[]) — Đây là thay đổi cốt lõi */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Gói thời lượng & Giá vé (durationOptions)
              <span className="text-rose-500 ml-1">*</span>
            </label>
            <button
              type="button"
              onClick={handleAddDurationOption}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              Thêm gói mới
            </button>
          </div>

          <div className="space-y-3">
            {formData.durationOptions.map((opt, idx) => (
              <div
                key={idx}
                className="grid grid-cols-4 gap-3 p-4 rounded-2xl bg-sky-50/60 border border-sky-100 items-end"
              >
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Số ngày <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={opt.days}
                    onChange={(e) => handleDurationOptionChange(idx, 'days', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Số đêm <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={opt.nights}
                    onChange={(e) => handleDurationOptionChange(idx, 'nights', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Giá (VNĐ/khách) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={100000}
                    value={opt.price}
                    onChange={(e) => handleDurationOptionChange(idx, 'price', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white font-bold text-primary"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-500 font-semibold">
                    {opt.days}N{opt.nights}Đ
                  </div>
                  {formData.durationOptions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDurationOption(idx)}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {formData.durationOptions.length === 0 && (
            <p className="text-xs text-rose-500 font-medium mt-1">
              Tour phải có ít nhất 1 gói thời lượng.
            </p>
          )}
        </div>

        {/* Section 3: Departure Dates Picker */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Danh sách Ngày khởi hành mở bán
          </label>
          <div className="flex items-center gap-2 mb-3">
            <input
              type="date"
              value={newDateInput}
              onChange={(e) => setNewDateInput(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-sm"
            />
            <button
              type="button"
              onClick={handleAddDate}
              className="px-4 py-2 rounded-xl bg-sky-50 text-primary font-bold text-xs hover:bg-primary hover:text-white transition-colors"
            >
              + Thêm ngày
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.departureDates.map((d) => (
              <span
                key={d}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-mono text-xs font-semibold"
              >
                <span className="material-symbols-outlined text-[14px] text-sky-600">event</span>
                <span>{d}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveDate(d)}
                  className="text-slate-400 hover:text-rose-500 ml-1"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Section 4: Itinerary Builder */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Lịch trình tour chi tiết từng ngày ({formData.itinerary.length} ngày)
            </label>
            <button
              type="button"
              onClick={handleAddItineraryDay}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>Thêm ngày mới</span>
            </button>
          </div>

          {maxDurationDays > formData.itinerary.length && (
            <div className="mb-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-amber-600 shrink-0">info</span>
                <span>
                  Gói tour dài nhất bạn vừa thiết lập là <strong>{maxDurationDays} ngày</strong>, nhưng danh sách lịch trình mới có <strong>{formData.itinerary.length} ngày</strong>.
                </span>
              </div>
              <button
                type="button"
                onClick={handleAutoFillMissingDays}
                className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 transition-colors"
              >
                + Bổ sung ngày còn thiếu
              </button>
            </div>
          )}

          <div className="space-y-3">
            {formData.itinerary.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-sky-100 text-primary font-bold text-xs">
                    Ngày {item.day}
                  </span>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleItineraryChange(idx, 'title', e.target.value)}
                    placeholder="Tiêu đề hoạt động chính"
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                  />
                  {formData.itinerary.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItineraryDay(idx)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  )}
                </div>
                <textarea
                  rows={2}
                  value={item.description}
                  onChange={(e) => handleItineraryChange(idx, 'description', e.target.value)}
                  placeholder="Mô tả chi tiết các hoạt động, thời gian biểu, bữa ăn..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white resize-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Includes & Excludes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
              Dịch vụ bao gồm (Includes)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newIncludeInput}
                onChange={(e) => setNewIncludeInput(e.target.value)}
                placeholder="Ví dụ: Bữa sáng buffet"
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
              />
              <button
                type="button"
                onClick={handleAddInclude}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold"
              >
                +
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {formData.includes.map((inc, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs"
                >
                  <span>{inc}</span>
                  <button type="button" onClick={() => handleRemoveInclude(i)}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-rose-700 uppercase tracking-wider mb-2">
              Không bao gồm (Excludes)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newExcludeInput}
                onChange={(e) => setNewExcludeInput(e.target.value)}
                placeholder="Ví dụ: Giặt là cá nhân"
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
              />
              <button
                type="button"
                onClick={handleAddExclude}
                className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold"
              >
                +
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {formData.excludes.map((exc, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 text-xs"
                >
                  <span>{exc}</span>
                  <button type="button" onClick={() => handleRemoveExclude(i)}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-50 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isSubmitting || formData.durationOptions.length === 0}
            className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-500/25 hover:bg-primary-dark transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">
                  progress_activity
                </span>
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">save</span>
                <span>{isEdit ? 'Lưu cập nhật Tour' : 'Tạo Tour Du Lịch'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TourFormModal;
