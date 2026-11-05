import React, { useState, useEffect } from "react";
import useGuides from "../hooks/useGuides";
import GuideList from "../components/GuideList";
import GuideDetailModal from "../components/GuideDetailModal";

const GUIDES_PER_PAGE = 6;

export const GuidePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("Tất cả");
  const [selectedSpecialisation, setSelectedSpecialisation] =
    useState("Tất cả");
  const [activeGuideModal, setActiveGuideModal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const languages = [
    "Tất cả",
    "Tiếng Việt",
    "Tiếng Anh",
    "Tiếng Pháp",
    "Tiếng Hàn",
    "Tiếng Trung",
  ];
  const specialisations = [
    "Tất cả",
    "Di sản",
    "Mạo hiểm",
    "Bản địa",
    "Ẩm thực",
    "Nghỉ dưỡng",
  ];

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedLanguage, selectedSpecialisation]);

  const { guides, pagination, isLoading } = useGuides({
    search: searchTerm,
    language: selectedLanguage,
    specialisation: selectedSpecialisation,
    page: currentPage,
    limit: GUIDES_PER_PAGE,
  });

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedLanguage("Tất cả");
    setSelectedSpecialisation("Tất cả");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-[110px] pb-20">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        {/* 1. HERO SECTION */}
        <div className="relative rounded-3xl overflow-hidden mb-8 bg-gradient-to-r from-sky-600 via-sky-500 to-sky-400 text-white p-8 sm:p-12 shadow-md">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold tracking-wider uppercase mb-5 shadow-sm animate-in fade-in">
              <span className="material-symbols-outlined">support_agent</span>
              <span>ĐỘI NGŨ CHUYÊN GIA BẢN ĐỊA</span>
            </span>
            <h1 className="text-3xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-white">
              Đội Ngũ Hướng Dẫn Viên Đồng Hành
            </h1>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl mx-auto">
              Gặp gỡ những người con bản địa giàu kinh nghiệm, nhiệt huyết và am
              hiểu từng nét văn hóa, con người trên mọi nẻo đường Việt Nam.
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
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    close
                  </span>
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
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                Ngôn ngữ:
              </span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
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
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                Chuyên môn:
              </span>
              <select
                value={selectedSpecialisation}
                onChange={(e) => setSelectedSpecialisation(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
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
              Có{" "}
              <span className="text-primary font-bold">
                {pagination.totalItems ?? guides.length}
              </span>{" "}
              hướng dẫn viên
            </span>

            {(searchTerm ||
              selectedLanguage !== "Tất cả" ||
              selectedSpecialisation !== "Tất cả") && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">
                  restart_alt
                </span>
                <span>Đặt lại</span>
              </button>
            )}
          </div>
        </div>

        {/* 3. GUIDES LIST */}
        <GuideList
          isLoading={isLoading}
          guides={guides}
          pagination={pagination}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onSelectGuide={setActiveGuideModal}
          onResetFilters={handleResetFilters}
        />
      </div>

      {/* 4. GUIDE DETAIL MODAL */}
      {activeGuideModal && (
        <GuideDetailModal
          guide={activeGuideModal}
          isOpen={!!activeGuideModal}
          onClose={() => setActiveGuideModal(null)}
        />
      )}
    </div>
  );
};

export default GuidePage;

