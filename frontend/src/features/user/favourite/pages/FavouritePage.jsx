import React, { useState } from "react";
import { Link } from "react-router-dom";
import useFavourites from "../hooks/useFavourites";
import useAuth from "@/hooks/useAuth";
import Modal from "@/components/common/Modal";
import FavouriteList from "../components/FavouriteList";

export const FavouritePage = () => {
  const { isAuthenticated } = useAuth();
  const { favourites, count, isLoading, toggleFavourite, clearAll } =
    useFavourites();
  const [showClearModal, setShowClearModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRemove = (destination) => {
    toggleFavourite(destination);
    showToast("Đã bỏ địa điểm khỏi danh sách yêu thích");
  };

  const handleConfirmClearAll = async () => {
    try {
      await clearAll();
      setShowClearModal(false);
      showToast("Đã xóa tất cả danh sách yêu thích");
    } catch {
      showToast("Có lỗi xảy ra khi xóa danh sách yêu thích");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-[110px] pb-20">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        {/* Header Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-8 bg-gradient-to-r from-sky-600 via-sky-500 to-sky-400 text-white p-8 sm:p-12 shadow-md">
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold tracking-wider uppercase mb-5 shadow-sm animate-in fade-in">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                favorite
              </span>
              <span>BỘ SƯU TẬP CỦA BẠN</span>
            </div>
            <h1 className="text-3xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-3 text-white">
              Danh Sách Điểm Đến Yêu Thích
            </h1>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-4">
              Nơi lưu trữ những thắng cảnh mà bạn ấp ủ ghé thăm trong những
              chuyến phiêu lưu sắp tới.
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
                <span className="material-symbols-outlined text-[20px]">
                  sync
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-900 font-medium">
                Bạn đang duyệt với tư cách Khách.{" "}
                <span className="font-bold">Đăng nhập ngay</span> để tự động
                đồng bộ danh sách yêu thích này trên mọi thiết bị!
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
              Tổng cộng: <span className="text-primary">{count}</span> địa danh
              yêu thích
            </span>
            <button
              type="button"
              onClick={() => setShowClearModal(true)}
              className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                delete_sweep
              </span>
              <span>Xóa tất cả</span>
            </button>
          </div>
        )}

        {/* Favourites List */}
        <FavouriteList
          isLoading={isLoading}
          favourites={favourites}
          count={count}
          onRemove={handleRemove}
        />
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
              Bạn có chắc chắn muốn xóa toàn bộ danh sách điểm đến yêu thích
              không? Thao tác này không thể hoàn tác.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmClearAll}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs sm:text-sm font-bold hover:bg-rose-700 shadow-sm cursor-pointer"
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
          <span className="material-symbols-outlined text-rose-400 text-[18px]">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default FavouritePage;

