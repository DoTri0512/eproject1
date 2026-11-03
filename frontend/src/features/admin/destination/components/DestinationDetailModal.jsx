import React from "react";

const InfoRow = ({ icon, label, value, mono = false }) => (
  <div className="flex items-start gap-3 py-2.5 border-b border-slate-100 last:border-0">
    <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">
      {icon}
    </span>
    <div className="flex-1 min-w-0">
      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
        {label}
      </div>
      <div
        className={`text-sm font-semibold text-slate-800 break-words ${mono ? "font-mono text-xs text-sky-600" : ""}`}
      >
        {value || <span className="text-slate-400 font-normal italic">Chưa cập nhật</span>}
      </div>
    </div>
  </div>
);

const DestinationDetailModal = ({ isOpen, onClose, destination, onEdit, onDelete }) => {
  if (!isOpen || !destination) return null;

  const budgetColor =
    destination.budgetBand === "Cao cấp"
      ? "bg-purple-50 text-purple-700 border border-purple-200"
      : destination.budgetBand === "Tiết kiệm"
        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
        : "bg-amber-50 text-amber-700 border border-amber-200";

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
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">map</span>
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 leading-tight line-clamp-1">
                {destination.name}
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                Chi tiết điểm đến
              </p>
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
        <div className="flex flex-col gap-0 p-6">
          {/* Hero Image */}
          {destination.image && (
            <div className="w-full h-48 rounded-xl overflow-hidden mb-5 bg-slate-100">
              <img
                src={destination.image}
                alt={destination.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Gallery */}
          {destination.gallery?.length > 0 && (
            <div className="mb-5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">photo_library</span>
                <span>Bộ sưu tập ảnh ({destination.gallery.length} ảnh)</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {destination.gallery.slice(0, 6).map((img, i) => (
                  <div
                    key={i}
                    className="w-20 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200"
                  >
                    <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
                {destination.gallery.length > 6 && (
                  <div className="w-20 h-16 rounded-lg shrink-0 bg-slate-100 border border-slate-200 flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-500">+{destination.gallery.length - 6}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Info Grid */}
          <div className="bg-slate-50 rounded-xl p-4 mb-4">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">info</span>
              <span>Thông tin cơ bản</span>
            </div>
            <InfoRow icon="location_on" label="Vị trí / Tỉnh thành" value={destination.location || destination.region} />
            <InfoRow icon="public" label="Vùng miền" value={destination.region} />
            <InfoRow icon="category" label="Chủ đề du lịch" value={destination.theme} />
            <InfoRow icon="schedule" label="Thời gian tham quan" value={destination.visitDuration} />
            <InfoRow icon="wb_sunny" label="Mùa đẹp nhất" value={destination.bestSeason} />
            <div className="flex items-start gap-3 py-2.5">
              <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">payments</span>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Phân khúc ngân sách</div>
                <span className={`inline-block px-2 py-0.5 rounded-md font-semibold text-xs ${budgetColor}`}>
                  {destination.budgetBand || "Phổ thông"}
                </span>
              </div>
            </div>
            {destination.slug && (
              <InfoRow icon="link" label="URL Slug" value={`/destinations/${destination.slug}`} mono />
            )}
          </div>

          {/* Description */}
          {destination.description && (
            <div className="bg-slate-50 rounded-xl p-4 mb-4">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">description</span>
                <span>Mô tả điểm đến</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {destination.description}
              </p>
            </div>
          )}

          {/* Highlights */}
          {destination.highlights?.length > 0 && (
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                <span>Điểm nổi bật</span>
              </div>
              <ul className="flex flex-col gap-1.5">
                {destination.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="material-symbols-outlined text-[14px] text-emerald-500 shrink-0 mt-0.5">check_circle</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
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
                onClick={() => { onClose(); onDelete(destination); }}
                className="h-10 px-4 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white text-sm font-bold inline-flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[17px]">delete</span>
                <span>Xóa</span>
              </button>
            )}
            {onEdit && (
              <button
                type="button"
                onClick={() => { onClose(); onEdit(destination); }}
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

export default DestinationDetailModal;
