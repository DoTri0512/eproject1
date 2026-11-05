import React from "react";
import { useNavigate } from "react-router-dom";

export const GuideDetailModal = ({ guide, isOpen, onClose }) => {
  const navigate = useNavigate();
  if (!isOpen || !guide) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden ring-4 ring-sky-50 shrink-0 bg-slate-100">
              <img
                src={
                  guide.avatar ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                }
                alt={guide.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold mb-0.5">
                <span
                  className="material-symbols-outlined text-[15px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span>{guide.rating || "4.9"}</span>
                <span className="text-slate-400 font-normal">
                  ({guide.reviewCount || 95} đánh giá)
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                {guide.name}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-primary">
                {guide.specialisation}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-6 space-y-6">
          {/* Background */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Quá trình học vấn & Kinh nghiệm
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {guide.background ||
                "Nhiều năm kinh nghiệm dẫn dắt các đoàn khách trong và ngoài nước."}
            </p>
          </div>

          {/* Biography */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Tiểu sử & Phong cách dẫn đoàn
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {guide.biography ||
                "Đồng hành với tâm thế cởi mở, thân thiện và đem lại trải nghiệm du lịch đáng nhớ."}
            </p>
          </div>

          {/* Languages & Destinations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <h5 className="text-xs font-bold text-slate-700 mb-2">
                Ngôn ngữ giao tiếp
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {guide.languages?.map((lang, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white text-slate-700 border border-slate-200"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <h5 className="text-xs font-bold text-slate-700 mb-2">
                Điểm đến chuyên trách
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {guide.destinations?.map((dest, idx) => {
                  const name = typeof dest === "object" ? dest.name : dest;
                  return (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800"
                    >
                      {name}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate("/destinations");
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              travel_explore
            </span>
            <span>Khám phá Tour cùng hướng dẫn viên</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuideDetailModal;

