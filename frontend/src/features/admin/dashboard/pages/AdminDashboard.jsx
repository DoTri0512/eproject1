import React from "react";
import StatCard from "../components/StatCard";
import AnalyticsChart from "../components/AnalyticsChart";
import useAdminStats from "../hooks/useAdminStats";
import formatCurrency from "../../../../utils/formatCurrency";

export const AdminDashboard = () => {
  const { stats, isLoading, refetch } = useAdminStats();

  const kpi = stats?.kpi || {
    totalUsers: 0,
    totalCustomers: 0,
    totalDestinations: 0,
    totalTours: 0,
    totalGuides: 0,
    totalBookings: 0,
    totalRevenue: 0,
  };

  const breakdown = stats?.bookingsBreakdown || {
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Top Title & Refresh Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            <span className="text-primary">TravelTrail Analytics Suite</span>
            <span>•</span>
            <span>Hệ Thống Quản Trị Trung Tâm</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Thống Kê & Tổng Quan Hệ Thống
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Báo cáo tổng hợp số liệu vận hành, doanh thu tài chính và hoạt động
            đặt tour thời gian thực.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={refetch}
            disabled={isLoading}
            className="h-9.5 px-3.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            <span
              className={`material-symbols-outlined text-[18px] text-primary ${
                isLoading ? "animate-spin" : ""
              }`}
            >
              sync
            </span>
            <span>{isLoading ? "Đang tải..." : "Làm mới"}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          title="Tổng Điểm Đến"
          value={kpi.totalDestinations ?? 0}
          unit="địa danh"
          note={`${kpi.totalDestinations ?? 0} điểm đến khả dụng`}
          icon="location_on"
          iconBg="bg-sky-50 text-sky-600"
        />

        <StatCard
          title="Tour Đang Mở Bán"
          value={kpi.totalTours ?? 0}
          unit="gói tour"
          note={`${kpi.totalTours ?? 0} chương trình tour`}
          icon="explore"
          iconBg="bg-blue-50 text-secondary"
        />

        <StatCard
          title="Tổng Đơn Đặt Tour"
          value={kpi.totalBookings ?? 0}
          unit="đơn"
          note={`${breakdown.pending ?? 0} đơn chờ duyệt`}
          icon="receipt_long"
          iconBg="bg-amber-50 text-amber-600"
        />

        <StatCard
          title="Doanh Thu Thực Tế"
          value={formatCurrency(kpi.totalRevenue ?? 0)}
          note="Chỉ tính đơn đã hoàn thành"
          icon="payments"
          iconBg="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Analytics Charts Section */}
      <AnalyticsChart
        breakdown={breakdown}
        totalRevenue={kpi.totalRevenue}
        monthlyStats={stats?.monthlyStats}
      />
    </div>
  );
};

export default AdminDashboard;
