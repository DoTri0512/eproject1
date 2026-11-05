import React from "react";
import useDestinationDetail from "../hooks/useDestinationDetail";
import DestinationHero from "../components/detail/DestinationHero";
import DestinationQuickStats from "../components/detail/DestinationQuickStats";
import DestinationPackageSelector from "../components/detail/DestinationPackageSelector";
import DestinationContentTabs from "../components/detail/DestinationContentTabs";
import DestinationBookingSidebar from "../components/detail/DestinationBookingSidebar";
import DestinationRelatedSection from "../components/detail/DestinationRelatedSection";
import DestinationLightboxModal from "../components/detail/DestinationLightboxModal";

export const DestinationDetail = () => {
  const {
    destination,
    tours,
    selectedTourIndex,
    selectedDurationIdx,
    setSelectedDurationIdx,
    selectedDate,
    setSelectedDate,
    relatedList,
    isLoading,
    copied,
    activeSection,
    setActiveSection,
    lightboxIndex,
    setLightboxIndex,
    activeTour,
    activeDurationOption,
    activeTourPrice,
    galleryItems,
    activePhoto,
    handleSelectTour,
    handleShare,
    handleProceedToBooking,
    navigate,
  } = useDestinationDetail();

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
          className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-90 transition-opacity cursor-pointer"
        >
          Quay lại danh sách điểm đến
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-[72px] pb-24">
      {/* 1. Hero Banner */}
      <DestinationHero
        destination={destination}
        activeTour={activeTour}
        activeDurationOption={activeDurationOption}
        activeTourPrice={activeTourPrice}
        galleryLength={galleryItems.length}
        copied={copied}
        onShare={handleShare}
        onOpenLightbox={() => setLightboxIndex(0)}
        onProceedBooking={handleProceedToBooking}
      />

      {/* 2. Main Wrapper */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 mt-8">
        {/* Quick Stats Grid */}
        <DestinationQuickStats
          destination={destination}
          activeTour={activeTour}
          activeDurationOption={activeDurationOption}
          activeTourPrice={activeTourPrice}
        />

        {/* Tour Package Selector */}
        <DestinationPackageSelector
          tours={tours}
          destinationName={destination.name}
          selectedTourIndex={selectedTourIndex}
          onSelectTour={handleSelectTour}
        />

        {/* 3. Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols): Content Tabs */}
          <div className="lg:col-span-8">
            <DestinationContentTabs
              destination={destination}
              activeTour={activeTour}
              activeDurationOption={activeDurationOption}
              selectedDurationIdx={selectedDurationIdx}
              onSelectDurationIdx={setSelectedDurationIdx}
              activeSection={activeSection}
              onSelectSection={setActiveSection}
              onOpenLightbox={(idx) => setLightboxIndex(idx)}
            />
          </div>

          {/* Right Column (4 cols): Sticky Booking Card */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            <DestinationBookingSidebar
              activeTour={activeTour}
              destinationName={destination.name}
              activeTourPrice={activeTourPrice}
              selectedDurationIdx={selectedDurationIdx}
              onSelectDurationIdx={setSelectedDurationIdx}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onProceedBooking={handleProceedToBooking}
            />
          </div>
        </div>

        {/* 4. Related Destinations */}
        <DestinationRelatedSection relatedList={relatedList} />
      </div>

      {/* 5. Lightbox Modal */}
      <DestinationLightboxModal
        activePhoto={activePhoto}
        lightboxIndex={lightboxIndex}
        galleryItems={galleryItems}
        destinationName={destination.name}
        destinationImage={destination.image}
        onClose={() => setLightboxIndex(null)}
        onPrev={() =>
          setLightboxIndex(
            (p) => (p - 1 + galleryItems.length) % galleryItems.length
          )
        }
        onNext={() =>
          setLightboxIndex((p) => (p + 1) % galleryItems.length)
        }
        onSelectIndex={(idx) => setLightboxIndex(idx)}
      />
    </div>
  );
};

export default DestinationDetail;
