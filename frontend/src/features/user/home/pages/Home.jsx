import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import formatCurrency from "../../../../utils/formatCurrency";
import destinationApi from "../../destination/destinationApi";
import useAuth from "../../../../hooks/useAuth";

export const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");

  // Destination & Tour state
  const [featuredDestinations, setFeaturedDestinations] = useState([]);
  const [isLoadingDestinations, setIsLoadingDestinations] = useState(true);
  const [savedFavorites, setSavedFavorites] = useState({});

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        setIsLoadingDestinations(true);
        const res = await destinationApi.getAll({ limit: 4 });
        const items = res.items || (Array.isArray(res) ? res : []);
        if (items.length > 0) {
          setFeaturedDestinations(items);
        } else {
          // Fallback initial data
          setFeaturedDestinations(mockDestinations);
        }
      } catch (err) {
        console.warn(
          "API error or server offline, using curated destinations fallback:",
          err,
        );
        setFeaturedDestinations(mockDestinations);
      } finally {
        setIsLoadingDestinations(false);
      }
    };

    loadDestinations();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append("search", searchQuery.trim());
    if (selectedRegion) params.append("region", selectedRegion);
    if (selectedTheme) params.append("theme", selectedTheme);
    navigate(`/destinations?${params.toString()}`);
  };

  const toggleFavorite = (id) => {
    setSavedFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="flex flex-col w-full bg-[#f8fafc]">
      {/* 1. HERO SECTION */}
      <section className="relative isolate w-full pt-20 pb-28 min-h-[620px] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Background Image */}
        <img
          src="/images/hero-banner.jpg"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "https://lh3.googleusercontent.com/aida-public/AB6AXuCX42j3ijyZV4rAaJVZvkI6Cx5-YdxetACHKTAZWvDDNOc0QPCLhFfp8skDoLsCWWGn3L_VilRuDP_O9jkqq2j0EqI3QxpbK_AOlbK0iKtHnnAGnVMgaeCY3d9YlVE4SYIQEIZ7_VxfrOv2qoU1SXoqbAj3wh23mSoWoWXtDKSZM_lo3oz-5J8pgT4Z30izli5t9hB7MGbPfh4DqYeanWDogQS3cLZ-D19vQIWhw_2UubgjGrD9lyK4";
          }}
          alt="TravelTrail Hero Banner"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center z-0 transition-transform duration-1000 scale-105 pointer-events-none select-none"
        />
        {/* Soft Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-900/30 to-slate-950/55 z-[1] pointer-events-none" />

        {/* Foreground Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold tracking-wider uppercase mb-5 shadow-sm animate-in fade-in">
            <span className="material-symbols-outlined text-sm text-sky-300">
              verified
            </span>
            <span>CỔNG THÔNG TIN & TOUR DU LỊCH BẢN ĐỊA VIỆT NAM</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-[54px] font-extrabold text-white tracking-tight leading-tight max-w-4xl mb-4 drop-shadow-md">
            Khám Phá Vẻ Đẹp Thế Giới Cùng{" "}
            <span className="text-sky-400">TravelTrail</span>
          </h1>
          <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-2xl font-normal leading-relaxed mb-6 drop-shadow">
            Hành trình đong đầy cảm xúc, kết nối những di sản thiên nhiên hùng
            vĩ cùng chiều sâu văn hóa truyền thống 3 miền đất nước.
          </p>

          {/* 3 Mini Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-white/95 text-xs sm:text-sm font-medium mb-12">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sky-300 text-lg">
                travel_explore
              </span>
              <span>1.200+ Tour Chọn Lọc</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="material-symbols-outlined text-amber-300 text-lg"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span>4.9/5 Đánh Giá Hài Lòng</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sky-300 text-lg">
                support_agent
              </span>
              <span>Hỗ Trợ 24/7 Toàn Quốc</span>
            </div>
          </div>

          {/* QUICK SEARCH BAR */}
          <div className="w-full max-w-[1080px] bg-white/95 backdrop-blur-md p-3.5 sm:p-5 rounded-2xl shadow-modal border border-white/60 text-left">
            <form
              onSubmit={handleSearchSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-center"
            >
              {/* Input Keyword */}
              <div className="lg:col-span-5 flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">
                  Điểm đến / Từ khóa
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-slate-400 text-[20px]">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Bạn muốn đi đâu? (Hạ Long, Đà Nẵng, Phú Quốc...)"
                    className="w-full h-11 pl-10 pr-3 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-primary focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Region Dropdown */}
              <div className="lg:col-span-3 flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">
                  Vùng miền
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-slate-400 text-[20px]">
                    map
                  </span>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full h-11 pl-10 pr-8 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:bg-white focus:border-primary focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Tất cả vùng miền</option>
                    <option value="Miền Bắc">Miền Bắc</option>
                    <option value="Miền Trung">Miền Trung</option>
                    <option value="Miền Nam">Miền Nam</option>
                    <option value="Tây Nguyên">Tây Nguyên</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 text-slate-400 pointer-events-none text-[18px]">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Theme Dropdown */}
              <div className="lg:col-span-2 flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">
                  Chủ đề
                </label>
                <div className="relative flex items-center">
                  <select
                    value={selectedTheme}
                    onChange={(e) => setSelectedTheme(e.target.value)}
                    className="w-full h-11 px-3 pr-8 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:bg-white focus:border-primary focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Tất cả chủ đề</option>
                    <option value="Biển đảo">Biển đảo</option>
                    <option value="Núi rừng">Núi rừng</option>
                    <option value="Di sản">Di sản</option>
                    <option value="Nghỉ dưỡng">Nghỉ dưỡng</option>
                    <option value="Văn hóa">Văn hóa</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 text-slate-400 pointer-events-none text-[18px]">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="lg:col-span-2 flex flex-col justify-end pt-1 sm:pt-0">
                <label className="hidden lg:block text-[11px] invisible">
                  Tìm
                </label>
                <button
                  type="submit"
                  className="w-full h-11 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-95 shadow-md shadow-sky-500/25 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    travel_explore
                  </span>
                  <span>Tìm kiếm</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 2. FEATURED DESTINATIONS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-[1360px] mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-base">
                explore
              </span>
              <span>Điểm Đến Hấp Dẫn</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Điểm Đến Nổi Bật Được Yêu Thích
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              Khám phá những vùng đất tuyệt mỹ, từ vịnh biển ngọc ngà đến núi
              cao mây phủ tại Việt Nam
            </p>
          </div>
          <Link
            to="/destinations"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-dark transition-colors self-start md:self-auto"
          >
            <span>Xem tất cả điểm đến</span>
            <span className="material-symbols-outlined text-base">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoadingDestinations
            ? // Skeleton loader
              [1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-96 rounded-2xl bg-slate-200 animate-pulse"
                />
              ))
            : featuredDestinations.map((dest) => (
                <div
                  key={dest._id || dest.slug}
                  className="group relative flex flex-col rounded-2xl bg-white border border-slate-100 shadow-soft hover:shadow-hover hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
                >
                  {/* Image & Badges */}
                  <div className="relative h-56 overflow-hidden bg-slate-100">
                    <img
                      src={
                        dest.image ||
                        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
                      }
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-bold shadow-xs">
                        {dest.region}
                      </span>
                      {dest.theme && (
                        <span className="px-2.5 py-0.5 rounded-full bg-sky-500 text-white text-[11px] font-bold shadow-xs">
                          {dest.theme}
                        </span>
                      )}
                    </div>

                    {/* Favorite Toggle Button */}
                    <button
                      type="button"
                      onClick={() => toggleFavorite(dest._id || dest.slug)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 hover:bg-white backdrop-blur-md flex items-center justify-center text-slate-600 transition-colors shadow-xs"
                      aria-label="Lưu yêu thích"
                    >
                      <span
                        className={`material-symbols-outlined text-[18px] ${
                          savedFavorites[dest._id || dest.slug]
                            ? "text-rose-500 fill-1"
                            : "hover:text-rose-500"
                        }`}
                        style={{
                          fontVariationSettings: savedFavorites[
                            dest._id || dest.slug
                          ]
                            ? "'FILL' 1"
                            : "'FILL' 0",
                        }}
                      >
                        favorite
                      </span>
                    </button>

                    {/* Bottom Image Info */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="flex items-center gap-1 text-xs text-sky-200 font-medium">
                        <span className="material-symbols-outlined text-[15px]">
                          location_on
                        </span>
                        <span>{dest.location || dest.region}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                        {dest.name}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {dest.overview ||
                          "Điểm đến du lịch nổi tiếng với cảnh quan thiên nhiên trác tuyệt và văn hóa đậm đà."}
                      </p>
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">
                          {dest.visitDuration || "2 - 3 ngày"}
                        </span>
                      </div>
                      <Link
                        to={`/destinations/${dest.slug || dest._id}`}
                        className="px-3.5 py-1.5 rounded-lg bg-sky-50 text-primary hover:bg-primary hover:text-white text-xs font-bold transition-all"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </section>

      {/* 3. HOT TOURS */}
      <section className="py-16 bg-slate-100/70 border-y border-slate-200/80">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">
                <span className="material-symbols-outlined text-base">
                  local_fire_department
                </span>
                <span>Ưu Đãi Đặc Biệt</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Chuyến Du Lịch Bán Chạy Nhất
              </h2>
              <p className="text-sm text-slate-500 mt-1 max-w-xl">
                Lịch trình được thiết kế công phu, chuẩn 4-5 sao với hướng dẫn
                viên chuyên nghiệp
              </p>
            </div>
            <Link
              to="/destinations"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-dark transition-colors self-start md:self-auto"
            >
              <span>Xem tất cả tour</span>
              <span className="material-symbols-outlined text-base">
                arrow_forward
              </span>
            </Link>
          </div>

          {/* Tours Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockHotTours.map((tour) => (
              <div
                key={tour.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-hover transition-all duration-300 overflow-hidden flex flex-col group"
              >
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-amber-500 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">
                    {tour.tag}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                    {tour.duration}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1 mb-2">
                      {tour.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-slate-400">
                          calendar_month
                        </span>
                        <span>{tour.departure}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span
                          className="material-symbols-outlined text-[16px] text-amber-400"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span className="font-bold text-slate-700">
                          {tour.rating}
                        </span>
                        <span>({tour.reviews})</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block">
                        Giá từ
                      </span>
                      <span className="text-lg font-extrabold text-primary">
                        {formatCurrency(tour.price)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate("/destinations")}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs hover:opacity-95 shadow-sm transition-all"
                    >
                      Đặt Tour ngay
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SEASONAL COLLECTIONS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-[1360px] mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1 text-xs font-bold text-primary uppercase tracking-wider mb-2">
            <span>Chủ Đề & Cảm Hứng</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Bộ Sưu Tập Du Lịch Theo Mùa
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Gợi ý những trải nghiệm độc đáo nhất cho chuyến du hành tiếp theo
            của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockCollections.map((col) => (
            <div
              key={col.title}
              className="group relative h-80 rounded-2xl overflow-hidden shadow-soft hover:shadow-hover transition-all duration-300 cursor-pointer"
              onClick={() => navigate("/collections")}
            >
              <img
                src={col.image}
                alt={col.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />
              <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                <span className="text-xs text-sky-300 font-bold uppercase tracking-wider mb-1">
                  {col.count} Điểm đến
                </span>
                <h3 className="text-xl font-extrabold leading-snug mb-2 group-hover:text-sky-300 transition-colors">
                  {col.title}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2">
                  {col.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. WHY CHOOSE US */}
      <section className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Vì Sao Bạn Nên Chọn TravelTrail?
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Cam kết mang đến chất lượng dịch vụ du lịch hàng đầu và an tâm
              trọn vẹn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 border border-sky-100 shadow-sm">
                <span className="material-symbols-outlined text-[30px]">
                  verified
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Dịch Vụ Chuẩn 5 Sao
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tất cả khách sạn, phương tiện di chuyển và lịch trình đều được
                kiểm định chất lượng nghiêm ngặt.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4 border border-cyan-100 shadow-sm">
                <span className="material-symbols-outlined text-[30px]">
                  badge
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Hướng Dẫn Viên Bản Địa
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Đội ngũ hướng dẫn viên giàu chuyên môn, nhiệt huyết và am hiểu
                sâu sắc văn hóa địa phương.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100 shadow-sm">
                <span className="material-symbols-outlined text-[30px]">
                  lock
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Đặt Chỗ An Toàn
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Bảo mật thông tin khách hàng tuyệt đối, xuất vé điện tử tự động
                và xác nhận tức thì.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 border border-indigo-100 shadow-sm">
                <span className="material-symbols-outlined text-[30px]">
                  headset_mic
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Hỗ Trợ 24/7
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Chuyên viên tư vấn du lịch luôn sẵn sàng giải đáp và đồng hành
                cùng bạn suốt chuyến đi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-[1360px] mx-auto w-full">
        <div className="relative rounded-3xl overflow-hidden shadow-hover p-8 sm:p-14 lg:p-16 flex flex-col items-center text-center text-white">
          <div
            className="absolute inset-0 bg-cover bg-center -z-10"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-primary/80 -z-10" />

          <span className="px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-cyan-300 font-bold text-xs uppercase tracking-wider mb-4 border border-white/30">
            Khởi Đầu Hành Trình Ngay Hôm Nay
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold max-w-2xl tracking-tight leading-tight mb-4">
            Sẵn Sàng Cho Chuyến Phiêu Lưu Kỳ Diệu?
          </h2>
          <p className="text-sm sm:text-base text-slate-200 max-w-xl leading-relaxed mb-8">
            Đăng ký thành viên TravelTrail để nhận voucher giảm 300.000₫ cho đơn
            đặt tour đầu tiên cùng nhiều ưu đãi hấp dẫn.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3.5">
            {!isAuthenticated ? (
              <Link
                to="/register"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-primary to-cyan-500 text-white font-bold text-sm shadow-md hover:opacity-95 transition-all"
              >
                Đăng Ký Tài Khoản Ngay
              </Link>
            ) : null}
            <Link
              to="/destinations"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-sm border border-white/30 transition-all"
            >
              Khám Phá Tất Cả Điểm Đến
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// Mock Fallback Data if DB is starting up
const mockDestinations = [
  {
    _id: "1",
    name: "Vịnh Hạ Long",
    slug: "vinh-ha-long",
    region: "Miền Bắc",
    theme: "Biển đảo",
    location: "Quảng Ninh, Việt Nam",
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    overview:
      "Kỳ quan thiên nhiên thế giới với hàng nghìn đảo đá vôi kỳ vĩ soi bóng mặt nước xanh ngọc bích.",
    visitDuration: "2 - 3 ngày",
  },
  {
    _id: "2",
    name: "Phố Cổ Hội An",
    slug: "pho-co-hoi-an",
    region: "Miền Trung",
    theme: "Di sản",
    location: "Quảng Nam, Việt Nam",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
    overview:
      "Di sản văn hóa thế giới với những ngôi nhà cổ sơn vàng, đèn lồng rực rỡ và dòng sông Hoài thơ mộng.",
    visitDuration: "2 ngày",
  },
  {
    _id: "3",
    name: "Đảo Ngọc Phú Quốc",
    slug: "phu-quoc",
    region: "Miền Nam",
    theme: "Nghỉ dưỡng",
    location: "Kiên Giang, Việt Nam",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    overview:
      "Thiên đường biển đảo nhiệt đới với bờ cát trắng mịn màng, hoàng hôn rực rỡ và hải sản tươi ngon.",
    visitDuration: "3 - 4 ngày",
  },
  {
    _id: "4",
    name: "Sa Pa Mù Sương",
    slug: "sa-pa",
    region: "Miền Bắc",
    theme: "Núi rừng",
    location: "Lào Cai, Việt Nam",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    overview:
      "Thị trấn trong mây với những thửa ruộng bậc thang tuyệt mỹ và đỉnh Fansipan nóc nhà Đông Dương.",
    visitDuration: "3 ngày",
  },
];

const mockHotTours = [
  {
    id: "tour-1",
    title: "Tour Du Thuyền 5 Sao Khám Phá Vịnh Hạ Long",
    duration: "2 ngày 1 đêm",
    departure: "Khởi hành Thứ 6 & CN hàng tuần",
    price: 3250000,
    rating: 4.9,
    reviews: 128,
    tag: "Bán chạy nhất",
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "tour-2",
    title: "Hành Trình Di Sản: Đà Nẵng - Hội An - Bà Nà Hills",
    duration: "3 ngày 2 đêm",
    departure: "Hàng ngày",
    price: 4690000,
    rating: 4.8,
    reviews: 95,
    tag: "Hot Deal",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "tour-3",
    title: "Thiên Đường Nghỉ Dưỡng Phú Quốc 4N3Đ Trọn Gói",
    duration: "4 ngày 3 đêm",
    departure: "Thứ 5 hàng tuần",
    price: 5850000,
    rating: 4.9,
    reviews: 210,
    tag: "Ưu đãi hè",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  },
];

const mockCollections = [
  {
    title: "Weekend Escapes",
    description: "Những chuyến đi trốn cuối tuần ngắn ngày xua tan mệt mỏi.",
    count: 14,
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Heritage Visits",
    description: "Hành trình lần theo dấu ấn di sản văn hóa nghìn năm lịch sử.",
    count: 18,
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Nature Trips",
    description: "Chinh phục non cao, hang động hùng vĩ và biển đảo nguyên sơ.",
    count: 22,
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Seasonal Highlights",
    description: "Thưởng ngoạn mùa hoa nở rộ và những lễ hội văn hóa độc đáo.",
    count: 12,
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
  },
];

export default Home;
