import React from "react";
import { Link } from "react-router-dom";
import FavouriteButton from "@/features/user/favourite/components/FavouriteButton";
import formatCurrency from "@/utils/formatCurrency";

export const DestinationHero = ({
  destination,
  activeTour,
  activeDurationOption,
  activeTourPrice,
  galleryLength,
  copied,
  onShare,
  onOpenLightbox,
  onProceedBooking,
}) => {
  return (
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
              className="!w-12 !h-12 shadow-lg"
            />

            <button
              type="button"
              onClick={onShare}
              className="w-12 h-12 rounded-full bg-white/90 text-slate-700 hover:bg-white hover:text-primary transition-all flex items-center justify-center shadow-lg cursor-pointer"
              title="Chia sẻ liên kết"
            >
              <span className="material-symbols-outlined text-[20px]">
                {copied ? "check" : "share"}
              </span>
            </button>

            {galleryLength > 0 && (
              <button
                type="button"
                onClick={onOpenLightbox}
                className="h-12 px-4 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/20 transition-all flex items-center gap-2 shadow-lg text-sm font-semibold cursor-pointer"
                title="Xem toàn bộ album ảnh"
              >
                <span className="material-symbols-outlined text-[20px]">
                  photo_library
                </span>
                <span>Xem {galleryLength} ảnh</span>
              </button>
            )}

            {activeTour ? (
              <button
                type="button"
                onClick={onProceedBooking}
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
  );
};

export default DestinationHero;
