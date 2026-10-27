import React from "react";
import useAdminDestinations from "../hooks/useAdminDestinations";
import DestinationFormModal from "../components/DestinationFormModal";
import DestinationDeleteModal from "../components/DestinationDeleteModal";
import Badge from "../../../../components/common/Badge";
import Pagination from "../../../../components/common/Pagination";

export const AdminDestinations = () => {
  const {
    destinations,
    isLoading,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    limit,
    setLimit,
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
    selectedDestination,
    isSubmitting,
    toastMessage,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDelete,
    handleSaveDestination,
    handleDeleteDestination,
  } = useAdminDestinations();

  // Region badge styles
  const getRegionBadge = (region) => {
    switch (region) {
      case "Miền Bắc":
        return (
          <Badge variant="primary" size="sm">
            {region}
          </Badge>
        );
      case "Miền Trung":
        return (
          <Badge variant="secondary" size="sm">
            {region}
          </Badge>
        );
      case "Miền Nam":
        return (
          <Badge variant="cyan" size="sm">
            {region}
          </Badge>
        );
      case "Tây Nguyên":
        return (
          <Badge variant="warning" size="sm">
            {region}
          </Badge>
        );
      default:
        return (
          <Badge variant="neutral" size="sm">
            {region}
          </Badge>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-modal border border-slate-200 animate-in fade-in slide-in-from-right duration-200">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">
              check_circle
            </span>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-slate-800">
            {toastMessage.message}
          </span>
        </div>
      )}

      {/* 1. Header Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-[16px]">
              database
            </span>
            <span>MongoDB Atlas • Collection: destinations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Quản Lý Danh Mục Điểm Đến
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Quản lý dữ liệu CRUD các danh thắng, vùng miền và thông tin du lịch
            lưu trữ trên hệ thống
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => alert("Đang xuất tệp Excel danh sách điểm đến...")}
            className="h-11 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              file_download
            </span>
            <span>Xuất Excel</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="h-11 px-5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-sky-500/20 hover:opacity-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">
              add_location_alt
            </span>
            <span>+ Thêm Điểm Đến Mới</span>
          </button>
        </div>
      </div>

      {/* 2. Metric Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[26px]">map</span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Tổng điểm đến
            </span>
            <span className="text-xl font-extrabold text-slate-900">
              {totalItems || destinations.length} Địa danh
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[12px]">
                check
              </span>{" "}
              Đồng bộ MongoDB
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[26px]">
              verified
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Vùng Miền Phủ Sóng
            </span>
            <span className="text-xl font-extrabold text-slate-900">
              {new Set(destinations.map((d) => d.region).filter(Boolean)).size}{" "}
              Miền
            </span>
            <span className="text-[11px] text-slate-500">
              Bắc • Trung • Nam • Tây Nguyên
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[26px]">
              category
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Chủ Đề Du Lịch
            </span>
            <span className="text-xl font-extrabold text-slate-900">
              {new Set(destinations.map((d) => d.theme).filter(Boolean)).size ||
                6}{" "}
              Chủ đề
            </span>
            <span className="text-[11px] text-blue-600 font-semibold">
              Đa dạng trải nghiệm
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[26px]">
              photo_camera
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Kho Ảnh & Gallery
            </span>
            <span className="text-xl font-extrabold text-slate-900">
              {destinations.reduce(
                (acc, d) => acc + (d.gallery?.length || 0) + (d.image ? 1 : 0),
                0,
              )}{" "}
              Media
            </span>
            <span className="text-[11px] text-slate-500">
              Đồng bộ Cloud/CDN
            </span>
          </div>
        </div>
      </div>

      {/* 3. Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search */}
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

        {/* Region Filter */}
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

        {/* Theme Filter */}
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

      {/* 4. Destinations Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold text-[11px] uppercase tracking-wider border-b border-slate-100">
              <tr className="whitespace-nowrap">
                <th className="py-3.5 px-4">Hình Ảnh</th>
                <th className="py-3.5 px-4">Tên Điểm Đến</th>
                <th className="py-3.5 px-4">Vùng Miền</th>
                <th className="py-3.5 px-4">Chủ Đề</th>
                <th className="py-3.5 px-4">Ngân Sách</th>
                <th className="py-3.5 px-4">Thời Lượng & Mùa Đi</th>
                <th className="py-3.5 px-4 text-center">Thao Tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 rounded-full border-2 border-primary border-r-transparent animate-spin" />
                      <span>Đang tải danh sách điểm đến từ MongoDB...</span>
                    </div>
                  </td>
                </tr>
              ) : destinations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    Không tìm thấy điểm đến nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                destinations.map((dest) => (
                  <tr
                    key={dest._id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        <img
                          src={
                            dest.image ||
                            "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=200&q=80"
                          }
                          alt={dest.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </td>

                    {/* Name & Location */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 line-clamp-1">
                        {dest.name}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-[13px]">
                          location_on
                        </span>
                        <span>{dest.location || dest.region}</span>
                      </div>
                      {dest.slug && (
                        <div className="text-[10px] text-sky-600 font-mono mt-0.5">
                          /destinations/{dest.slug}
                        </div>
                      )}
                    </td>

                    {/* Region */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getRegionBadge(dest.region)}
                    </td>

                    {/* Theme */}
                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 ">
                        {dest.theme || "Chung"}
                      </span>
                    </td>

                    {/* Budget Band */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md font-semibold text-xs ${
                          dest.budgetBand === "Cao cấp"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : dest.budgetBand === "Tiết kiệm"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                        } whitespace-nowrap`}
                      >
                        {dest.budgetBand || "Phổ thông"}
                      </span>
                    </td>

                    {/* Visit Duration & Best Season */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-primary">
                          schedule
                        </span>
                        <span>{dest.visitDuration || "2 - 3 ngày"}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Mùa đẹp: {dest.bestSeason || "Quanh năm"}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(dest)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-primary hover:bg-sky-50 transition-colors"
                          title="Chỉnh sửa điểm đến"
                        >
                          <span className="material-symbols-outlined text-[19px]">
                            edit
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(dest)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Xóa điểm đến"
                        >
                          <span className="material-symbols-outlined text-[19px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          limit={limit}
          onPageChange={setCurrentPage}
          onLimitChange={setLimit}
          showingCount={destinations.length}
        />
      </div>

      {/* Modals */}
      <DestinationFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        destination={selectedDestination}
        allDestinations={destinations}
        onSave={handleSaveDestination}
        isLoading={isSubmitting}
      />

      <DestinationDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        destination={selectedDestination}
        onConfirm={handleDeleteDestination}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default AdminDestinations;
