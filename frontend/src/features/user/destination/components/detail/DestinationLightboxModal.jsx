import React from "react";

export const DestinationLightboxModal = ({
  activePhoto,
  lightboxIndex,
  galleryItems,
  destinationName,
  destinationImage,
  onClose,
  onPrev,
  onNext,
  onSelectIndex,
}) => {
  if (!activePhoto) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 overflow-hidden select-none"
      role="dialog"
      aria-modal="true"
      aria-label="Lightbox xem ảnh"
      onClick={onClose}
    >
      {/* 1. TOP BAR */}
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
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all flex items-center justify-center cursor-pointer border border-white/10 shadow-sm"
          title="Đóng (Esc)"
          aria-label="Đóng lightbox"
        >
          <span className="material-symbols-outlined text-[22px]">close</span>
        </button>
      </div>

      {/* 2. CENTER STAGE */}
      <div
        className="relative flex-1 min-h-0 flex items-center justify-center w-full max-w-6xl mx-auto my-auto px-2 sm:px-12"
        onClick={(e) => e.stopPropagation()}
      >
        {galleryItems.length > 1 && (
          <button
            type="button"
            onClick={onPrev}
            className="absolute left-1 sm:left-2 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-all flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 shadow-xl"
            aria-label="Ảnh trước (←)"
            title="Ảnh trước (←)"
          >
            <span className="material-symbols-outlined text-[24px]">
              chevron_left
            </span>
          </button>
        )}

        <div className="relative max-h-full max-w-full flex items-center justify-center overflow-hidden rounded-2xl shadow-2xl bg-black/40 border border-white/10">
          <img
            src={activePhoto.url}
            alt={activePhoto.alt || activePhoto.caption || destinationName}
            className="max-h-[60vh] sm:max-h-[66vh] max-w-full w-auto h-auto object-contain transition-all duration-300"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = destinationImage;
            }}
          />
        </div>

        {galleryItems.length > 1 && (
          <button
            type="button"
            onClick={onNext}
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

      {/* 3. BOTTOM BAR */}
      <div
        className="w-full max-w-6xl mx-auto z-10 shrink-0 mt-2 sm:mt-3 flex flex-col items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
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

        {galleryItems.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto p-1 max-w-full scrollbar-none">
            {galleryItems.map((photo, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectIndex(idx)}
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
                    e.currentTarget.src = destinationImage;
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationLightboxModal;

