import React from "react";
import useAdminBookings from "../hooks/useAdminBookings";
import BookingStatusControl from "../components/BookingStatusControl";
import BookingDetailModal from "../components/BookingDetailModal";
import Badge from "../../../../components/common/Badge";
import Pagination from "../../../../components/common/Pagination";
import formatCurrency from "../../../../utils/formatCurrency";
import formatDate from "../../../../utils/formatDate";

export const AdminBookings = () => {
  const {
    filteredBookings,
    stats,
    isLoading,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    limit,
    setLimit,
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    paymentFilter,
    setPaymentFilter,
    selectedBooking,
    isDetailModalOpen,
    setIsDetailModalOpen,
    isSubmitting,
    toastMessage,
    handleOpenDetail,
    handleUpdateStatus,
    handleQuickApprove,
    handleQuickComplete,
  } = useAdminBookings();

  const tabs = [
    { id: "all", label: "Tất cả đơn", count: stats.total },
    {
      id: "pending",
      label: "Chờ phê duyệt",
      count: stats.pending,
      alert: stats.pending > 0,
    },
    { id: "confirmed", label: "Đã xác nhận", count: stats.confirmed },
    { id: "completed", label: "Đã hoàn thành", count: stats.completed },
    { id: "cancelled", label: "Đã hủy", count: stats.cancelled },
  ];

  const getPaymentBadge = (status) => {
    switch (status) {
      case "confirmed":
      case "completed":
        return (
          <Badge variant="success" size="sm">
            Đã thanh toán
          </Badge>
        );
      case "pending":
      default:
        return (
          <Badge variant="warning" size="sm">
            Chờ thanh toán
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
            <span>MongoDB Atlas • Collection: bookings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Quản Lý Đơn Đặt Chuyến Du Lịch
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tiếp nhận, thẩm định phê duyệt đơn hàng, quản lý thanh toán và trạng
            thái chuyến đi của khách hàng
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() =>
              alert("Đang xuất danh sách đơn đặt tour ra file Excel / CSV...")
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
              receipt_long
            </span>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Tổng Đơn Hàng
            </div>
            <div className="text-2xl font-black text-slate-800">
              {stats.total}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex items-center gap-4 relative overflow-hidden">
          {stats.pending > 0 && (
            <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
          )}
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[26px]">
              hourglass_top
            </span>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Chờ Duyệt (Pending)
            </div>
            <div className="text-2xl font-black text-amber-600">
              {stats.pending}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[26px]">paid</span>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Doanh Thu Đã Xác Nhận
            </div>
            <div className="text-xl font-black text-emerald-600">
              {formatCurrency(stats.totalRevenue)}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[26px]">
              task_alt
            </span>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Đã Hoàn Thành
            </div>
            <div className="text-2xl font-black text-cyan-600">
              {stats.completed}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap shadow-xs ${
                isActive
                  ? "bg-primary text-white shadow-md shadow-sky-500/20"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : tab.alert
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slate-100 text-slate-500"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Search and Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo mã đơn (#BK-...), tên khách hàng, số điện thoại, tour..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div className="w-full md:w-56 shrink-0">
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">Tất cả thanh toán</option>
            <option value="pending">Chưa thanh toán</option>
            <option value="confirmed">Đã thanh toán</option>
            <option value="completed">Đã quyết toán</option>
          </select>
        </div>
      </div>

      {/* 5. Bookings Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400 animate-pulse">
            <span className="material-symbols-outlined text-[36px] animate-spin mb-2">
              progress_activity
            </span>
            <p className="text-sm font-semibold">
              Đang tải danh sách đơn đặt tour...
            </p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-[32px]">
                receipt_long
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-700">
              Không tìm thấy đơn đặt tour nào
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Thử chọn tab trạng thái khác hoặc xóa từ khóa tìm kiếm
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                <tr className="whitespace-nowrap">
                  <th className="py-3.5 px-4">Mã Đơn</th>
                  <th className="py-3.5 px-4">Ngày Đặt</th>
                  <th className="py-3.5 px-4">Tên Khách Hàng</th>
                  <th className="py-3.5 px-4">Tên Chuyến Tour</th>
                  <th className="py-3.5 px-4 text-center">Lịch Trình</th>
                  <th className="py-3.5 px-4">Tổng Tiền</th>
                  <th className="py-3.5 px-4">Trạng Thái Thanh Toán</th>
                  <th className="py-3.5 px-4">Trạng Thái Đơn</th>
                  <th className="py-3.5 px-4 text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredBookings.map((b) => {
                  const bookingCode = `#BK-${(b._id || "").slice(-6).toUpperCase()}`;
                  const customer = b.customerId || {};
                  const user = b.userId || {};
                  const tour = b.tourId || {};
                  const isPending =
                    (b.bookingStatus || "pending") === "pending";

                  const getMethodLabel = (method) => {
                    switch (method) {
                      case "cash":
                        return "Tiền mặt";
                      case "credit_card":
                        return "Thẻ tín dụng";
                      case "bank_transfer":
                        return "Chuyển khoản";
                      case "e_wallet":
                        return "Ví điện tử";
                      default:
                        return method || "Chuyển khoản";
                    }
                  };

                  return (
                    <tr
                      key={b._id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* 1. Mã Đơn */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(b)}
                          className="font-mono font-bold text-primary hover:underline text-xs"
                        >
                          {bookingCode}
                        </button>
                      </td>

                      {/* 2. Ngày Đặt */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-600 font-medium">
                        {formatDate(b.createdAt || b.bookingDate)}
                      </td>

                      {/* 3. Tên Khách Hàng */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">
                          {customer.fullName || user.name || "Khách vãng lai"}
                        </div>
                        {customer.phone && (
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-[13px] text-slate-400">
                              call
                            </span>
                            <span>{customer.phone}</span>
                          </div>
                        )}
                      </td>

                      {/* 4. Tên Chuyến Tour */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 line-clamp-2 max-w-[240px]">
                          {tour.title || "Tour du lịch"}
                        </div>
                      </td>

                      {/* 5. Lịch Trình */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          {b.selectedDuration?.days ? (
                            <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 font-bold text-[10px] w-fit border border-sky-100">
                              {b.selectedDuration.days}N
                              {b.selectedDuration.nights}Đ
                            </span>
                          ) : null}
                          <div className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px] text-primary">
                              calendar_month
                            </span>
                            <span>{formatDate(b.departureDate)}</span>
                            {b.endDate && (
                              <span className="text-slate-400">
                                → {formatDate(b.endDate)}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* 6. Tổng Tiền */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-black text-primary text-sm">
                          {formatCurrency(b.totalAmount)}
                        </div>
                        {b.selectedDuration?.price && (
                          <div className="text-[10px] text-slate-400 font-medium">
                            {formatCurrency(b.selectedDuration.price)}/khách
                          </div>
                        )}
                      </td>

                      {/* 7. Trạng Thái Thanh Toán */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div>{getPaymentBadge(b.paymentStatus)}</div>
                        <div className="text-[10px] text-slate-500 font-medium mt-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">
                            payments
                          </span>
                          <span>{getMethodLabel(b.paymentMethod)}</span>
                        </div>
                      </td>

                      {/* 8. Trạng Thái Đơn */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <BookingStatusControl
                          status={b.bookingStatus}
                          onChange={(newStatus) =>
                            handleUpdateStatus(b._id, {
                              bookingStatus: newStatus,
                              paymentStatus:
                                newStatus === "confirmed"
                                  ? "confirmed"
                                  : b.paymentStatus,
                            })
                          }
                        />
                      </td>

                      {/* 9. Thao Tác */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPending && (
                            <button
                              type="button"
                              onClick={() => handleQuickApprove(b)}
                              title="Duyệt nhanh đơn"
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white font-bold text-xs flex items-center gap-1 transition-colors"
                            >
                              <span className="material-symbols-outlined text-[15px]">
                                check
                              </span>
                              <span>Duyệt</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleOpenDetail(b)}
                            title="Xem chi tiết đơn"
                            className="w-8 h-8 rounded-lg bg-sky-50 text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
                          >
                            <span className="material-symbols-outlined text-[17px]">
                              visibility
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
          showingCount={filteredBookings.length}
        />
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && (
        <BookingDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          booking={selectedBooking}
          onUpdateStatus={handleUpdateStatus}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default AdminBookings;
