import React from 'react';

export const GuideItem = ({ guide, onSelect }) => {
  if (!guide) return null;

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-hover hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between">
      <div>
        {/* Top Header: Avatar & Info */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden ring-4 ring-sky-50 shrink-0 bg-slate-100">
            <img
              src={
                guide.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
              }
              alt={guide.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
              }}
            />
            {guide.isAvailable && (
              <span
                className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"
                title="Sẵn sàng nhận tour"
              />
            )}
          </div>

          <div className="overflow-hidden">
            <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold mb-0.5">
              <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
              <span>{guide.rating || '4.9'}</span>
              <span className="text-slate-400 font-normal">({guide.reviewCount || 95} đánh giá)</span>
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-primary transition-colors truncate">
              {guide.name}
            </h3>
            <span className="inline-block text-xs font-semibold text-primary">
              {guide.specialisation ? guide.specialisation.split('&')[0] : 'Hướng dẫn viên chuyên nghiệp'}
            </span>
          </div>
        </div>

        {/* Background / Experience */}
        <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed">
          {guide.background || guide.biography || 'Đồng hành thân thiện, am hiểu sâu sắc văn hóa và điểm đến bản địa.'}
        </p>

        {/* Languages */}
        <div className="mb-4">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Ngôn ngữ hỗ trợ
          </div>
          <div className="flex flex-wrap gap-1.5">
            {guide.languages && guide.languages.length > 0 ? (
              guide.languages.map((lang, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-50 text-slate-600 border border-slate-100"
                >
                  {lang}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400">Tiếng Việt</span>
            )}
          </div>
        </div>

        {/* Regions */}
        <div className="mb-4">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Tuyến phụ trách chính
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-600 font-medium">
            <span className="material-symbols-outlined text-[16px] text-sky-500">
              map
            </span>
            <span className="truncate">
              {guide.regions && guide.regions.length > 0
                ? guide.regions.join(' • ')
                : 'Toàn quốc'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="text-xs">
          <span className="text-slate-400">Kinh nghiệm: </span>
          <span className="font-bold text-slate-800">
            {guide.experienceYears ? `${guide.experienceYears} năm` : '5+ năm'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onSelect && onSelect(guide)}
          className="px-4 py-2 rounded-xl bg-sky-50 text-primary hover:bg-primary hover:text-white font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
        >
          <span>Xem hồ sơ</span>
          <span className="material-symbols-outlined text-[14px]">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
};

export default GuideItem;

