import React from "react";
import formatCurrency from "@/utils/formatCurrency";

export const DestinationContentTabs = ({
  destination,
  activeTour,
  activeDurationOption,
  selectedDurationIdx,
  onSelectDurationIdx,
  activeSection,
  onSelectSection,
  onOpenLightbox,
}) => {
  const tabs = [
    { id: "itinerary", label: "Lịch trình chi tiết", icon: "timeline" },
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
  ];

  const filteredItinerary = activeTour?.itinerary
    ? activeDurationOption?.days
      ? activeTour.itinerary.filter((item, idx) => {
          const d = Number(item.day) || idx + 1;
          return d <= Number(activeDurationOption.days);
        })
      : activeTour.itinerary
    : [];

  return (
    <div className="space-y-8">
      {/* SUB-NAV TABS */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-1.5 flex items-center overflow-x-auto scrollbar-none sticky top-20 z-20 backdrop-blur-md bg-white/95">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectSection(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
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

      {/* TAB 1: ITINERARY */}
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
                <span className="text-xs text-slate-400 font-semibold">
                  Gói xem:
                </span>
                {activeTour.durationOptions.map((opt, optIdx) => (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => onSelectDurationIdx(optIdx)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all border cursor-pointer ${
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
                <span className="material-symbols-outlined text-[16px]">
                  info
                </span>
                <span>
                  Lịch trình đang hiển thị cho gói{" "}
                  <strong>
                    {activeDurationOption.days} ngày {activeDurationOption.nights} đêm
                  </strong>{" "}
                  (từ Ngày 1 đến Ngày {activeDurationOption.days})
                </span>
              </div>
              <span className="text-[11px] font-bold text-sky-700 bg-white px-2.5 py-1 rounded-md border border-sky-200 shadow-2xs">
                {activeDurationOption.days}N{activeDurationOption.nights}Đ
              </span>
            </div>
          )}

          {!filteredItinerary.length ? (
            <div className="p-6 rounded-2xl bg-slate-50 text-center text-slate-500 text-sm">
              Lịch trình chi tiết đang được cập nhật. Quý khách vui lòng liên hệ
              nhân viên tư vấn để nhận brochure đầy đủ!
            </div>
          ) : (
            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-sky-200">
              {filteredItinerary.map((dayItem, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white border-2 border-primary text-primary font-bold text-xs flex items-center justify-center shadow-xs group-hover:bg-primary group-hover:text-white transition-colors">
                    {dayItem.day || idx + 1}
                  </div>

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
          )}
        </section>
      )}

      {/* TAB 2: ATTRACTIONS & EXPERIENCES */}
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
              Những địa danh mang tính biểu tượng và trải nghiệm du khách không
              thể bỏ lỡ trong hành trình này.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">
                location_city
              </span>
              <span>Danh Thắng Nổi Bật Tại {destination.name}</span>
            </h3>
            {destination.attractions && destination.attractions.length > 0 ? (
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

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500 text-[20px]">
                hiking
              </span>
              <span>Hoạt Động & Trải Nghiệm Gợi Ý</span>
            </h3>
            {destination.activities && destination.activities.length > 0 ? (
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

      {/* TAB 3: SERVICES (INCLUDED / EXCLUDED) */}
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

      {/* TAB 4: OVERVIEW & CLIMATE & TRANSPORT */}
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
                Mẹo: Khi đăng ký tour trọn gói tại TravelTrail, dịch vụ đưa đón
                khứ hồi đã được bố trí chu đáo suốt hành trình!
              </p>
            </div>
          </div>
        </section>
      )}

      {/* TAB 5: POLICY */}
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
                <li>Quý khách mang theo CCCD / Hộ chiếu còn hạn sử dụng</li>
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

      {/* TAB 6: PHOTO GALLERY */}
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
              Bấm vào ảnh để xem kích thước đầy đủ, dùng phím ← → để điều hướng
              hoặc Esc để đóng.
            </p>
          </div>

          {destination.gallery && destination.gallery.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {destination.gallery.map((photo, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onOpenLightbox(idx)}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 hover:ring-2 hover:ring-primary/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
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
                  <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="material-symbols-outlined text-white text-[32px] drop-shadow-md">
                      zoom_in
                    </span>
                  </div>
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
  );
};

export default DestinationContentTabs;
