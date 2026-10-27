import React from 'react';
import useAdminCollections from '../hooks/useAdminCollections';
import CollectionFormModal from '../components/CollectionFormModal';
import CollectionDeleteModal from '../components/CollectionDeleteModal';
import CollectionDetailModal from '../components/CollectionDetailModal';
import Button from '../../../../components/common/Button';
import LoadingSpinner from '../../../../components/common/LoadingSpinner';
import Pagination from '../../../../components/common/Pagination';

export const AdminCollections = () => {
  const {
    collections,
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
    selectedCollection,
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
    handleSaveCollection,
    handleDeleteCollection,
    handleAddDestinationsToCollection,
    handleRemoveDestinationFromCollection,
  } = useAdminCollections();

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
            <span className="material-symbols-outlined text-[16px]">collections_bookmark</span>
            <span>Nội Dung Tiếp Thị • Collection: collections</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Quản Lý Bộ Sưu Tập
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Quản lý các bộ sưu tập điểm đến theo mùa và chủ đề du lịch (Weekend Escapes, Mùa thu, Di sản...)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="primary"
            onClick={handleOpenCreate}
            className="flex items-center gap-2 shadow-md shadow-sky-500/20"
          >
            <span className="material-symbols-outlined text-[20px]">add_photo_alternate</span>
            <span>Thêm Bộ Sưu Tập</span>
          </Button>
        </div>
      </div>

      {/* 2. Search */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Tìm theo tên hoặc mô tả bộ sưu tập..."
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
      </div>

      {/* 3. Table of Collections */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <LoadingSpinner size="lg" />
            <p className="text-sm font-semibold text-slate-500">
              Đang tải danh sách bộ sưu tập...
            </p>
          </div>
        ) : collections.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <span className="material-symbols-outlined text-[32px]">folder_off</span>
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Không tìm thấy bộ sưu tập nào
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Nhấn "Thêm Bộ Sưu Tập" để tạo mới bộ sưu tập điểm đến đầu tiên.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-5">Tên Bộ Sưu Tập</th>
                  <th className="py-3.5 px-4">Mô Tả</th>
                  <th className="py-3.5 px-4">Điểm Đến Trong BST</th>
                  <th className="py-3.5 px-5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {collections.map((col) => {
                  const destinationsCount = Array.isArray(col.destinations)
                    ? col.destinations.length
                    : 0;

                  return (
                    <tr
                      key={col._id}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      {/* Name & Icon */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-xs shrink-0">
                            <span className="material-symbols-outlined text-[20px]">
                              collections_bookmark
                            </span>
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 block truncate group-hover:text-primary transition-colors">
                              {col.name}
                            </span>
                            <span className="text-xs text-slate-400 block truncate">
                              /{col.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="py-4 px-4 max-w-md">
                        <p className="text-xs text-slate-600 line-clamp-2">
                          {col.description || 'Chưa có mô tả cho bộ sưu tập này.'}
                        </p>
                      </td>

                      {/* Destinations count & preview */}
                      <td className="py-4 px-4">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(col)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            photo_library
                          </span>
                          <span>{destinationsCount} điểm đến</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Detail & Manage Destinations */}
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(col)}
                            title="Xem chi tiết & Quản lý điểm đến trong BST"
                            className="p-2 rounded-lg text-slate-500 hover:text-primary hover:bg-sky-50 transition-all"
                          >
                            <span className="material-symbols-outlined text-[19px]">
                              visibility
                            </span>
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(col)}
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
                            onClick={() => handleOpenDelete(col)}
                            title="Xóa bộ sưu tập"
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
          showingCount={collections.length}
        />
      </div>

      {/* Modals */}
      <CollectionFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        collection={selectedCollection}
        onSave={handleSaveCollection}
        isLoading={isSubmitting}
      />

      <CollectionDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        collection={selectedCollection}
        onConfirm={handleDeleteCollection}
        isLoading={isSubmitting}
      />

      <CollectionDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        collection={selectedCollection}
        allDestinations={allDestinations}
        allCollections={collections}
        onAddDestinations={handleAddDestinationsToCollection}
        onRemoveDestination={handleRemoveDestinationFromCollection}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default AdminCollections;
