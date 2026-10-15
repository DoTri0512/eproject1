import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useFavourites from '../hooks/useFavourites';
import useAuth from '../../../../hooks/useAuth';
import Modal from '../../../../components/common/Modal';

export const FavouritesList = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { favourites, count, isLoading, toggleFavourite, clearAll } = useFavourites();
  const [showClearModal, setShowClearModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRemove = (destination) => {
    toggleFavourite(destination);
    showToast('Đã bỏ địa điểm khỏi danh sách yêu thích');
  };

  const handleConfirmClearAll = () => {
    clearAll();
    setShowClearModal(false);
    showToast('Đã xóa tất cả danh sách yêu thích');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-20">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        {/* Header Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-8 bg-gradient-to-r from-rose-950 via-slate-900 to-sky-950 text-white p-8 sm:p-12 shadow-md">
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-rose-300 text-xs font-semibold mb-3">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                favorite
              </span>
              <span>BỘ SƯU TẬP CỦA BẠN</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3 text-white">
              Danh Sách Điểm Đến Yêu Thích
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
              Nơi lưu trữ những thắng cảnh mà bạn ấp ủ ghé thăm trong những chuyến phiêu lưu sắp tới.
            </p>
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white font-bold text-xs">
              Đã lưu {count} địa điểm
            </div>
          </div>
        </div>

        {/* Guest Sync Alert Banner */}
        {!isAuthenticated && count > 0 && (
          <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">sync</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-900 font-medium">
                Bạn đang duyệt với tư cách Khách. <span className="font-bold">Đăng nhập ngay</span> để tự động đồng bộ danh sách yêu thích này trên mọi thiết bị!
              </p>
            </div>
            <Link
              to="/login"
              className="px-5 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs sm:text-sm hover:bg-amber-700 transition-colors shadow-xs whitespace-nowrap"
            >
              Đăng nhập để đồng bộ
            </Link>
          </div>
        )}

        {/* Bulk Action Header */}
        {count > 0 && (
          <div className="flex items-center justify-between py-3 mb-6 border-b border-slate-200">
            <span className="text-sm font-bold text-slate-700">
              Tổng cộng: <span className="text-primary">{count}</span> địa danh yêu thích
            </span>
            <button
              type="button"
              onClick={() => setShowClearModal(true)}
              className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1 hover:underline"
            >
              <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
              <span>Xóa tất cả</span>
            </button>
          </div>
        )}

        {/* Favourites Grid or Empty State */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm animate-pulse">
                <div className="aspect-[16/9] bg-slate-200 rounded-xl mb-3" />
                <div className="h-5 bg-slate-200 rounded w-2/3 mb-2" />
                <div className="h-4 bg-slate-100 rounded w-full" />
              </div>
            ))}
          </div>
        ) : count === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center max-w-lg mx-auto my-12">
            <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto mb-5">
              <span className="material-symbols-outlined text-[40px]">favorite_border</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-800 mb-2">
              Bạn chưa lưu điểm đến yêu thích nào!
            </h3>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed max-w-sm mx-auto">
              Hãy nhấn biểu tượng trái tim tại các điểm đến du lịch để tạo danh sách mong ước cho hành trình của riêng bạn.
            </p>
            <button
              type="button"
              onClick={() => navigate('/destinations')}
              className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-all shadow-md shadow-sky-500/20 inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">travel_explore</span>
              <span>Khám phá các điểm đến ngay</span>
            </button>
          </div>
        ) : (
          /* Grid of Saved Destinations */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favourites.map((fav) => {
              const dest = fav.destinationId || fav;
              if (!dest) return null;
              const idOrSlug = dest.slug || dest._id;

              return (
                <div
                  key={fav._id || idOrSlug}
                  className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  {/* Top Image */}
                  <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80';
                      }}
                    />

                    {/* Tags */}
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      {dest.region && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 backdrop-blur-md text-primary">
                          {dest.region}
                        </span>
                      )}
                      {dest.theme && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-900/70 text-white">
                          {dest.theme}
                        </span>
                      )}
                    </div>

                    {/* Remove Heart Button */}
                    <button
                      type="button"
                      onClick={() => handleRemove(dest)}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center shadow-sm"
                      title="Bỏ lưu khỏi yêu thích"
                    >
                      <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        favorite
                      </span>
                    </button>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                      <span className="material-symbols-outlined text-[15px]">location_on</span>
                      <span className="truncate">{dest.location}</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1 mb-2">
                      <Link to={`/destinations/${idOrSlug}`}>
                        {dest.name}
                      </Link>
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed flex-1">
                      {dest.overview || 'Thắng cảnh thiên nhiên tuyệt đẹp và văn hóa bản sắc.'}
                    </p>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <Link
                        to={`/destinations/${idOrSlug}`}
                        className="text-xs font-bold text-slate-600 hover:text-primary transition-colors flex items-center gap-1"
                      >
                        <span>Chi tiết</span>
                        <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                      </Link>

                      <Link
                        to={`/destinations/${idOrSlug}#available-tours`}
                        className="px-3.5 py-1.5 rounded-lg bg-sky-50 hover:bg-primary hover:text-white text-primary text-xs font-bold transition-all"
                      >
                        Đặt Tour ngay
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Modal for Clear All */}
      {showClearModal && (
        <Modal
          isOpen={showClearModal}
          onClose={() => setShowClearModal(false)}
          title="Xác nhận xóa danh sách"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600 leading-relaxed">
              Bạn có chắc chắn muốn xóa toàn bộ danh sách điểm đến yêu thích không? Thao tác này không thể hoàn tác.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmClearAll}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs sm:text-sm font-bold hover:bg-rose-700 shadow-sm"
              >
                Xóa tất cả
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom duration-200 text-xs sm:text-sm font-medium">
          <span className="material-symbols-outlined text-rose-400 text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default FavouritesList;
