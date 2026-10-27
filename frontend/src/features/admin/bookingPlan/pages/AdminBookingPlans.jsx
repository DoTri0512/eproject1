import React from "react";
import useAdminBookingPlans from "../hooks/useAdminBookingPlans";
import AssignGuideModal from "../components/AssignGuideModal";
import PassengersListModal from "../components/PassengersListModal";
import CreateBookingPlanModal from "../components/CreateBookingPlanModal";
import Badge from "../../../../components/common/Badge";
import formatDate from "../../../../utils/formatDate";

export const AdminBookingPlans = () => {
  const {
    filteredPlans,
    tours,
    guides,
    stats,
    isLoading,
    isSyncing,
    selectedTourId,
    setSelectedTourId,
    selectedStatus,
    setSelectedStatus,
    selectedDate,
    setSelectedDate,
    searchTerm,
    setSearchTerm,
    selectedPlan,
    isPassengersModalOpen,
    setIsPassengersModalOpen,
    isAssignGuideModalOpen,
    setIsAssignGuideModalOpen,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isSubmitting,
    toastMessage,
    handleOpenPassengers,
    handleOpenAssignGuide,
    handleAssignGuide,
    handleUpdateStatus,
    handleSyncPlans,
    handleCreatePlan,
    handleDeletePlan,
  } = useAdminBookingPlans();

  const getStatusBadge = (status) => {
    switch (status) {
      case "in_progress":
        return (
          <Badge variant="cyan" size="sm">
            Đang diễn ra
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="success" size="sm">
            Hoàn thành
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="neutral" size="sm">
            Đã hủy
          </Badge>
        );
      case "scheduled":
      default:
        return (
          <Badge variant="primary" size="sm">
            Đã lên lịch
          </Badge>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-modal border border-slate-200 animate-in fade-in slide-in-from-right duration-200">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              toastMessage.type === "error"
                ? "bg-rose-100 text-rose-600"
                : "bg-emerald-100 text-emerald-600"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {toastMessage.type === "error" ? "error" : "check_circle"}
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
            <span>MongoDB Atlas • Collection: bookingplans</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Quản Lý Đoàn Khởi Hành Theo Chuyến
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gom tự động hành khách cùng ngày khởi hành, phân công Hướng dẫn viên
            và xuất danh sách điểm danh đoàn
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() =>
              alert("Đang xuất danh sách các đợt khởi hành ra file Excel...")
            }
            className="h-11 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              file_download
            </span>
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>

      {/* 2. Metric Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[26px]">
              groups
            </span>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Tổng Số Đoàn
            </div>
            <div className="text-2xl font-black text-slate-800">
              {stats.total}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[26px]">
              schedule
            </span>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Sắp Khởi Hành
            </div>
            <div className="text-2xl font-black text-emerald-600">
              {stats.scheduled}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[26px]">
              directions_bus
            </span>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Đang Diễn Ra
            </div>
            <div className="text-2xl font-black text-cyan-600">
              {stats.inProgress}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex items-center gap-4 relative overflow-hidden">
          {stats.unassignedGuides > 0 && (
            <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
          )}
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[26px]">
              person_alert
            </span>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Chưa Gán HDV
            </div>
            <div className="text-2xl font-black text-amber-600">
              {stats.unassignedGuides}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Filter Controls Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tour, HDV..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        {/* Tour Filter */}
        <div>
          <select
            value={selectedTourId}
            onChange={(e) => setSelectedTourId(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">Tất cả Tour du lịch</option>
            {tours.map((t) => (
              <option key={t._id} value={t._id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">Tất cả Trạng thái</option>
            <option value="scheduled">Đã lên lịch (Scheduled)</option>
            <option value="in_progress">Đang diễn ra (In Progress)</option>
            <option value="completed">Hoàn thành (Completed)</option>
            <option value="cancelled">Đã hủy (Cancelled)</option>
          </select>
        </div>
      </div>

      {/* 4. Booking Plans Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400 animate-pulse">
            <span className="material-symbols-outlined text-[36px] animate-spin mb-2">
              progress_activity
            </span>
            <p className="text-sm font-semibold">
              Đang tải danh sách các đoàn khởi hành...
            </p>
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-[32px]">
                group_off
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-700">
              Chưa có đoàn khởi hành nào phù hợp
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Hệ thống có thể tự động gom các đơn đặt tour theo cùng ngày khởi
              hành thành từng đoàn, hoặc bạn có thể lập đoàn thủ công.
            </p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                type="button"
                onClick={handleSyncPlans}
                disabled={isSyncing}
                className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold inline-flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50"
              >
                <span
                  className={`material-symbols-outlined text-[18px] ${isSyncing ? "animate-spin" : ""}`}
                >
                  sync
                </span>
                <span>
                  {isSyncing ? "Đang đồng bộ..." : "Đồng bộ từ đơn đặt tour"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold inline-flex items-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">
                  add
                </span>
                <span>Lập đoàn mới</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                <tr className="whitespace-nowrap">
                  <th className="py-3.5 px-4">Gói Tour Du Lịch</th>
                  <th className="py-3.5 px-4">Ngày Đi - Ngày Về</th>
                  <th className="py-3.5 px-4">Hành Khách Đoàn</th>
                  <th className="py-3.5 px-4">Hướng Dẫn Viên Phụ Trách</th>
                  <th className="py-3.5 px-4">Trạng Thái Chuyến Đi</th>
                  <th className="py-3.5 px-4 text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredPlans.map((plan) => {
                  const tour = plan.tourId || {};
                  const guide = plan.guideId || null;
                  const total =
                    plan.totalPassengers || plan.passengersList?.length || 0;
                  const bookingsCount = plan.bookings?.length || 1;

                  return (
                    <tr
                      key={plan._id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Tour */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 line-clamp-1 max-w-[240px]">
                          {tour.title || "Tour du lịch"}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-1">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[10px] text-slate-600 font-semibold">
                            {bookingsCount} đơn đặt
                          </span>
                          {plan.duration?.days ? (
                            <span className="px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 font-bold text-[10px]">
                              {plan.duration.days}N{plan.duration.nights}Đ
                            </span>
                          ) : tour.durationOptions?.length > 0 ? (
                            <span className="px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 font-bold text-[10px]">
                              {tour.durationOptions[0].days}N
                              {tour.durationOptions[0].nights}Đ
                            </span>
                          ) : null}
                        </div>
                      </td>

                      {/* Departure - End Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="text-sky-900 font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px] text-primary">
                            flight_takeoff
                          </span>
                          <span>{formatDate(plan.departureDate)}</span>
                        </div>
                        {plan.endDate && (
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-[14px]">
                              flight_land
                            </span>
                            <span>Về: {formatDate(plan.endDate)}</span>
                          </div>
                        )}
                      </td>

                      {/* Total Passengers */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="text-base font-black text-slate-900">
                          {total}
                        </span>{" "}
                        <span className="text-xs text-slate-400 font-normal">
                          hành khách
                        </span>
                      </td>

                      {/* Assigned Guide */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {guide ? (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 shrink-0">
                              <img
                                src={
                                  guide.avatar ||
                                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                                }
                                alt={guide.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">
                                {guide.name}
                              </div>
                              <div className="text-[11px] text-slate-400">
                                {guide.phone || "HDV chính"}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold inline-flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">
                              person_off
                            </span>
                            <span>Chưa phân công</span>
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getStatusBadge(plan.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenPassengers(plan)}
                          className="px-3 py-1.5 rounded-xl bg-sky-50 text-primary hover:bg-primary hover:text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors shadow-xs"
                          title="Xem thông tin chi tiết đoàn"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            visibility
                          </span>
                          <span>Xem thông tin</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Passengers Modal */}
      {isPassengersModalOpen && (
        <PassengersListModal
          isOpen={isPassengersModalOpen}
          onClose={() => setIsPassengersModalOpen(false)}
          plan={selectedPlan}
        />
      )}

      {/* Assign Guide Modal */}
      {isAssignGuideModalOpen && (
        <AssignGuideModal
          isOpen={isAssignGuideModalOpen}
          onClose={() => setIsAssignGuideModalOpen(false)}
          plan={selectedPlan}
          guides={guides}
          onAssign={handleAssignGuide}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Create Booking Plan Modal */}
      {isCreateModalOpen && (
        <CreateBookingPlanModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          tours={tours}
          guides={guides}
          onSubmit={handleCreatePlan}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default AdminBookingPlans;
