import React from "react";
import useAdminDestinations from "../hooks/useAdminDestinations";
import DestinationFormModal from "../components/DestinationFormModal";
import DestinationDeleteModal from "../components/DestinationDeleteModal";
import DestinationDetailModal from "../components/DestinationDetailModal";
import AdminDestinationList from "../components/AdminDestinationList";

export const AdminDestinationPage = () => {
  const {
    destinations,
    isLoading,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    limit,
    searchTerm,
    setSearchTerm,
    selectedRegion,
    setSelectedRegion,
    selectedTheme,
    setSelectedTheme,
    isFormModalOpen,
    setIsFormModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isDetailModalOpen,
    setIsDetailModalOpen,
    selectedDestination,
    isSubmitting,
    toastMessage,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDelete,
    handleOpenDetail,
    handleSaveDestination,
    handleDeleteDestination,
  } = useAdminDestinations();

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Quản Lý Điểm Đến
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Quản lý danh sách danh thắng, phân loại vùng miền và chủ đề du lịch.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-bold shadow-sm hover:opacity-95 transition-opacity cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Thêm Điểm Đến Mới</span>
        </button>
      </div>

      {/* 2. Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-md hover:border-sky-200 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Tổng Điểm Đến
            </span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[22px]">map</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalItems || destinations.length}
            </span>
            <span className="text-xs font-semibold text-slate-400">Địa danh</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <span className="truncate">Đồng bộ MongoDB</span>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-md hover:border-amber-200 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Vùng Miền Phủ Sóng
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[22px]">travel_explore</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {new Set(destinations.map((d) => d.region).filter(Boolean)).size || 4}
            </span>
            <span className="text-xs font-semibold text-slate-400">Vùng miền</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span className="material-symbols-outlined text-[15px] text-amber-500 shrink-0">public</span>
            <span className="truncate">Bắc • Trung • Nam • Tây Nguyên</span>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-md hover:border-indigo-200 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Chủ Đề Du Lịch
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[22px]">category</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {new Set(destinations.map((d) => d.theme).filter(Boolean)).size || 6}
            </span>
            <span className="text-xs font-semibold text-slate-400">Chủ đề</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-indigo-600">
            <span className="material-symbols-outlined text-[15px] text-indigo-500 shrink-0">auto_awesome</span>
            <span className="truncate">Đa dạng trải nghiệm</span>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-md hover:border-purple-200 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Kho Ảnh & Gallery
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[22px]">photo_library</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {destinations.reduce(
                (acc, d) => acc + (d.gallery?.length || 0) + (d.image ? 1 : 0),
                0,
              )}
            </span>
            <span className="text-xs font-semibold text-slate-400">Tệp media</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span className="material-symbols-outlined text-[15px] text-purple-500 shrink-0">cloud_done</span>
            <span className="truncate">Đồng bộ Cloud / CDN</span>
          </div>
        </div>
      </div>

      {/* 3. Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        <div className="md:col-span-6 lg:col-span-5 relative flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-slate-400 text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm điểm đến theo tên, địa danh hoặc từ khóa..."
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-primary focus:outline-none transition-all"
          />
        </div>

        <div className="md:col-span-3 lg:col-span-3 relative">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-full h-11 px-3.5 pr-8 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-primary focus:outline-none appearance-none cursor-pointer"
          >
            <option value="all">Tất cả vùng miền</option>
            <option value="Miền Bắc">Miền Bắc</option>
            <option value="Miền Trung">Miền Trung</option>
            <option value="Miền Nam">Miền Nam</option>
            <option value="Tây Nguyên">Tây Nguyên</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-3 text-slate-400 pointer-events-none text-[18px]">
            arrow_drop_down
          </span>
        </div>

        <div className="md:col-span-3 lg:col-span-4 relative">
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            className="w-full h-11 px-3.5 pr-8 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-primary focus:outline-none appearance-none cursor-pointer"
          >
            <option value="all">Tất cả chủ đề</option>
            <option value="Biển đảo">Biển đảo</option>
            <option value="Di sản">Di sản</option>
            <option value="Núi rừng">Núi rừng</option>
            <option value="Nghỉ dưỡng">Nghỉ dưỡng</option>
            <option value="Sinh thái">Sinh thái</option>
            <option value="Văn hóa">Văn hóa</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-3 text-slate-400 pointer-events-none text-[18px]">
            arrow_drop_down
          </span>
        </div>
      </div>

      {/* 4. Admin Destination List */}
      <AdminDestinationList
        isLoading={isLoading}
        destinations={destinations}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        limit={limit}
        onPageChange={setCurrentPage}
        onOpenDetail={handleOpenDetail}
        onOpenEdit={handleOpenEdit}
        onOpenDelete={handleOpenDelete}
      />

      {/* 5. Modals */}
      {isFormModalOpen && (
        <DestinationFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSave={handleSaveDestination}
          destination={selectedDestination}
          isSubmitting={isSubmitting}
        />
      )}

      {isDeleteModalOpen && (
        <DestinationDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteDestination}
          destination={selectedDestination}
          isSubmitting={isSubmitting}
        />
      )}

      {isDetailModalOpen && (
        <DestinationDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          destination={selectedDestination}
          onEdit={() => {
            setIsDetailModalOpen(false);
            handleOpenEdit(selectedDestination);
          }}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom duration-200 text-xs sm:text-sm font-medium">
          <span className="material-symbols-outlined text-emerald-400 text-[18px]">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default AdminDestinationPage;

