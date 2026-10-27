import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { regionsData } from "../constants/regionsData";
import destinationApi from "../../destination/destinationApi";
import tourApi from "../../tour/tourApi";
import DestinationCard from "../../destination/components/DestinationCard";
import TourCard from "../../tour/components/TourCard";

export const RegionExplorer = () => {
  const [activeRegionId, setActiveRegionId] = useState("mien-bac");
  const [regionDestinations, setRegionDestinations] = useState([]);
  const [regionTours, setRegionTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentRegion = useMemo(() => {
    return regionsData.find((r) => r.id === activeRegionId) || regionsData[0];
  }, [activeRegionId]);

  useEffect(() => {
    let isMounted = true;
    const fetchRegionData = async () => {
      setIsLoading(true);
      try {
        const [destRes, tourRes] = await Promise.all([
          destinationApi
            .getAll({ region: currentRegion.name })
            .catch(() => ({ items: [] })),
          tourApi.getAll().catch(() => ({ items: [] })),
        ]);

        if (!isMounted) return;

        const destItems =
          destRes.items || (Array.isArray(destRes) ? destRes : []);
        const tourItems =
          tourRes.items || (Array.isArray(tourRes) ? tourRes : []);

        setRegionDestinations(destItems);

        const destIds = destItems.map((d) => d._id);
        const matchedTours = tourItems.filter(
          (t) =>
            destIds.includes(t.destinationId) ||
            t.region === currentRegion.name,
        );
        setRegionTours(matchedTours);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu vùng miền:", err);
        if (isMounted) {
          setRegionDestinations([]);
          setRegionTours([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchRegionData();
    return () => {
      isMounted = false;
    };
  }, [currentRegion]);

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-[110px] pb-20">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        {/* 1. HERO SECTION */}
        <div className="relative rounded-3xl overflow-hidden mb-8 bg-gradient-to-r from-sky-600 via-sky-500 to-sky-400 text-white p-8 sm:p-12 shadow-md">
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-medium mb-3">
              <span className="material-symbols-outlined text-[14px]">map</span>
              <span className="text-[14px]">ĐỊA LÝ & KHÍ HẬU VIỆT NAM</span>
            </span>
            <h1 className="text-3xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-white">
              Khám Phá Vùng Miền Việt Nam
            </h1>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Mỗi vùng miền mang một sắc thái riêng biệt về cảnh sắc non nước,
              khí hậu và nét văn hóa ẩm thực truyền thống phong phú.
            </p>
          </div>
        </div>

        {/* 2. REGION SELECTOR TABS */}
        <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {regionsData.map((reg) => {
            const isActive = reg.id === activeRegionId;
            return (
              <button
                key={reg.id}
                type="button"
                onClick={() => setActiveRegionId(reg.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap shadow-xs ${
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

        {/* 3. REGION OVERVIEW CARD */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Image Banner */}
            <div className="lg:col-span-5 relative aspect-[16/10] lg:aspect-auto min-h-[280px]">
              <img
                src={currentRegion.image}
                alt={currentRegion.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:hidden" />
              <div className="absolute bottom-4 left-4 right-4 lg:hidden text-white">
                <h3 className="text-xl font-bold">{currentRegion.name}</h3>
                <p className="text-xs text-white/80 line-clamp-1">
                  {currentRegion.tagline}
                </p>
              </div>
            </div>

            {/* Content Details */}
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="hidden lg:block mb-3">
                  <span className="text-xs font-bold text-primary tracking-wider uppercase">
                    ĐẶC TRƯNG ĐỊA LÝ
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                    {currentRegion.name}
                  </h2>
                  <p className="text-sm font-semibold text-slate-500 mt-0.5">
                    {currentRegion.tagline}
                  </p>
                </div>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                  {currentRegion.description}
                </p>

                {/* Highlights & Best Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-sky-900 mb-2">
                      <span className="material-symbols-outlined text-[16px] text-primary">
                        verified
                      </span>
                      <span>Điểm nhấn tiêu biểu</span>
                    </div>
                    <ul className="text-xs text-slate-600 space-y-1">
                      {currentRegion.highlights?.map((h, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2">
                      <span className="material-symbols-outlined text-[16px] text-amber-600">
                        wb_sunny
                      </span>
                      <span>Mùa du lịch đẹp nhất</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {currentRegion.bestTime}
                    </p>
                    <div className="mt-2 text-[11px] text-slate-500 font-medium">
                      Ẩm thực đặc sản:{" "}
                      <span className="text-slate-700">
                        {currentRegion.cuisine}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Counter Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <span>
                    Điểm đến:{" "}
                    <strong className="text-slate-800 text-sm">
                      {regionDestinations.length}
                    </strong>
                  </span>
                  <span>•</span>
                  <span>
                    Tour mở bán:{" "}
                    <strong className="text-primary text-sm">
                      {regionTours.length}
                    </strong>
                  </span>
                </div>

                <Link
                  to={`/destinations?region=${encodeURIComponent(currentRegion.name)}`}
                  className="font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <span>Xem tất cả điểm đến</span>
                  <span className="material-symbols-outlined text-[14px]">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 4. REGION DESTINATIONS GRID */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold text-primary tracking-wider uppercase">
                DANH THẮNG KHÔNG THỂ BỎ LỠ
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Điểm Đến Tiêu Biểu Tại {currentRegion.name}
              </h2>
            </div>
            <Link
              to={`/destinations?region=${encodeURIComponent(currentRegion.name)}`}
              className="text-xs sm:text-sm font-bold text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
            >
              <span>Xem tất cả</span>
              <span className="material-symbols-outlined text-[16px]">
                arrow_forward
              </span>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-2xl h-80 animate-pulse border border-slate-100"
                />
              ))}
            </div>
          ) : regionDestinations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {regionDestinations.map((destination) => (
                <DestinationCard
                  key={destination._id || destination.slug}
                  destination={destination}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-100 text-slate-500">
              <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">
                travel_explore
              </span>
              <p className="text-sm font-medium">
                Chưa có điểm đến nào thuộc vùng này trong hệ thống.
              </p>
            </div>
          )}
        </section>

        {/* 5. REGION TOURS SECTION */}
        {regionTours.length > 0 && (
          <section className="mb-12">
            <div className="mb-6">
              <span className="text-xs font-bold text-primary tracking-wider uppercase">
                CHUYẾN ĐI ĐẶT NHIỀU NHẤT
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Tour Du Lịch Trọn Gói Khám Phá {currentRegion.name}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regionTours.map((tour) => (
                <TourCard key={tour._id || tour.id} tour={tour} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default RegionExplorer;
