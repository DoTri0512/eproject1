import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GuideCard from '../components/GuideCard';
import useGuides from '../hooks/useGuides';

export const TravelGuides = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('Tất cả');
  const [selectedSpecialisation, setSelectedSpecialisation] = useState('Tất cả');
  const [activeGuideModal, setActiveGuideModal] = useState(null);

  const languages = ['Tất cả', 'Tiếng Việt', 'Tiếng Anh', 'Tiếng Pháp', 'Tiếng Hàn', 'Tiếng Trung'];
  const specialisations = ['Tất cả', 'Di sản', 'Mạo hiểm', 'Bản địa', 'Ẩm thực', 'Nghỉ dưỡng'];

  const { guides, isLoading } = useGuides({
    search: searchTerm,
    language: selectedLanguage,
    specialisation: selectedSpecialisation,
  });

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedLanguage('Tất cả');
    setSelectedSpecialisation('Tất cả');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-20">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        {/* 1. HERO SECTION */}
        <div className="relative rounded-3xl overflow-hidden mb-10 bg-gradient-to-r from-sky-950 via-slate-900 to-sky-900 text-white p-8 sm:p-12 shadow-md">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-sky-300 text-xs font-semibold mb-3">
              <span className="material-symbols-outlined text-[16px]">support_agent</span>
              <span>ĐỘI NGŨ CHUYÊN GIA BẢN ĐỊA</span>
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
              Đội Ngũ Hướng Dẫn Viên Đồng Hành
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl mx-auto">
              Gặp gỡ những người con bản địa giàu kinh nghiệm, nhiệt huyết và am hiểu từng nét văn hóa, con người trên mọi nẻo đường Việt Nam.
            </p>

            {/* Search Input */}
            <div className="relative max-w-xl mx-auto">
              <span className="material-symbols-outlined absolute left-4 top-3.5 text-slate-400 text-[20px]">
                search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo tên hướng dẫn viên hoặc vùng miền phụ trách..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-md"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 2. FILTER BAR */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Language filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Ngôn ngữ:</span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Specialisation filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Chuyên môn:</span>
              <select
                value={selectedSpecialisation}
                onChange={(e) => setSelectedSpecialisation(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {specialisations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3">
            <span className="text-xs font-semibold text-slate-500">
              Có <span className="text-primary font-bold">{guides.length}</span> hướng dẫn viên
            </span>

            {(searchTerm || selectedLanguage !== 'Tất cả' || selectedSpecialisation !== 'Tất cả') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">restart_alt</span>
                <span>Đặt lại</span>
              </button>
            )}
          </div>
        </div>

        {/* 3. GUIDES GRID */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse flex flex-col gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-slate-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                    <div className="h-3 bg-slate-100 rounded w-3/4" />
                  </div>
                </div>
                <div className="h-3 bg-slate-100 rounded w-full" />
                <div className="h-3 bg-slate-100 rounded w-2/3" />
                <div className="h-10 bg-slate-200 rounded-xl w-full mt-2" />
              </div>
            ))}
          </div>
        ) : guides.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center max-w-lg mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[32px]">person_search</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Không tìm thấy hướng dẫn viên phù hợp
            </h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Hãy thử chọn ngôn ngữ hoặc chuyên môn khác để tìm kiếm lại.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors shadow-sm"
            >
              Xem tất cả hướng dẫn viên
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <GuideCard
                key={guide._id || guide.slug}
                guide={guide}
                onSelect={(g) => setActiveGuideModal(g)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 4. GUIDE DETAIL MODAL */}
      {activeGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setActiveGuideModal(null)}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden z-10 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-sky-50 bg-slate-100 shrink-0">
                  <img
                    src={
                      activeGuideModal.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                    }
                    alt={activeGuideModal.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold mb-1">
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span>{activeGuideModal.rating || '4.9'}</span>
                    <span className="text-slate-400 font-normal">({activeGuideModal.reviewCount || 120} đánh giá)</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {activeGuideModal.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-primary">
                    {activeGuideModal.specialisation}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveGuideModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
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
                  {activeGuideModal.background || 'Nhiều năm kinh nghiệm dẫn dắt các đoàn khách trong và ngoài nước.'}
                </p>
              </div>

              {/* Biography */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Tiểu sử & Phong cách dẫn đoàn
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {activeGuideModal.biography || 'Đồng hành với tâm thế cởi mở, thân thiện và đem lại trải nghiệm du lịch đáng nhớ.'}
                </p>
              </div>

              {/* Languages & Destinations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <h5 className="text-xs font-bold text-slate-700 mb-2">Ngôn ngữ giao tiếp</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {activeGuideModal.languages?.map((lang, idx) => (
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
                  <h5 className="text-xs font-bold text-slate-700 mb-2">Điểm đến chuyên trách</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {activeGuideModal.destinations?.map((dest, idx) => {
                      const name = typeof dest === 'object' ? dest.name : dest;
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
                onClick={() => setActiveGuideModal(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveGuideModal(null);
                  navigate('/destinations');
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">travel_explore</span>
                <span>Khám phá Tour cùng hướng dẫn viên</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelGuides;
