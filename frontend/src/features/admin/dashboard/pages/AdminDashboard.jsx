import React, { useState } from "react";
import StatCard from "../components/StatCard";
import AnalyticsChart from "../components/AnalyticsChart";
import useAdminStats from "../hooks/useAdminStats";
import formatCurrency from "../../../../utils/formatCurrency";

export const AdminDashboard = () => {
  const { stats, isLoading, refetch } = useAdminStats();
  const [activeRange, setActiveRange] = useState("month");

  const kpi = stats?.kpi || {
    totalUsers: 24,
    totalCustomers: 18,
    totalDestinations: 64,
    totalTours: 128,
    totalGuides: 16,
    totalBookings: 342,
    totalRevenue: 4250000000,
  };

  const breakdown = stats?.bookingsBreakdown || {
    pending: 38,
    confirmed: 215,
    completed: 74,
    cancelled: 15,
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Top Title & Filters Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
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

        {/* Range Filters & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex p-1 rounded-xl bg-slate-200/70 border border-slate-200">
            {["today", "7days", "month", "year"].map((rangeKey) => {
              const label = {
                today: "Hôm nay",
                "7days": "7 ngày",
                month: "Tháng này",
                year: "Năm 2026",
              }[rangeKey];
              return (
                <button
                  key={rangeKey}
                  type="button"
                  onClick={() => setActiveRange(rangeKey)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeRange === rangeKey
                      ? "bg-white text-primary shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={refetch}
            className="h-9.5 px-3.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">
              sync
            </span>
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          title="Tổng Điểm Đến"
          value={kpi.totalDestinations || 64}
          unit="địa danh"
          change="+14.2%"
          changeType="up"
          note="+4 điểm đến mới"
          icon="location_on"
          iconBg="bg-sky-50 text-sky-600"
        />

        <StatCard
          title="Tour Đang Mở Bán"
          value={kpi.totalTours || 128}
          unit="gói tour"
          change="+8.5%"
          changeType="up"
          note="92% hoạt động"
          icon="explore"
          iconBg="bg-blue-50 text-secondary"
        />

        <StatCard
          title="Tổng Đơn Đặt Tour"
          value={kpi.totalBookings || 342}
          unit="đơn"
          change="+24.0%"
          changeType="up"
          note={`${breakdown.pending || 38} đơn chờ phê duyệt`}
          icon="receipt_long"
          iconBg="bg-amber-50 text-amber-600"
        />

        <StatCard
          title="Doanh Thu Ước Tính"
          value={formatCurrency(kpi.totalRevenue || 4250000000)}
          change="+18.4%"
          changeType="up"
          note="Doanh thu thanh toán"
          icon="payments"
          iconBg="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Analytics Charts Section */}
      <AnalyticsChart breakdown={breakdown} totalRevenue={kpi.totalRevenue} />
    </div>
  );
};

export default AdminDashboard;
