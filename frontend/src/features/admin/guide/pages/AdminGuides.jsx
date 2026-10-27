import React from 'react';
import useAdminGuides from '../hooks/useAdminGuides';
import GuideFormModal from '../components/GuideFormModal';
import GuideDeleteModal from '../components/GuideDeleteModal';
import GuideDetailModal from '../components/GuideDetailModal';
import Button from '../../../../components/common/Button';
import Badge from '../../../../components/common/Badge';
import LoadingSpinner from '../../../../components/common/LoadingSpinner';
import Pagination from '../../../../components/common/Pagination';

export const AdminGuides = () => {
  const {
    guides,
    allDestinations,
    isLoading,
    isSubmitting,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    limit,
    setLimit,
    searchTerm,
    setSearchTerm,
    languageFilter,
    setLanguageFilter,
    specialisationFilter,
    setSpecialisationFilter,
    selectedGuide,
    isFormModalOpen,
    setIsFormModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isDetailModalOpen,
    setIsDetailModalOpen,
    toastMessage,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDelete,
    handleOpenDetail,
    handleSaveGuide,
    handleDeleteGuide,
    handleAddDestinationsToGuide,
    handleRemoveDestinationFromGuide,
  } = useAdminGuides();

  const specialisations = [
    'Tất cả',
    'Văn hóa & Lịch sử',
    'Khám phá & Trekking',
    'Leo núi & Mạo hiểm',
    'Sinh thái & Thiên nhiên',
    'Nhiếp ảnh & Cảnh quan',
    'Ẩm thực & Đời sống địa phương',
  ];

  const languages = ['Tất cả', 'Tiếng Việt', 'Tiếng Anh', 'Tiếng Pháp', 'Tiếng Trung', 'Tiếng Nhật'];

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-modal border border-slate-200 animate-in fade-in slide-in-from-right duration-200">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              toastMessage.type === 'error'
                ? 'bg-rose-100 text-rose-600'
                : 'bg-emerald-100 text-emerald-600'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {toastMessage.type === 'error' ? 'error' : 'check_circle'}
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
            <span className="material-symbols-outlined text-[16px]">badge</span>
            <span>Quản Lý Nhân Sự • Collection: guides</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Quản Lý Hướng Dẫn Viên
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Xem hồ sơ, tạo mới, phân công điểm đến phụ trách và quản lý đội ngũ hướng dẫn viên du lịch
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="primary"
            onClick={handleOpenCreate}
            className="flex items-center gap-2 shadow-md shadow-sky-500/20"
          >
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            <span>Thêm Hướng Dẫn Viên</span>
          </Button>
        </div>
      </div>

      {/* 2. Filters & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft">
        {/* Search Input */}
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Tìm theo tên, chuyên môn, ngôn ngữ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">
              Chuyên môn:
            </span>
            <select
              value={specialisationFilter}
              onChange={(e) => setSpecialisationFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-primary cursor-pointer"
            >
              {specialisations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">
              Ngôn ngữ:
            </span>
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-primary cursor-pointer"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. Table of Guides */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <LoadingSpinner size="lg" />
            <p className="text-sm font-semibold text-slate-500">
              Đang tải danh sách hướng dẫn viên...
            </p>
          </div>
        ) : guides.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <span className="material-symbols-outlined text-[32px]">person_search</span>
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Không tìm thấy hướng dẫn viên nào
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Thử tìm kiếm với từ khóa khác hoặc nhấn "Thêm Hướng Dẫn Viên" để tạo mới hồ sơ.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-5">Hướng Dẫn Viên</th>
                  <th className="py-3.5 px-4">Lĩnh Vực Chuyên Môn</th>
                  <th className="py-3.5 px-4">Ngôn Ngữ</th>
                  <th className="py-3.5 px-4">Điểm Đến Phụ Trách</th>
                  <th className="py-3.5 px-5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {guides.map((guide) => {
                  const destinationsCount = Array.isArray(guide.destinations)
                    ? guide.destinations.length
                    : 0;

                  return (
                    <tr
                      key={guide._id}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      {/* Name & Avatar */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-primary text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0">
                            {guide.name ? guide.name.charAt(0).toUpperCase() : 'G'}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 block truncate group-hover:text-primary transition-colors">
                              {guide.name}
                            </span>
                            <span className="text-xs text-slate-400 block truncate">
                              /{guide.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Specialisation */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700">
                          <span className="material-symbols-outlined text-[15px] text-primary">
                            star
                          </span>
                          {guide.specialisation || 'Chung'}
                        </span>
                      </td>

                      {/* Languages */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {(guide.languages || ['Tiếng Việt']).map((lang, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-sky-50 text-sky-800 border border-sky-200/60"
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Destinations count & preview */}
                      <td className="py-4 px-4">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(guide)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            location_on
                          </span>
                          <span>{destinationsCount} địa điểm</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Detail / Manage Destinations */}
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(guide)}
                            title="Xem chi tiết & Quản lý điểm đến phụ trách"
                            className="p-2 rounded-lg text-slate-500 hover:text-primary hover:bg-sky-50 transition-all"
                          >
                            <span className="material-symbols-outlined text-[19px]">
                              visibility
                            </span>
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(guide)}
                            title="Chỉnh sửa thông tin"
                            className="p-2 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-all"
                          >
                            <span className="material-symbols-outlined text-[19px]">
                              edit
                            </span>
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(guide)}
                            title="Xóa hướng dẫn viên"
                            className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all"
                          >
                            <span className="material-symbols-outlined text-[19px]">
                              delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Pagination Footer */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          limit={limit}
          onPageChange={setCurrentPage}
          onLimitChange={setLimit}
          showingCount={guides.length}
        />
      </div>

      {/* Modals */}
      <GuideFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        guide={selectedGuide}
        allDestinations={allDestinations}
        onSave={handleSaveGuide}
        isLoading={isSubmitting}
      />

      <GuideDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        guide={selectedGuide}
        onConfirm={handleDeleteGuide}
        isLoading={isSubmitting}
      />

      <GuideDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        guide={selectedGuide}
        allDestinations={allDestinations}
        onAddDestinations={handleAddDestinationsToGuide}
        onRemoveDestination={handleRemoveDestinationFromGuide}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default AdminGuides;
