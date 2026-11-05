import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import collectionApi from "../collectionApi";
import DestinationItem from "@/features/user/destination/components/DestinationItem";
import CollectionList from "../components/CollectionList";

export const CollectionPage = () => {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadCollections = async () => {
      setIsLoading(true);
      try {
        const res = await collectionApi.getAll();
        const items = res.items || (Array.isArray(res) ? res : []);
        if (isMounted) {
          setCollections(items);
          if (items.length > 0) {
            setSelectedCollection(items[0]);
          }
        }
      } catch (err) {
        console.error("Error loading collections:", err);
        if (isMounted) {
          setCollections([]);
          setSelectedCollection(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCollections();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-[110px] pb-20">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        {/* 1. HERO SECTION */}
        <div className="relative rounded-3xl overflow-hidden mb-8 bg-gradient-to-r from-sky-600 via-sky-500 to-sky-400 text-white p-8 sm:p-12 shadow-md">
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold tracking-wider uppercase mb-5 shadow-sm animate-in fade-in">
              <span className="material-symbols-outlined">auto_awesome</span>
              <span>Ý TƯỞNG DU LỊCH TRUYỀN CẢM HỨNG</span>
            </span>
            <h1 className="text-3xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-white">
              Bộ Sưu Tập Du Lịch Theo Chủ Đề
            </h1>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Những gợi ý hành trình đặc sắc được tuyển chọn kỹ lưỡng, phù hợp
              với sở thích xê dịch, mùa trong năm và lịch trình nghỉ ngơi của
              bạn.
            </p>
          </div>
        </div>

        {/* 2. COLLECTION LIST */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Khám Phá Các Bộ Sưu Tập Nổi Bật
            </h2>
            <span className="text-xs sm:text-sm font-semibold text-slate-500">
              {collections.length} chủ đề chuyến đi
            </span>
          </div>

          <CollectionList
            isLoading={isLoading}
            collections={collections}
            selectedCollection={selectedCollection}
            onSelectCollection={setSelectedCollection}
          />
        </div>

        {/* 3. SELECTED COLLECTION DESTINATIONS */}
        {selectedCollection && (
          <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 mb-8 border-b border-slate-100 gap-6">
              <div className="max-w-2xl">
                <span className="text-xs font-bold text-primary tracking-wider uppercase">
                  ĐANG XEM BỘ SƯU TẬP
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 mb-3">
                  {selectedCollection.name}
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {selectedCollection.description}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <Link
                  to="/destinations"
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-50 transition-colors"
                >
                  Khám phá thêm
                </Link>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800">
                  Các Điểm Đến Nổi Bật Thuộc Bộ Sưu Tập Này
                </h3>
                <span className="text-xs font-semibold text-slate-500">
                  {selectedCollection.destinations?.length || 0} điểm đến
                </span>
              </div>

              {selectedCollection.destinations &&
              selectedCollection.destinations.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedCollection.destinations.map((dest) => (
                    <DestinationItem
                      key={dest._id || dest.slug}
                      destination={
                        typeof dest === "object"
                          ? dest
                          : { _id: dest, name: "Điểm đến" }
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 text-sm">
                  Đang cập nhật danh sách điểm đến cho bộ sưu tập này.
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CollectionPage;

