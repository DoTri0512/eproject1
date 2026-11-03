import React from "react";
import formatCurrency from "../../../../utils/formatCurrency";
import formatDate from "../../../../utils/formatDate";
import Badge from "../../../../components/common/Badge";

const InfoRow = ({ icon, label, children }) => (
  <div className="flex items-start gap-3 py-2.5 border-b border-slate-100 last:border-0">
    <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">
      {icon}
    </span>
    <div className="flex-1 min-w-0">
      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
        {label}
      </div>
      <div className="text-sm font-semibold text-slate-800">
        {children || <span className="text-slate-400 font-normal italic">Chưa cập nhật</span>}
      </div>
    </div>
  </div>
);

const TourDetailModal = ({ isOpen, onClose, tour, onEdit, onDelete }) => {
  if (!isOpen || !tour) return null;

  const dest = tour.destinationId || {};
  const isActive = (tour.status || "active") === "active";
  const available = tour.availableSeats ?? tour.maxPassengers ?? 0;
  const max = tour.maxPassengers || 0;
  const ratio = max > 0 ? Math.min(100, Math.round((available / max) * 100)) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-white px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0">
              <img
                src={
                  dest.image ||
                  "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=200&q=80"
                }
                alt={tour.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 leading-tight line-clamp-1">
                {tour.title}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-primary">location_on</span>
                  {dest.name || "Việt Nam"}
                </span>
                <Badge variant={isActive ? "success" : "neutral"} size="sm">
                  {isActive ? "Đang mở bán" : "Tạm ngưng"}
                </Badge>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 p-6">
          {/* Seats Progress */}
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">event_seat</span>
              <span>Tình trạng chỗ trống</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xl font-black ${available <= 0 ? "text-rose-600" : "text-slate-800"}`}>
                {available}
              </span>
              <span className="text-sm text-slate-400">/ {max} chỗ</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  ratio > 40 ? "bg-emerald-500" : ratio > 15 ? "bg-amber-500" : "bg-rose-500"
                }`}
                style={{ width: `${ratio}%` }}
              />
            </div>
            {available <= 0 && (
              <p className="text-xs font-extrabold text-rose-600 mt-2">⚠ Tour đã hết chỗ</p>
            )}
          </div>

          {/* Duration Options & Pricing */}
          {tour.durationOptions?.length > 0 && (
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                <span>Gói thời gian & Giá vé</span>
              </div>
              <div className="flex flex-col gap-2">
                {tour.durationOptions.map((opt, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-white border border-slate-200"
                  >
                    <span className="text-sm font-bold text-sky-700">
                      {opt.days}N{opt.nights}Đ
                    </span>
                    <span className="text-sm font-black text-primary">
                      {formatCurrency(opt.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Grid */}
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">info</span>
              <span>Thông tin chung</span>
            </div>
            <InfoRow icon="location_on" label="Điểm đến">
              {dest.name || "Việt Nam"}
            </InfoRow>
            <InfoRow icon="group" label="Số khách tối đa">
              {max} người
            </InfoRow>
            {tour.departureDates?.length > 0 && (
              <InfoRow icon="calendar_month" label="Ngày khởi hành">
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {tour.departureDates.map((d, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 font-mono text-[11px] font-semibold"
                    >
                      {formatDate(d)}
                    </span>
                  ))}
                </div>
              </InfoRow>
            )}
          </div>

          {/* Description */}
          {tour.description && (
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">description</span>
                <span>Mô tả tour</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {tour.description}
              </p>
            </div>
          )}

          {/* Itinerary */}
          {tour.itinerary?.length > 0 && (
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">route</span>
                <span>Lịch trình ({tour.itinerary.length} ngày)</span>
              </div>
              <div className="flex flex-col gap-2">
                {tour.itinerary.map((day, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="text-sm font-bold text-slate-800">{day.title || `Ngày ${i + 1}`}</div>
                      {day.description && (
                        <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">{day.description}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition-colors"
          >
            Đóng
          </button>
          <div className="flex items-center gap-2">
            {onDelete && (
              <button
                type="button"
                onClick={() => { onClose(); onDelete(tour); }}
                className="h-10 px-4 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white text-sm font-bold inline-flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[17px]">delete</span>
                <span>Xóa</span>
              </button>
            )}
            {onEdit && (
              <button
                type="button"
                onClick={() => { onClose(); onEdit(tour); }}
                className="h-10 px-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-bold inline-flex items-center gap-1.5 shadow-md shadow-sky-500/20 hover:opacity-95 transition-all"
              >
                <span className="material-symbols-outlined text-[17px]">edit</span>
                <span>Chỉnh sửa</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetailModal;
