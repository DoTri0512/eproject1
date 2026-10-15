import React from 'react';

export const GuideCard = ({ guide, onSelect }) => {
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
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700"
                >
                  {lang}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400">Tiếng Việt</span>
            )}
          </div>
        </div>

        {/* Destinations */}
        {guide.destinations && guide.destinations.length > 0 && (
          <div className="mb-5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Khu vực chuyên trách
            </div>
            <div className="flex flex-wrap gap-1">
              {guide.destinations.map((dest, idx) => {
                const name = typeof dest === 'object' ? dest.name : dest;
                return (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-50 text-sky-700"
                  >
                    {name}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={() => onSelect(guide)}
          className="w-full py-2.5 rounded-xl border border-sky-200 text-primary hover:bg-primary hover:text-white font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-1.5 shadow-xs"
        >
          <span className="material-symbols-outlined text-[16px]">badge</span>
          <span>Xem hồ sơ chi tiết</span>
        </button>
      </div>
    </div>
  );
};

export default GuideCard;
