import React from 'react';
import useAdminTours from '../hooks/useAdminTours';
import TourFormModal from '../components/TourFormModal';
import TourDeleteModal from '../components/TourDeleteModal';
import Badge from '../../../../components/common/Badge';
import formatCurrency from '../../../../utils/formatCurrency';
import formatDate from '../../../../utils/formatDate';

export const AdminTours = () => {
  const {
    destinations,
    filteredTours,
    stats,
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedDestinationId,
    setSelectedDestinationId,
    selectedStatus,
    setSelectedStatus,
    isFormModalOpen,
    setIsFormModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedTour,
    isSubmitting,
    toastMessage,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDelete,
    handleSaveTour,
    handleDeleteTour,
    handleToggleStatus,
  } = useAdminTours();

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
            <span className="material-symbols-outlined text-[16px]">database</span>
            <span>MongoDB Atlas • Collection: tours</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Quản Lý Danh Sách Tour Du Lịch
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Quản lý gói tour, điểm đến liên kết, lịch trình, giá bán và ngày khởi hành mở bán
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => alert('Đang xuất danh sách Tour du lịch ra file Excel / CSV...')}
            className="h-11 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            <span>Xuất Excel</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="h-11 px-5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-sky-500/20 hover:opacity-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span>+ Thêm Tour Mới</span>
          </button>
        </div>
      </div>

      {/* 2. Metric Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[26px]">calendar_month</span>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tổng số Tour</div>
            <div className="text-2xl font-black text-slate-800">{stats.total}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[26px]">check_circle</span>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Đang Mở Bán</div>
            <div className="text-2xl font-black text-emerald-600">{stats.active}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[26px]">event_seat</span>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tổng Chỗ Khả Dụng</div>
            <div className="text-2xl font-black text-cyan-600">{stats.totalAvailableSeats}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[26px]">payments</span>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Giá Bán TB / Khách</div>
            <div className="text-xl font-black text-amber-600">{formatCurrency(stats.avgPrice)}</div>
          </div>
        </div>
      </div>

      {/* 3. Filter & Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên tour, điểm đến, mã tour..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        {/* Destination Filter */}
        <div className="w-full md:w-56 shrink-0">
          <select
            value={selectedDestinationId}
            onChange={(e) => setSelectedDestinationId(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">Tất cả Điểm Đến</option>
            {destinations.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-44 shrink-0">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">Tất cả Trạng thái</option>
            <option value="active">Đang mở bán</option>
            <option value="inactive">Tạm ngưng</option>
          </select>
        </div>
      </div>

      {/* 4. Tours Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400 animate-pulse">
            <span className="material-symbols-outlined text-[36px] animate-spin mb-2">progress_activity</span>
            <p className="text-sm font-semibold">Đang tải danh sách Tour từ cơ sở dữ liệu...</p>
          </div>
        ) : filteredTours.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-[32px]">tour</span>
            </div>
            <h3 className="text-base font-bold text-slate-700">Không tìm thấy Tour nào phù hợp</h3>
            <p className="text-xs text-slate-400 mt-1">Thử thay đổi từ khóa tìm kiếm hoặc bỏ bộ lọc</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Tour Du Lịch</th>
                  <th className="py-3.5 px-4">Thời Lượng</th>
                  <th className="py-3.5 px-4">Giá Vé / Khách</th>
                  <th className="py-3.5 px-4">Chỗ Trống / Tối Đa</th>
                  <th className="py-3.5 px-4">Ngày Khởi Hành Gần Nhất</th>
                  <th className="py-3.5 px-4">Trạng Thái</th>
                  <th className="py-3.5 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredTours.map((tour) => {
                  const dest = tour.destinationId || {};
                  const isActive = (tour.status || 'active') === 'active';
                  const available = tour.availableSeats ?? tour.maxPassengers ?? 20;
                  const max = tour.maxPassengers || 20;
                  const ratio = Math.min(100, Math.round((available / max) * 100));

                  return (
                    <tr key={tour._id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Title & Dest */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                            <img
                              src={
                                dest.image ||
                                'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=200&q=80'
                              }
                              alt={tour.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src =
                                  'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=200&q=80';
                              }}
                            />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 line-clamp-1 hover:text-primary">
                              {tour.title}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <span className="material-symbols-outlined text-[13px] text-primary">location_on</span>
                              <span>{dest.name || 'Việt Nam'}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Duration options with prices */}
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        {tour.durationOptions?.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {tour.durationOptions.map((opt, i) => (
                              <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 font-semibold inline-flex items-center gap-1.5 border border-sky-100/80">
                                <span className="font-bold text-sky-700">{opt.days}N{opt.nights}Đ:</span>
                                <span className="font-mono text-slate-700">{formatCurrency(opt.price)}</span>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Price Range */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-black text-primary">
                        {tour.durationOptions?.length > 0 ? (
                          <div>
                            <div className="text-xs font-bold text-primary">
                              Từ {formatCurrency(Math.min(...tour.durationOptions.map(o => o.price)))}
                            </div>
                            {tour.durationOptions.length > 1 && (
                              <div className="text-[10px] text-slate-400 font-medium">
                                Đến {formatCurrency(Math.max(...tour.durationOptions.map(o => o.price)))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 font-normal">Liên hệ</span>
                        )}
                      </td>

                      {/* Seats & progress */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold ${
                              available <= 0 ? 'text-rose-600 font-extrabold' : 'text-slate-800'
                            }`}
                          >
                            {available} / {max}
                          </span>
                          <span className="text-[10px] text-slate-400">chỗ</span>
                          {available <= 0 && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-rose-50 text-rose-600">
                              Hết chỗ
                            </span>
                          )}
                        </div>
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                          <div
                            className={`h-full rounded-full ${
                              ratio > 40 ? 'bg-emerald-500' : ratio > 15 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${ratio}%` }}
                          />
                        </div>
                      </td>

                      {/* Departure Dates */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {tour.departureDates && tour.departureDates.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-[180px]">
                            {tour.departureDates.slice(0, 2).map((d, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 font-mono text-[11px] font-semibold"
                              >
                                {formatDate(d)}
                              </span>
                            ))}
                            {tour.departureDates.length > 2 && (
                              <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold">
                                +{tour.departureDates.length - 2}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs italic">Liên hệ</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(tour)}
                          title="Click để đổi trạng thái"
                          className="cursor-pointer transition-transform hover:scale-105"
                        >
                          <Badge variant={isActive ? 'success' : 'neutral'} size="sm">
                            {isActive ? 'Đang mở bán' : 'Tạm ngưng'}
                          </Badge>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(tour)}
                            title="Chỉnh sửa Tour"
                            className="w-8 h-8 rounded-lg bg-sky-50 text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
                          >
                            <span className="material-symbols-outlined text-[17px]">edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(tour)}
                            title="Xóa Tour"
                            className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center transition-colors"
                          >
                            <span className="material-symbols-outlined text-[17px]">delete</span>
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
      </div>

      {/* Form Modal */}
      {isFormModalOpen && (
        <TourFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={handleSaveTour}
          tour={selectedTour}
          destinations={destinations}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <TourDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteTour}
          tour={selectedTour}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default AdminTours;
