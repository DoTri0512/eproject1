import React, { useState, useEffect } from 'react';
import Modal from '../../../../components/common/Modal';

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
    price: 1500000,
    duration: {
      days: 3,
      nights: 2,
      text: '3 ngày 2 đêm',
    },
    maxPassengers: 20,
    availableSeats: 20,
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

  useEffect(() => {
    if (tour) {
      setFormData({
        title: tour.title || '',
        destinationId:
          typeof tour.destinationId === 'object'
            ? tour.destinationId?._id
            : tour.destinationId || '',
        price: tour.price || 0,
        duration: {
          days: tour.duration?.days || 1,
          nights: tour.duration?.nights || 0,
          text: tour.duration?.text || `${tour.duration?.days || 1} ngày`,
        },
        maxPassengers: tour.maxPassengers || 20,
        availableSeats: tour.availableSeats ?? tour.maxPassengers ?? 20,
        status: tour.status || 'active',
        departureDates: (tour.departureDates || []).map((d) =>
          typeof d === 'string' ? d.slice(0, 10) : new Date(d).toISOString().slice(0, 10)
        ),
        itinerary:
          tour.itinerary && tour.itinerary.length > 0
            ? tour.itinerary
            : [
                { day: 1, title: 'Khởi hành', description: 'Bắt đầu hành trình' },
              ],
        includes: tour.includes || [],
        excludes: tour.excludes || [],
      });
    } else {
      setFormData({
        title: '',
        destinationId: destinations[0]?._id || '',
        price: 2500000,
        duration: {
          days: 3,
          nights: 2,
          text: '3 ngày 2 đêm',
        },
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

  const handleDurationChange = (field, val) => {
    setFormData((prev) => {
      const updated = { ...prev.duration, [field]: val };
      updated.text = `${updated.days} ngày ${updated.nights} đêm`;
      return { ...prev, duration: updated };
    });
  };

  // Departure dates
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

  // Itinerary items
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
      itinerary: prev.itinerary.filter((_, i) => i !== idx).map((item, i) => ({ ...item, day: i + 1 })),
    }));
  };

  // Includes / Excludes
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
    onSubmit({
      ...formData,
      price: Number(formData.price),
      maxPassengers: Number(formData.maxPassengers),
      availableSeats: Number(formData.availableSeats),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Chỉnh Sửa Thông Tin Tour Du Lịch' : 'Thêm Mới Tour Du Lịch'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto px-1 pr-2">
        {/* Section 1: Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tên / Tiêu đề Tour du lịch <span className="text-rose-500">*</span>
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

          <div>
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

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Giá vé niêm yết (VNĐ / khách) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              min={0}
              step={100000}
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        {/* Section 2: Duration & Passengers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Số ngày</label>
            <input
              type="number"
              min={1}
              value={formData.duration.days}
              onChange={(e) => handleDurationChange('days', Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Số đêm</label>
            <input
              type="number"
              min={0}
              value={formData.duration.nights}
              onChange={(e) => handleDurationChange('nights', Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Số chỗ tối đa</label>
            <input
              type="number"
              name="maxPassengers"
              min={1}
              value={formData.maxPassengers}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Trạng thái bán</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white font-semibold text-primary"
            >
              <option value="active">Đang mở bán</option>
              <option value="inactive">Tạm ngưng</option>
            </select>
          </div>
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

        {/* Modal Footer Actions */}
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
            disabled={isSubmitting}
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
