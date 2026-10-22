import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import destinationApi from "../destinationApi";
import tourApi from "../../tour/tourApi";
import FavouriteButton from "../../favourite/components/FavouriteButton";
import formatCurrency from "../../../../utils/formatCurrency";
import formatDate from "../../../../utils/formatDate";

export const DestinationDetail = () => {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();

  const [destination, setDestination] = useState(null);
  const [tours, setTours] = useState([]);
  const [selectedTourIndex, setSelectedTourIndex] = useState(0);
  const [selectedDurationIdx, setSelectedDurationIdx] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [adultsCount, setAdultsCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [relatedList, setRelatedList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState("itinerary");
  const [lightboxIndex, setLightboxIndex] = useState(null); // null = closed

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadDetail = async () => {
      setIsLoading(true);
      try {
        let currentDest = null;
        try {
          const res = await destinationApi.getByIdOrSlug(idOrSlug);
          currentDest = res.data || res;
        } catch (err) {
          console.error("Failed to load destination by ID/slug:", err);
        }

        setDestination(currentDest);

        if (currentDest) {
          // Fetch Tours for this destination
          try {
            const tourRes = await tourApi.getByDestination(currentDest._id);
            const tourItems = Array.isArray(tourRes)
              ? tourRes
              : tourRes.items || [];
            setTours(tourItems);
            if (tourItems.length > 0) {
              setSelectedTourIndex(0);
              if (
                tourItems[0].departureDates &&
                tourItems[0].departureDates.length > 0
              ) {
                setSelectedDate(tourItems[0].departureDates[0]);
              }
            }
          } catch {
            setTours([]);
          }

          // Related destinations
          if (
            currentDest.relatedDestinations &&
            currentDest.relatedDestinations.length > 0
          ) {
            const fullRelated = currentDest.relatedDestinations.map((rel) => {
              if (typeof rel === "object" && rel.name) return rel;
              return { _id: rel, name: "Điểm đến liên quan" };
            });
            setRelatedList(fullRelated);
          } else if (currentDest.region) {
            try {
              const relRes = await destinationApi.getAll({
                region: currentDest.region,
              });
              const relItems =
                relRes.items || (Array.isArray(relRes) ? relRes : []);
              setRelatedList(
                relItems.filter((d) => d._id !== currentDest._id).slice(0, 3),
              );
            } catch {
              setRelatedList([]);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load destination details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDetail();
  }, [idOrSlug]);

  const activeTour = tours[selectedTourIndex] || null;
  const activeDurationOption =
    activeTour?.durationOptions?.[selectedDurationIdx] ||
    activeTour?.durationOptions?.[0] ||
    null;
  const activeTourPrice =
    activeDurationOption?.price ?? (activeTour?.price || 0);

  // Whenever user switches active tour, sync departure date & reset duration option
  const handleSelectTour = (index) => {
    setSelectedTourIndex(index);
    setSelectedDurationIdx(0);
    const tour = tours[index];
    if (tour?.departureDates && tour.departureDates.length > 0) {
      setSelectedDate(tour.departureDates[0]);
    } else {
      setSelectedDate("");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProceedToBooking = () => {
    if (!activeTour) return;
    const tourId = activeTour.slug || activeTour._id || activeTour.id;
    const queryParams = new URLSearchParams();
    if (selectedDate) queryParams.set("date", selectedDate);
    if (selectedDurationIdx > 0) queryParams.set("duration", selectedDurationIdx);
    if (adultsCount > 1) queryParams.set("adults", adultsCount);
    if (childrenCount > 0) queryParams.set("children", childrenCount);
    const url = `/tour-booking/${tourId}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    navigate(url);
  };

  const galleryItems = destination?.gallery || [];
  const activePhoto =
    lightboxIndex !== null ? galleryItems[lightboxIndex] : null;

  // Keyboard navigation for Lightbox (MUST be before any early returns to obey React Rules of Hooks)
  useEffect(() => {
    if (lightboxIndex === null) return;
    const items = destination?.gallery || [];
    if (items.length === 0) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight")
        setLightboxIndex((p) => (p + 1) % items.length);
      if (e.key === "ArrowLeft")
        setLightboxIndex((p) => (p - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, destination]);

  // Calculate estimated subtotal in sticky card
  const estimatedTotal = activeTourPrice
    ? adultsCount * activeTourPrice +
      childrenCount * Math.round(activeTourPrice * 0.75)
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">
            Đang tải toàn bộ thông tin điểm đến & tour...
          </p>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20 flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[32px]">error</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Không tìm thấy điểm đến
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          Điểm đến này có thể đã bị thay đổi hoặc không tồn tại.
        </p>
        <button
          onClick={() => navigate("/destinations")}
          className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-90 transition-opacity"
        >
          Quay lại danh sách điểm đến
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-[72px] pb-24">
      {/* 1. HERO BANNER: KẾT HỢP ĐIỂM ĐẾN VÀ TOUR */}
      <section className="relative w-full min-h-[480px] md:h-[580px] overflow-hidden bg-slate-950 flex flex-col justify-between">
        <img
          src={destination.image}
          alt={destination.name}
          className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.75] scale-105 transform hover:scale-100 transition-transform duration-1000"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1400&q=80";
          }}
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/40" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-[1360px] w-full mx-auto px-4 sm:px-6 pt-6 pb-10 flex flex-col justify-between flex-1">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-white/80 backdrop-blur-md bg-black/30 w-fit px-3.5 py-1.5 rounded-full border border-white/10 mb-6">
            <Link to="/" className="hover:text-white transition-colors">
              Trang chủ
            </Link>
            <span className="text-white/40">/</span>
            <Link
              to="/destinations"
              className="hover:text-white transition-colors"
            >
              Điểm đến
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-sky-300 font-semibold truncate max-w-[200px]">
              {destination.name}
            </span>
          </nav>

          {/* Title & Badges & Action CTA */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mt-auto">
            <div className="max-w-3xl">
              {/* Badges Combination */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-primary text-white shadow-xs">
                  {destination.region}
                </span>
                {destination.theme && (
                  <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/30">
                    {destination.theme}
                  </span>
                )}
                {destination.bestSeason && (
                  <span className="px-3.5 py-1 rounded-full text-xs font-medium bg-emerald-500/80 backdrop-blur-md text-white flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">
                      sunny
                    </span>
                    <span>Mùa đẹp: {destination.bestSeason}</span>
                  </span>
                )}
                {activeTour && (
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white flex items-center gap-1 shadow-xs">
                    <span className="material-symbols-outlined text-[14px]">
                      schedule
                    </span>
                    <span>
                      {activeDurationOption
                        ? `${activeDurationOption.days}N${activeDurationOption.nights}Đ`
                        : (activeTour.duration?.text || destination.visitDuration || "Trọn gói")}
                    </span>
                  </span>
                )}
                {activeTour && (
                  <span
                    className={`px-3.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-xs ${
                      activeTour.availableSeats !== undefined && activeTour.availableSeats <= 0
                        ? "bg-rose-600 text-white"
                        : "bg-sky-500/90 text-white backdrop-blur-md border border-white/20"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {activeTour.availableSeats !== undefined && activeTour.availableSeats <= 0
                        ? "event_busy"
                        : "airline_seat_recline_normal"}
                    </span>
                    <span>
                      {activeTour.availableSeats !== undefined && activeTour.availableSeats <= 0
                        ? "Hết chỗ"
                        : `Còn ${activeTour.availableSeats ?? activeTour.maxPassengers ?? 20}/${activeTour.maxPassengers || 20} chỗ`}
                    </span>
                  </span>
                )}
              </div>

              {/* Destination Title */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-md mb-2">
                {destination.name}
              </h1>

              {/* Tour Subtitle if available */}
              {activeTour && (
                <p className="text-base sm:text-xl text-sky-200 font-semibold mb-3 drop-shadow flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-sky-400">
                    explore
                  </span>
                  <span>{activeTour.title}</span>
                </p>
              )}

              {/* Location Tag */}
              <div className="flex items-center gap-2 text-white/90 text-sm sm:text-base drop-shadow">
                <span className="material-symbols-outlined text-[20px] text-sky-400">
                  location_on
                </span>
                <span>{destination.location}</span>
                {activeTour && (
                  <>
                    <span className="text-white/40">•</span>
                    <span className="text-emerald-300 font-medium">
                      Khởi hành định kỳ
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Hero Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <FavouriteButton
                destination={destination}
                className="w-12 h-12 bg-white/90 text-slate-700 hover:text-rose-500 hover:bg-white shadow-lg text-[24px]"
              />

              <button
                type="button"
                onClick={handleShare}
                className="w-12 h-12 rounded-full bg-white/90 text-slate-700 hover:bg-white hover:text-primary transition-all flex items-center justify-center shadow-lg"
                title="Chia sẻ liên kết"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {copied ? "check" : "share"}
                </span>
              </button>

              {galleryItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => setLightboxIndex(0)}
                  className="h-12 px-4 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/20 transition-all flex items-center gap-2 shadow-lg text-sm font-semibold cursor-pointer"
                  title="Xem toàn bộ album ảnh"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    photo_library
                  </span>
                  <span>Xem {galleryItems.length} ảnh</span>
                </button>
              )}

              {activeTour ? (
                <button
                  type="button"
                  onClick={handleProceedToBooking}
                  disabled={activeTour.availableSeats !== undefined && activeTour.availableSeats <= 0}
                  className={`px-7 py-3.5 rounded-full font-extrabold text-sm sm:text-base transition-all flex items-center gap-2 group ${
                    activeTour.availableSeats !== undefined && activeTour.availableSeats <= 0
                      ? "bg-slate-400 text-white cursor-not-allowed shadow-none"
                      : "bg-gradient-to-r from-primary to-secondary text-white shadow-xl shadow-sky-500/30 hover:opacity-95 cursor-pointer"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
                    {activeTour.availableSeats !== undefined && activeTour.availableSeats <= 0
                      ? "event_busy"
                      : "airplane_ticket"}
                  </span>
                  <span>
                    {activeTour.availableSeats !== undefined && activeTour.availableSeats <= 0
                      ? "Tour Đã Hết Chỗ (Sold Out)"
                      : `Đặt Tour Này Ngay (${activeTourPrice ? formatCurrency(activeTourPrice) : "Liên hệ"})`}
                  </span>
                </button>
              ) : (
                <a
                  href="#contact-section"
                  className="px-6 py-3.5 rounded-full bg-white text-slate-900 font-bold text-sm shadow-lg hover:bg-slate-100 transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    call
                  </span>
                  <span>Liên Hệ Tư Vấn Điểm Đến</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN WRAPPER */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 mt-8">
        {/* QUICK STATS COMBINATION BAR */}
        <div className={`grid grid-cols-2 ${activeTour ? "lg:grid-cols-5" : "lg:grid-cols-4"} gap-4 mb-8`}>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-sky-200 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">
                timelapse
              </span>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">
                Thời lượng hành trình
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-900">
                {activeDurationOption
                  ? `${activeDurationOption.days}N${activeDurationOption.nights}Đ`
                  : (activeTour?.duration?.text || destination.visitDuration || "2 - 3 ngày")}
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-emerald-200 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">
                payments
              </span>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">
                Giá tour trọn gói
              </div>
              <div className="text-sm sm:text-base font-extrabold text-emerald-600">
                {activeTourPrice
                  ? formatCurrency(activeTourPrice)
                  : destination.budgetBand || "Liên hệ"}
              </div>
            </div>
          </div>

          {/* Sức chứa & Chỗ trống khả dụng (availableSeats/maxPassengers) */}
          {activeTour && (
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-sky-200 transition-colors">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  activeTour.availableSeats !== undefined && activeTour.availableSeats <= 0
                    ? "bg-rose-50 text-rose-600"
                    : activeTour.availableSeats !== undefined && activeTour.availableSeats < 5
                    ? "bg-amber-50 text-amber-600"
                    : "bg-sky-50 text-primary"
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">
                  {activeTour.availableSeats !== undefined && activeTour.availableSeats <= 0
                    ? "event_busy"
                    : "airline_seat_recline_normal"}
                </span>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">
                  Chỗ trống / Sức chứa
                </div>
                <div
                  className={`text-sm sm:text-base font-extrabold ${
                    activeTour.availableSeats !== undefined && activeTour.availableSeats <= 0
                      ? "text-rose-600"
                      : "text-slate-900"
                  }`}
                >
                  {activeTour.availableSeats !== undefined
                    ? activeTour.availableSeats
                    : (activeTour.maxPassengers || 20)}
                  {" / "}
                  {activeTour.maxPassengers || 20} chỗ
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-amber-200 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">
                wb_sunny
              </span>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">
                Mùa lý tưởng nhất
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-900">
                {destination.bestSeason || "Quanh năm"}
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-purple-200 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">
                directions_bus
              </span>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">
                Phương tiện di chuyển
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-900 truncate max-w-[150px]">
                {destination.transport
                  ? destination.transport.split("(")[0]
                  : "Máy bay / Ô tô"}
              </div>
            </div>
          </div>
        </div>

        {/* PACKAGE SELECTOR (When destination has multiple tours or single tour package) */}
        {tours.length > 0 && (
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  package_2
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                  {tours.length > 1
                    ? `Chọn Gói Khám Phá ${destination.name} (${tours.length} gói tour)`
                    : `Gói Tour Khám Phá ${destination.name} Được Lựa Chọn Nhiều Nhất`}
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                Giá trọn gói đã bao gồm lưu trú & vé tham quan
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {tours.map((t, idx) => {
                const isSelected = selectedTourIndex === idx;
                return (
                  <button
                    key={t._id || idx}
                    type="button"
                    onClick={() => handleSelectTour(idx)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 relative ${
                      isSelected
                        ? "border-primary bg-sky-50/60 ring-2 ring-primary/20 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-slate-800 line-clamp-1">
                        {t.title}
                      </span>
                      {isSelected && (
                        <span className="material-symbols-outlined text-primary text-[18px] shrink-0">
                          check_circle
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                      <span className="text-slate-500 font-medium">
                        {t.durationOptions?.length > 0
                          ? `${t.durationOptions[0].days}N${t.durationOptions[0].nights}Đ${t.durationOptions.length > 1 ? ` (+${t.durationOptions.length - 1} gói)` : ''}`
                          : (t.duration?.text || `${t.duration?.days || 3} ngày`)}
                      </span>
                      <span className="font-extrabold text-primary">
                        {t.durationOptions?.length > 0
                          ? formatCurrency(Math.min(...t.durationOptions.map((o) => o.price)))
                          : formatCurrency(t.price || 0)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-slate-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">
                          airline_seat_recline_normal
                        </span>
                        Chỗ trống:
                      </span>
                      <span
                        className={`font-bold ${
                          t.availableSeats !== undefined && t.availableSeats <= 0
                            ? "text-rose-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {t.availableSeats !== undefined && t.availableSeats <= 0
                          ? "Hết chỗ"
                          : `${t.availableSeats ?? t.maxPassengers ?? 20}/${t.maxPassengers || 20} chỗ`}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. TWO-COLUMN UNIFIED CONTENT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: FULL COMBINED CONTENT (8 COLS) */}
          <div className="lg:col-span-8 space-y-8">
            {/* SUB-NAV TABS */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-1.5 flex items-center overflow-x-auto scrollbar-none sticky top-20 z-20 backdrop-blur-md bg-white/95">
              {[
                {
                  id: "itinerary",
                  label: "Lịch trình chi tiết",
                  icon: "timeline",
                },
                {
                  id: "attractions",
                  label: "Điểm tham quan & Trải nghiệm",
                  icon: "photo_camera",
                },
                {
                  id: "gallery",
                  label: `Gallery Ảnh (${destination.gallery?.length || 0})`,
                  icon: "photo_library",
                },
                {
                  id: "services",
                  label: "Dịch vụ bao gồm & Không gồm",
                  icon: "checklist",
                },
                {
                  id: "overview",
                  label: "Thông tin điểm đến & Khí hậu",
                  icon: "info",
                },
                { id: "policy", label: "Chính sách & Lưu ý", icon: "policy" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSection(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    activeSection === tab.id
                      ? "bg-primary text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* TAB 1: LỊCH TRÌNH CHI TIẾT TỪNG NGÀY (ITINERARY TIMELINE) */}
            {(activeSection === "itinerary" || activeSection === "all") && (
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 mb-6 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-primary tracking-wider uppercase">
                      HÀNH TRÌNH TỪNG NGÀY
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      Lịch Trình Chi Tiết Tại {destination.name}
                    </h2>
                  </div>
                  {activeTour?.durationOptions?.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className="text-xs text-slate-400 font-semibold">Gói xem:</span>
                      {activeTour.durationOptions.map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => setSelectedDurationIdx(optIdx)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                            selectedDurationIdx === optIdx
                              ? "bg-primary text-white border-primary shadow-xs"
                              : "bg-sky-50 text-sky-700 border-sky-100 hover:border-primary/40"
                          }`}
                        >
                          {opt.days}N{opt.nights}Đ – {formatCurrency(opt.price)}
                        </button>
                      ))}
                    </div>
                  ) : activeTour?.duration?.text ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-primary border border-sky-100 w-fit">
                      Tổng thời lượng: {activeTour.duration.text}
                    </span>
                  ) : null}
                </div>

                {activeDurationOption && (
                  <div className="mb-6 p-3 rounded-xl bg-sky-50 border border-sky-100 text-xs text-primary font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">info</span>
                      <span>
                        Lịch trình đang hiển thị cho gói <strong>{activeDurationOption.days} ngày {activeDurationOption.nights} đêm</strong> (từ Ngày 1 đến Ngày {activeDurationOption.days})
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-sky-700 bg-white px-2.5 py-1 rounded-md border border-sky-200 shadow-2xs">
                      {activeDurationOption.days}N{activeDurationOption.nights}Đ
                    </span>
                  </div>
                )}

                {(() => {
                  const filteredItinerary = activeTour?.itinerary
                    ? (activeDurationOption?.days
                        ? activeTour.itinerary.filter((item, idx) => {
                            const d = Number(item.day) || idx + 1;
                            return d <= Number(activeDurationOption.days);
                          })
                        : activeTour.itinerary)
                    : [];

                  if (!filteredItinerary.length) {
                    return (
                      <div className="p-6 rounded-2xl bg-slate-50 text-center text-slate-500 text-sm">
                        Lịch trình chi tiết đang được cập nhật. Quý khách vui lòng
                        liên hệ nhân viên tư vấn để nhận brochure đầy đủ!
                      </div>
                    );
                  }

                  return (
                    <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-sky-200">
                      {filteredItinerary.map((dayItem, idx) => (
                        <div key={idx} className="relative group">
                          {/* Timeline Step Dot */}
                          <div className="absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white border-2 border-primary text-primary font-bold text-xs flex items-center justify-center shadow-xs group-hover:bg-primary group-hover:text-white transition-colors">
                            {dayItem.day || idx + 1}
                          </div>

                          {/* Timeline Card */}
                          <div className="bg-slate-50/80 hover:bg-sky-50/40 p-5 rounded-2xl border border-slate-100 transition-all">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-primary text-white">
                                NGÀY {dayItem.day || idx + 1}
                              </span>
                              <h4 className="text-base font-extrabold text-slate-900 group-hover:text-primary transition-colors">
                                {dayItem.title}
                              </h4>
                            </div>

                            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line mt-2">
                              {dayItem.description ||
                                "Khám phá danh thắng địa phương, thưởng thức ẩm thực đặc sắc và nghỉ ngơi tại khách sạn tiêu chuẩn."}
                            </p>

                            {/* Highlights pill tags if day mentions any attraction */}
                            {destination.attractions && (
                              <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-200/60">
                                <span className="text-[11px] text-slate-400 font-medium">
                                  Điểm đến nổi bật trong ngày:
                                </span>
                                {destination.attractions
                                  .slice(idx * 2, idx * 2 + 2)
                                  .map((att, i) => (
                                    <span
                                      key={i}
                                      className="text-[11px] font-semibold text-sky-800 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs"
                                    >
                                      {att}
                                    </span>
                                  ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </section>
            )}

            {/* TAB 2: ĐIỂM THAM QUAN & TRẢI NGHIỆM NỔI BẬT */}
            {(activeSection === "attractions" || activeSection === "all") && (
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
                <div>
                  <span className="text-xs font-bold text-primary tracking-wider uppercase">
                    KHÁM PHÁ DANH THẮNG
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
                    Các Điểm Tham Quan & Hoạt Động Trải Nghiệm
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Những địa danh mang tính biểu tượng và trải nghiệm du khách
                    không thể bỏ lỡ trong hành trình này.
                  </p>
                </div>

                {/* Danh thắng nổi bật */}
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      location_city
                    </span>
                    <span>Danh Thắng Nổi Bật Tại {destination.name}</span>
                  </h3>
                  {destination.attractions &&
                  destination.attractions.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {destination.attractions.map((att, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-sky-200 hover:bg-sky-50/30 transition-all flex items-center gap-3.5"
                        >
                          <div className="w-8 h-8 rounded-full bg-white text-primary font-bold text-xs flex items-center justify-center shadow-xs shrink-0 border border-slate-100">
                            {i + 1}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 text-sm block">
                              {att}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Bao gồm vé vào cổng trong tour
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-xs">
                      Đang cập nhật danh sách các điểm tham quan.
                    </p>
                  )}
                </div>

                {/* Trải nghiệm gợi ý */}
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-500 text-[20px]">
                      hiking
                    </span>
                    <span>Hoạt Động & Trải Nghiệm Gợi Ý</span>
                  </h3>
                  {destination.activities &&
                  destination.activities.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {destination.activities.map((act, i) => (
                        <div
                          key={i}
                          className="p-3.5 rounded-2xl border border-slate-100 bg-white shadow-2xs flex items-center gap-3"
                        >
                          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[20px]">
                              explore
                            </span>
                          </div>
                          <span className="text-xs sm:text-sm font-semibold text-slate-800">
                            {act}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-xs">
                      Đang cập nhật danh sách trải nghiệm gợi ý.
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* TAB 3: DỊCH VỤ BAO GỒM & KHÔNG BAO GỒM */}
            {(activeSection === "services" || activeSection === "all") && (
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
                <div className="pb-5 mb-6 border-b border-slate-100">
                  <span className="text-xs font-bold text-primary tracking-wider uppercase">
                    QUYỀN LỢI CHUYẾN ĐI
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Dịch Vụ Bao Gồm & Không Bao Gồm
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* BAO GỒM */}
                  <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                    <div className="flex items-center gap-2 mb-4 text-emerald-800 font-extrabold text-sm uppercase tracking-wider">
                      <span className="material-symbols-outlined text-emerald-600 text-[22px]">
                        check_circle
                      </span>
                      <span>Dịch vụ bao gồm trong tour</span>
                    </div>

                    <ul className="space-y-3">
                      {(activeTour?.includes && activeTour.includes.length > 0
                        ? activeTour.includes
                        : [
                            "Xe ô tô du lịch đời mới máy lạnh đưa đón theo chương trình",
                            "Khách sạn tiêu chuẩn 3 - 4 sao (2 khách/phòng, lẻ nam/nữ ngủ phòng 3)",
                            "Vé tham quan tất cả các thắng cảnh theo lịch trình",
                            "Các bữa ăn theo tiêu chuẩn ẩm thực địa phương",
                            "Hướng dẫn viên chuyên nghiệp đồng hành suốt chuyến đi",
                            "Bảo hiểm du lịch mức bồi thường tối đa 100.000.000 ₫/vụ",
                            "Nước suối và khăn lạnh phục vụ trên xe hàng ngày",
                          ]
                      ).map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700"
                        >
                          <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0 mt-0.5">
                            check
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* KHÔNG BAO GỒM */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center gap-2 mb-4 text-slate-800 font-extrabold text-sm uppercase tracking-wider">
                      <span className="material-symbols-outlined text-slate-500 text-[22px]">
                        cancel
                      </span>
                      <span>Dịch vụ không bao gồm (Tự túc)</span>
                    </div>

                    <ul className="space-y-3">
                      {(activeTour?.excludes && activeTour.excludes.length > 0
                        ? activeTour.excludes
                        : [
                            "Chi phí cá nhân: giặt là, điện thoại, đồ uống trong minibar",
                            "Chi phí tham quan, vui chơi tự do ngoài lịch trình tour",
                            "Thuế giá trị gia tăng (VAT) nếu quý khách có nhu cầu lấy hóa đơn",
                            "Tiền tip cho hướng dẫn viên và tài xế phục vụ đoàn",
                            "Phụ thu phòng đơn đối với khách đi 1 mình không ghép được phòng",
                          ]
                      ).map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600"
                        >
                          <span className="material-symbols-outlined text-slate-400 text-[18px] shrink-0 mt-0.5">
                            close
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            )}

            {/* TAB 4: THÔNG TIN ĐIỂM ĐẾN & KHÍ HẬU */}
            {(activeSection === "overview" || activeSection === "all") && (
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
                <div>
                  <span className="text-xs font-bold text-primary tracking-wider uppercase">
                    CẨM NANG ĐIỂM ĐẾN
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3">
                    Về {destination.name} & Hướng Dẫn Di Chuyển
                  </h2>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {destination.overview ||
                      "Điểm đến du lịch với cảnh sắc thiên nhiên tuyệt sắc, bề dày lịch sử và nét văn hóa ẩm thực độc đáo."}
                  </p>
                </div>

                {/* Khí hậu */}
                {destination.climate && (
                  <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[22px]">
                        thermostat
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                        Khí hậu & Thời tiết đặc trưng
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {destination.climate}
                      </p>
                    </div>
                  </div>
                )}

                {/* Phương tiện */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-200/60 text-slate-700 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">
                      commute
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                      Kinh nghiệm & Phương tiện di chuyển đến {destination.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-2">
                      {destination.transport ||
                        "Có thể di chuyển bằng máy bay đến sân bay gần nhất hoặc ô tô, xe khách limousine chất lượng cao."}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Mẹo: Khi đăng ký tour trọn gói tại TravelTrail, dịch vụ
                      đưa đón khứ hồi đã được bố trí chu đáo suốt hành trình!
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* TAB 5: CHÍNH SÁCH & LƯU Ý TOUR */}
            {(activeSection === "policy" || activeSection === "all") && (
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
                <div className="pb-4 border-b border-slate-100">
                  <span className="text-xs font-bold text-primary tracking-wider uppercase">
                    QUY ĐỊNH & ĐIỀU KIỆN
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Chính Sách Đặt Tour & Lưu Ý Khi Tham Quan
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-2">
                      <span className="material-symbols-outlined text-emerald-600 text-[18px]">
                        verified
                      </span>
                      <span>Chính sách hoàn hủy</span>
                    </div>
                    <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                      <li>Hủy trước ngày khởi hành 7 ngày: Miễn phí 100%</li>
                      <li>
                        Hủy từ 3 - 6 ngày trước khởi hành: Phí 50% tổng giá trị
                      </li>
                      <li>Hủy trong vòng 48h: Không hoàn tiền</li>
                      <li>Hỗ trợ dời ngày khởi hành 01 lần miễn phí</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-2">
                      <span className="material-symbols-outlined text-sky-600 text-[18px]">
                        badge
                      </span>
                      <span>Giấy tờ tùy thân & Hành lý</span>
                    </div>
                    <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                      <li>
                        Quý khách mang theo CCCD / Hộ chiếu còn hạn sử dụng
                      </li>
                      <li>
                        Trẻ em mang theo bản sao Giấy khai sinh có chứng thực
                      </li>
                      <li>
                        Khuyên dùng giày thể thao êm ái khi đi bộ tham quan
                      </li>
                      <li>
                        Mang theo kem chống nắng, mũ rộng vành và thuốc cá nhân
                      </li>
                    </ul>
                  </div>
                </div>
              </section>
            )}

            {/* TAB GALLERY: LIGHTBOX PHOTO GALLERY */}
            {(activeSection === "gallery" || activeSection === "all") && (
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
                <div className="pb-5 mb-6 border-b border-slate-100">
                  <span className="text-xs font-bold text-primary tracking-wider uppercase">
                    BỘ ẢNH ĐẸP
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Gallery Hình Ảnh {destination.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Bấm vào ảnh để xem kích thước đầy đủ, dùng phím ← → để điều
                    hướng hoặc Esc để đóng.
                  </p>
                </div>

                {destination.gallery && destination.gallery.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {destination.gallery.map((photo, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setLightboxIndex(idx)}
                        className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 hover:ring-2 hover:ring-primary/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                        aria-label={`Xem ảnh: ${photo.alt || photo.caption || destination.name}`}
                      >
                        <img
                          src={photo.url}
                          alt={photo.alt || photo.caption || destination.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = destination.image;
                          }}
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <span className="material-symbols-outlined text-white text-[32px] drop-shadow-md">
                            zoom_in
                          </span>
                        </div>
                        {/* Caption */}
                        {photo.caption && (
                          <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-slate-950/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <p className="text-white text-[11px] font-medium line-clamp-1">
                              {photo.caption}
                            </p>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-10 rounded-2xl bg-slate-50 text-center text-slate-400 text-sm">
                    <span className="material-symbols-outlined text-[40px] block mb-2 text-slate-300">
                      photo_library
                    </span>
                    Bộ ảnh gallery đang được cập nhật. Hẹn gặp lại sớm!
                  </div>
                )}
              </section>
            )}
          </div>

          {/* RIGHT COLUMN: STICKY BOOKING & DEPARTURE ACTION CARD (4 COLS) */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/50">
              {/* Tour Header in Sticky */}
              <div className="pb-4 mb-4 border-b border-slate-100">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-50 text-primary uppercase tracking-wider">
                  GÓI TOUR TRỌN GÓI
                </span>
                <h3 className="font-extrabold text-slate-900 text-lg mt-1 line-clamp-2">
                  {activeTour?.title || `Du lịch ${destination.name}`}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold mt-1">
                  <span>★ 4.9</span>
                  <span className="text-slate-400 font-normal">
                    (128 du khách hài lòng)
                  </span>
                </div>
              </div>

              {/* Duration Options Selector */}
              {activeTour?.durationOptions?.length > 0 && (
                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Chọn Gói Thời Lượng:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {activeTour.durationOptions.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => setSelectedDurationIdx(optIdx)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          selectedDurationIdx === optIdx
                            ? "border-primary bg-sky-50/80 text-primary ring-2 ring-primary/20 font-bold"
                            : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                        }`}
                      >
                        <div className="text-xs font-extrabold">{opt.days}N{opt.nights}Đ</div>
                        <div className="text-[11px] font-bold text-primary">{formatCurrency(opt.price)}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Display */}
              <div className="mb-5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="text-xs text-slate-400 font-medium">
                  {activeTour?.durationOptions?.length > 1 ? "Giá gói đang chọn" : "Giá vé trọn gói từ"}
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-black text-primary">
                    {activeTourPrice
                      ? formatCurrency(activeTourPrice)
                      : "Liên hệ"}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    / khách
                  </span>
                </div>

                {/* Available Seats / Max Passengers Indicator */}
                {activeTour && (
                  <div className="mt-3 pt-3 border-t border-slate-200/60">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-600 font-semibold flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-primary">
                          airline_seat_recline_normal
                        </span>
                        Chỗ trống khả dụng:
                      </span>
                      <span
                        className={`font-black text-xs ${
                          activeTour.availableSeats !== undefined && activeTour.availableSeats <= 0
                            ? "text-rose-600"
                            : "text-slate-900"
                        }`}
                      >
                        {activeTour.availableSeats !== undefined
                          ? activeTour.availableSeats
                          : (activeTour.maxPassengers || 20)}
                        {" / "}
                        {activeTour.maxPassengers || 20} chỗ
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-200/70 rounded-full overflow-hidden mb-1.5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          (activeTour.availableSeats ?? activeTour.maxPassengers ?? 20) <= 0
                            ? "bg-rose-500"
                            : (activeTour.availableSeats ?? activeTour.maxPassengers ?? 20) < 5
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(
                              0,
                              (((activeTour.availableSeats ?? activeTour.maxPassengers ?? 20) /
                                (activeTour.maxPassengers || 20)) *
                                100)
                            )
                          )}%`,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      {activeTour.availableSeats !== undefined && activeTour.availableSeats <= 0 ? (
                        <span className="text-rose-600 font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">event_busy</span>
                          Đã hết chỗ (Sold Out)
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Còn {activeTour.availableSeats ?? activeTour.maxPassengers ?? 20} chỗ sẵn sàng nhận khách
                        </span>
                      )}
                      <span className="text-slate-400">
                        Đã đặt: {Math.max(0, (activeTour.maxPassengers || 20) - (activeTour.availableSeats ?? activeTour.maxPassengers ?? 20))}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Departure Dates Selector */}
              {activeTour?.departureDates &&
                activeTour.departureDates.length > 0 && (
                  <div className="mb-5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Chọn Ngày Khởi Hành:
                    </label>
                    <div className="space-y-2">
                      {activeTour.departureDates.map((dateStr, i) => {
                        const isSelected = selectedDate === dateStr;
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setSelectedDate(dateStr)}
                            className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                              isSelected
                                ? "border-primary bg-sky-50/80 text-primary ring-2 ring-primary/20 font-bold"
                                : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-[18px] text-primary">
                                calendar_today
                              </span>
                              <span className="text-xs sm:text-sm">
                                {formatDate(dateStr)}
                              </span>
                            </div>
                            {isSelected && (
                              <span className="material-symbols-outlined text-primary text-[18px]">
                                check_circle
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

              {/* Main Booking Action */}
              {activeTour ? (
                <button
                  type="button"
                  disabled={activeTour.availableSeats !== undefined && activeTour.availableSeats <= 0}
                  onClick={handleProceedToBooking}
                  className={`w-full py-4 rounded-2xl font-extrabold text-sm sm:text-base transition-all flex items-center justify-center gap-2 mb-3 ${
                    activeTour.availableSeats !== undefined && activeTour.availableSeats <= 0
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
                      : "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-sky-500/30 hover:opacity-95 cursor-pointer"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {activeTour.availableSeats !== undefined && activeTour.availableSeats <= 0
                      ? "event_busy"
                      : "airplane_ticket"}
                  </span>
                  <span>
                    {activeTour.availableSeats !== undefined && activeTour.availableSeats <= 0
                      ? "TOUR ĐÃ HẾT CHỖ (SOLD OUT)"
                      : "TIẾN HÀNH ĐẶT TOUR"}
                  </span>
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-amber-50 text-amber-800 text-xs text-center font-medium mb-3">
                  Điểm đến hiện chưa có tour mở bán định kỳ
                </div>
              )}

              {/* Hotline Support */}
              <a
                href="tel:19006868"
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-primary">
                  call
                </span>
                <span>Hotline tư vấn: 1900 6868 (24/7)</span>
              </a>

              {/* Trust Badges */}
              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="material-symbols-outlined text-emerald-500 text-[16px]">
                    verified_user
                  </span>
                  <span>Bảo hiểm du lịch trọn gói lên tới 100tr</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="material-symbols-outlined text-primary text-[16px]">
                    autorenew
                  </span>
                  <span>Miễn phí đổi ngày khởi hành 01 lần</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="material-symbols-outlined text-amber-500 text-[16px]">
                    support_agent
                  </span>
                  <span>Đội ngũ HDV bản địa nhiệt tình, chu đáo</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. RELATED DESTINATIONS */}
        {relatedList && relatedList.length > 0 && (
          <section className="mt-16 mb-12">
            <div className="mb-6">
              <span className="text-xs font-bold text-primary tracking-wider uppercase">
                GỢI Ý THÊM
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Điểm Đến Cùng Khu Vực Nên Ghé Thăm
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedList.map((rel, idx) => {
                const target = typeof rel === "object" ? rel : null;
                if (!target) return null;
                return (
                  <Link
                    key={target._id || idx}
                    to={`/destinations/${target.slug || target._id}`}
                    className="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-hover hover:-translate-y-1 transition-all"
                  >
                    <div className="aspect-[16/9] w-full bg-slate-100 overflow-hidden relative">
                      <img
                        src={target.image}
                        alt={target.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80";
                        }}
                      />
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-primary">
                        {target.region || "Việt Nam"}
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors text-base line-clamp-1 mb-1">
                        {target.name}
                      </h4>
                      <div className="text-xs text-slate-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                          location_on
                        </span>
                        <span className="truncate">{target.location}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* LIGHTBOX MODAL - CĂN GIỮA CHIỀU CAO TOÀN TRANG */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 overflow-hidden select-none"
          role="dialog"
          aria-modal="true"
          aria-label="Lightbox xem ảnh"
          onClick={() => setLightboxIndex(null)}
        >
          {/* 1. TOP BAR: BỘ ĐẾM & NÚT ĐÓNG */}
          <div
            className="flex items-center justify-between w-full max-w-6xl mx-auto z-10 shrink-0 mb-1 sm:mb-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold tracking-wider flex items-center gap-1.5 border border-white/10 shadow-sm">
                <span className="material-symbols-outlined text-[15px] text-sky-400">
                  photo_library
                </span>
                <span>
                  {lightboxIndex + 1} / {galleryItems.length}
                </span>
              </span>
              <span className="text-xs text-white/50 hidden sm:inline-block">
                Dùng phím ← → hoặc chuột để chuyển ảnh
              </span>
            </div>

            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all flex items-center justify-center cursor-pointer border border-white/10 shadow-sm"
              title="Đóng (Esc)"
              aria-label="Đóng lightbox"
            >
              <span className="material-symbols-outlined text-[22px]">
                close
              </span>
            </button>
          </div>

          {/* 2. CENTER STAGE: HOÀN TOÀN CĂN GIỮA CHIỀU CAO & CHIỀU NGANG */}
          <div
            className="relative flex-1 min-h-0 flex items-center justify-center w-full max-w-6xl mx-auto my-auto px-2 sm:px-12"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Nút lùi ảnh (Prev) */}
            {galleryItems.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex(
                    (p) => (p - 1 + galleryItems.length) % galleryItems.length,
                  )
                }
                className="absolute left-1 sm:left-2 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-all flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 shadow-xl"
                aria-label="Ảnh trước (←)"
                title="Ảnh trước (←)"
              >
                <span className="material-symbols-outlined text-[24px]">
                  chevron_left
                </span>
              </button>
            )}

            {/* Khung ảnh chính */}
            <div className="relative max-h-full max-w-full flex items-center justify-center overflow-hidden rounded-2xl shadow-2xl bg-black/40 border border-white/10">
              <img
                src={activePhoto.url}
                alt={activePhoto.alt || activePhoto.caption || destination.name}
                className="max-h-[60vh] sm:max-h-[66vh] max-w-full w-auto h-auto object-contain transition-all duration-300"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = destination.image;
                }}
              />
            </div>

            {/* Nút tiến ảnh (Next) */}
            {galleryItems.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex((p) => (p + 1) % galleryItems.length)
                }
                className="absolute right-1 sm:right-2 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-all flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 shadow-xl"
                aria-label="Ảnh tiếp theo (→)"
                title="Ảnh tiếp theo (→)"
              >
                <span className="material-symbols-outlined text-[24px]">
                  chevron_right
                </span>
              </button>
            )}
          </div>

          {/* 3. BOTTOM BAR: CAPTION & DANH SÁCH THUMBNAIL */}
          <div
            className="w-full max-w-6xl mx-auto z-10 shrink-0 mt-2 sm:mt-3 flex flex-col items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Caption & Credit */}
            {(activePhoto.caption || activePhoto.credit) && (
              <div className="flex items-center justify-center gap-3 text-center px-4 max-w-2xl">
                {activePhoto.caption && (
                  <p className="text-white/90 text-xs sm:text-sm font-medium line-clamp-1">
                    {activePhoto.caption}
                  </p>
                )}
                {activePhoto.credit && (
                  <span className="text-white/40 text-xs shrink-0">
                    © {activePhoto.credit}
                  </span>
                )}
              </div>
            )}

            {/* Thumbnail Strip */}
            {galleryItems.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto p-1 max-w-full scrollbar-none">
                {galleryItems.map((photo, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setLightboxIndex(idx)}
                    className={`shrink-0 w-13 h-9 sm:w-16 sm:h-11 rounded-lg overflow-hidden transition-all cursor-pointer border ${
                      idx === lightboxIndex
                        ? "border-primary ring-2 ring-primary scale-105 opacity-100"
                        : "border-white/20 opacity-40 hover:opacity-80"
                    }`}
                    aria-label={`Chuyển đến ảnh ${idx + 1}`}
                  >
                    <img
                      src={photo.url}
                      alt={photo.alt || `Ảnh ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = destination.image;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationDetail;
