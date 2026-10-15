import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import AnalyticsChart from '../components/AnalyticsChart';
import useAdminStats from '../hooks/useAdminStats';
import formatCurrency from '../../../../utils/formatCurrency';
import formatDate from '../../../../utils/formatDate';
import Badge from '../../../../components/common/Badge';

export const AdminDashboard = () => {
  const { stats, isLoading, refetch } = useAdminStats();
  const [activeRange, setActiveRange] = useState('month');

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

  const recentBookings = stats?.recentBookings && stats.recentBookings.length > 0
    ? stats.recentBookings
    : mockRecentBookings;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="primary" size="sm">Đã xác nhận</Badge>;
      case 'completed':
        return <Badge variant="success" size="sm">Hoàn thành</Badge>;
      case 'cancelled':
        return <Badge variant="danger" size="sm">Đã hủy</Badge>;
      case 'pending':
      default:
        return <Badge variant="warning" size="sm">Chờ duyệt</Badge>;
    }
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
            Báo cáo tổng hợp số liệu vận hành, doanh thu tài chính và hoạt động đặt tour thời gian thực.
          </p>
        </div>

        {/* Range Filters & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex p-1 rounded-xl bg-slate-200/70 border border-slate-200">
            {['today', '7days', 'month', 'year'].map((rangeKey) => {
              const label = {
                today: 'Hôm nay',
                '7days': '7 ngày',
                month: 'Tháng này',
                year: 'Năm 2026',
              }[rangeKey];
              return (
                <button
                  key={rangeKey}
                  type="button"
                  onClick={() => setActiveRange(rangeKey)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeRange === rangeKey
                      ? 'bg-white text-primary shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
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
            <span className="material-symbols-outlined text-[18px] text-primary">sync</span>
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

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Đơn Đặt Tour Mới Nhất
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Danh sách các đơn đặt tour khách hàng vừa gửi lên hệ thống
            </p>
          </div>
          <Link
            to="/admin/bookings"
            className="text-xs font-bold text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Xem tất cả đơn hàng</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold text-[11px] uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Mã Đơn</th>
                <th className="py-3 px-4">Khách Hàng</th>
                <th className="py-3 px-4">Tour Du Lịch</th>
                <th className="py-3 px-4">Ngày Đi</th>
                <th className="py-3 px-4">Tổng Tiền</th>
                <th className="py-3 px-4">Trạng Thái</th>
                <th className="py-3 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
              {recentBookings.map((b, idx) => (
                <tr key={b._id || idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-primary">
                    #TT-{(b._id || `100${idx}`).toString().slice(-6).toUpperCase()}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {b.customerId?.fullName || b.userId?.name || b.customerName || 'Trần Văn Hoàng'}
                  </td>
                  <td className="py-3.5 px-4 max-w-xs truncate text-slate-800">
                    {b.tourId?.title || b.tourTitle || 'Tour Du Thuyền Vịnh Hạ Long 2N1Đ'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {formatDate(b.departureDate || new Date())}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {formatCurrency(b.totalAmount || 6500000)}
                  </td>
                  <td className="py-3.5 px-4">
                    {getStatusBadge(b.bookingStatus || 'pending')}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => alert(`Xem chi tiết đơn hàng: ${b._id || 'TT-100' + idx}`)}
                      className="px-2.5 py-1 rounded-lg bg-sky-50 text-primary hover:bg-primary hover:text-white font-bold text-xs transition-colors"
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Fallback Mock Bookings
const mockRecentBookings = [
  {
    _id: 'bk-6710a',
    customerName: 'Nguyễn Văn Minh',
    tourTitle: 'Du Thuyền Khám Phá Vịnh Hạ Long 5 Sao',
    departureDate: '2026-10-25',
    totalAmount: 6500000,
    bookingStatus: 'pending',
  },
  {
    _id: 'bk-6710b',
    customerName: 'Lê Thị Thu Thảo',
    tourTitle: 'Hành Trình Di Sản Miền Trung: Đà Nẵng - Hội An',
    departureDate: '2026-10-28',
    totalAmount: 9380000,
    bookingStatus: 'confirmed',
  },
  {
    _id: 'bk-6710c',
    customerName: 'Phạm Đức Dũng',
    tourTitle: 'Kỳ Nghỉ Dưỡng Đảo Ngọc Phú Quốc 4N3Đ',
    departureDate: '2026-11-02',
    totalAmount: 11700000,
    bookingStatus: 'pending',
  },
  {
    _id: 'bk-6710d',
    customerName: 'Hoàng Mai Phương',
    tourTitle: 'Trekking Sa Pa - Chinh Phục Đỉnh Fansipan',
    departureDate: '2026-11-05',
    totalAmount: 4800000,
    bookingStatus: 'confirmed',
  },
  {
    _id: 'bk-6710e',
    customerName: 'Vũ Quốc Toàn',
    tourTitle: 'Khám Phá Cao Nguyên Đá Đồng Văn - Hà Giang',
    departureDate: '2026-10-18',
    totalAmount: 5200000,
    bookingStatus: 'completed',
  },
];

export default AdminDashboard;
