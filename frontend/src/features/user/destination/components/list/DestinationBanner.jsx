import React from "react";
import DestinationSearch from "../DestinationSearch";

export const DestinationBanner = ({ searchValue, onSearchChange }) => {
  return (
    <div className="relative rounded-3xl overflow-hidden mb-8 bg-gradient-to-r from-sky-600 via-sky-500 to-sky-400 text-white p-8 sm:p-12 shadow-md">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold tracking-wider uppercase mb-5 shadow-sm animate-in fade-in">
          <span className="material-symbols-outlined">travel_explore</span>
          <span>KHÁM PHÁ VIỆT NAM</span>
        </span>
        <h1 className="text-3xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-white">
          Danh Sách Điểm Đến Du Lịch
        </h1>
        <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6 max-w-xl mx-auto">
          Tra cứu thông tin danh thắng, cảnh quan kỳ vĩ và những nét văn hóa
          đặc sắc trên dải đất hình chữ S.
        </p>

        {/* Search Input */}
        <DestinationSearch
          value={searchValue}
          onChange={onSearchChange}
        />
      </div>
    </div>
  );
};

export default DestinationBanner;

