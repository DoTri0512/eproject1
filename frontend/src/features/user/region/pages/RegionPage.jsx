import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { regionsData } from "../constants/regionsData";
import destinationApi from "../../destination/destinationApi";
import tourApi from "../../tour/tourApi";
import DestinationItem from "@/features/user/destination/components/DestinationItem";
import TourCard from "../../tour/components/TourCard";
import RegionSelector from "../components/RegionSelector";
import RegionOverviewCard from "../components/RegionOverviewCard";

export const RegionPage = () => {
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
            t.region === currentRegion.name
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
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold tracking-wider uppercase mb-5 shadow-sm animate-in fade-in">
              <span className="material-symbols-outlined">map</span>
              <span>ĐỊA LÝ & KHÍ HẬU VIỆT NAM</span>
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
        <RegionSelector
          activeRegionId={activeRegionId}
          onSelectRegion={setActiveRegionId}
        />

        {/* 3. REGION OVERVIEW CARD */}
        <RegionOverviewCard
          currentRegion={currentRegion}
          destinationsCount={regionDestinations.length}
          toursCount={regionTours.length}
        />

        {/* 4. DESTINATIONS IN THIS REGION */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold text-primary tracking-wider uppercase">
                DANH THẮNG TIÊU BIỂU
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                Điểm Đến Nổi Bật Tại {currentRegion.name}
              </h3>
            </div>
            <Link
              to={`/destinations?region=${encodeURIComponent(currentRegion.name)}`}
              className="text-xs sm:text-sm font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>Xem tất cả ({regionDestinations.length})</span>
              <span className="material-symbols-outlined text-[16px]">
                chevron_right
              </span>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-2xl h-64 animate-pulse border border-slate-100"
                />
              ))}
            </div>
          ) : regionDestinations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {regionDestinations.slice(0, 6).map((dest) => (
                <DestinationItem
                  key={dest._id || dest.slug}
                  destination={dest}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-100 text-slate-400">
              Chưa có dữ liệu điểm đến cho vùng miền này.
            </div>
          )}
        </div>

        {/* 5. TOURS IN THIS REGION */}
        {regionTours.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold text-amber-500 tracking-wider uppercase">
                  HÀNH TRÌNH TRỌN GÓI
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                  Tour Du Lịch Khám Phá {currentRegion.name}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {regionTours.slice(0, 3).map((tour) => (
                <TourCard key={tour._id || tour.id} tour={tour} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegionPage;

