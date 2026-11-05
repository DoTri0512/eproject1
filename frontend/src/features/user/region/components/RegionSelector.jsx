import React from "react";
import { regionsData } from "../constants/regionsData";

export const RegionSelector = ({
  activeRegionId,
  onSelectRegion,
}) => {
  return (
    <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto pb-4 mb-8 scrollbar-none">
      {regionsData.map((reg) => {
        const isActive = reg.id === activeRegionId;
        return (
          <button
            key={reg.id}
            type="button"
            onClick={() => onSelectRegion(reg.id)}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap shadow-xs cursor-pointer ${
              isActive
                ? "bg-primary text-white shadow-md shadow-sky-500/25 scale-105"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {reg.id === "mien-bac"
                ? "terrain"
                : reg.id === "mien-trung"
                ? "castle"
                : reg.id === "tay-nguyen"
                ? "forest"
                : "sailing"}
            </span>
            <span>{reg.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default RegionSelector;

