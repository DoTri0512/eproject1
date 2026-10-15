import React from 'react';
import formatCurrency from '../../../../utils/formatCurrency';

export const AnalyticsChart = ({ breakdown = {}, totalRevenue = 0 }) => {
  const pending = breakdown.pending || 0;
  const confirmed = breakdown.confirmed || 0;
  const completed = breakdown.completed || 0;
  const cancelled = breakdown.cancelled || 0;
  const totalBookings = pending + confirmed + completed + cancelled || 1;

  const pendingPct = Math.round((pending / totalBookings) * 100) || 0;
  const confirmedPct = Math.round((confirmed / totalBookings) * 100) || 0;
  const completedPct = Math.round((completed / totalBookings) * 100) || 0;
  const cancelledPct = Math.round((cancelled / totalBookings) * 100) || 0;

  // Monthly mock trend data for 2026
  const monthlyData = [
    { month: 'T5', revenue: 420000000, bookings: 45, height: '40%' },
    { month: 'T6', revenue: 680000000, bookings: 72, height: '65%' },
    { month: 'T7', revenue: 950000000, bookings: 110, height: '90%' },
    { month: 'T8', revenue: 820000000, bookings: 94, height: '78%' },
    { month: 'T9', revenue: 540000000, bookings: 58, height: '52%' },
    { month: 'T10', revenue: 790000000, bookings: 88, height: '75%' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
      {/* Monthly Bar Trend (8 cols) */}
      <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Xu Hướng Doanh Thu & Lượng Booking
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Thống kê 6 tháng gần nhất năm 2026
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-primary" />
              <span className="text-slate-600">Doanh thu</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-cyan-400" />
              <span className="text-slate-600">Lượt đặt tour</span>
            </div>
          </div>
        </div>

        {/* Bar Visualizer */}
        <div className="h-56 flex items-end justify-between gap-2 sm:gap-6 pt-6 pb-2 border-b border-slate-100">
          {monthlyData.map((item) => (
            <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              {/* Tooltip on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-slate-900 text-white font-bold py-1 px-2 rounded pointer-events-none whitespace-nowrap mb-1">
                {formatCurrency(item.revenue)} • {item.bookings} đơn
              </div>

              {/* Dual Bars */}
              <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-44">
                {/* Revenue Bar */}
                <div
                  style={{ height: item.height }}
                  className="w-4 sm:w-6 rounded-t-md bg-gradient-to-t from-primary to-sky-400 group-hover:brightness-110 transition-all shadow-xs"
                />
                {/* Bookings Bar */}
                <div
                  style={{ height: `${Math.max(15, parseInt(item.height) * 0.7)}%` }}
                  className="w-3 sm:w-4 rounded-t-md bg-cyan-400/80 group-hover:bg-cyan-400 transition-all shadow-xs"
                />
              </div>

              <span className="text-xs font-bold text-slate-500 mt-2">{item.month}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 flex items-center justify-between text-xs text-slate-500">
          <span>Tổng doanh thu ghi nhận: <strong className="text-slate-900 font-bold">{formatCurrency(totalRevenue || 4200000000)}</strong></span>
          <span className="text-emerald-600 font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">trending_up</span> +18.4% so với cùng kỳ
          </span>
        </div>
      </div>

      {/* Booking Status Breakdown (4 cols) */}
      <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Phân Bổ Trạng Thái Đơn
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Tỉ lệ các đơn đặt tour theo chu kỳ xử lý
          </p>

          {/* Segmented Progress Bar */}
          <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex mb-6">
            <div style={{ width: `${pendingPct}%` }} className="bg-amber-400 h-full" title={`Pending: ${pending}`} />
            <div style={{ width: `${confirmedPct}%` }} className="bg-sky-500 h-full" title={`Confirmed: ${confirmed}`} />
            <div style={{ width: `${completedPct}%` }} className="bg-emerald-500 h-full" title={`Completed: ${completed}`} />
            <div style={{ width: `${cancelledPct}%` }} className="bg-rose-500 h-full" title={`Cancelled: ${cancelled}`} />
          </div>

          {/* Status Breakdown List */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="text-xs font-semibold text-slate-700">Chờ duyệt (Pending)</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-900 mr-2">{pending} đơn</span>
                <span className="text-[11px] text-slate-400">({pendingPct}%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-sky-500" />
                <span className="text-xs font-semibold text-slate-700">Đã xác nhận (Confirmed)</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-900 mr-2">{confirmed} đơn</span>
                <span className="text-[11px] text-slate-400">({confirmedPct}%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-slate-700">Hoàn thành (Completed)</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-900 mr-2">{completed} đơn</span>
                <span className="text-[11px] text-slate-400">({completedPct}%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="text-xs font-semibold text-slate-700">Đã hủy (Cancelled)</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-900 mr-2">{cancelled} đơn</span>
                <span className="text-[11px] text-slate-400">({cancelledPct}%)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Tổng cộng: <strong className="text-slate-700">{totalBookings} đơn</strong></span>
          <span className="text-sky-600 font-semibold">Tự động đồng bộ</span>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;
