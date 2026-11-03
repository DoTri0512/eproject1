import React from 'react';
import formatCurrency from '../../../../utils/formatCurrency';

export const AnalyticsChart = ({ breakdown = {}, totalRevenue = 0, monthlyStats = [] }) => {
  const pending = breakdown?.pending || 0;
  const confirmed = breakdown?.confirmed || 0;
  const completed = breakdown?.completed || 0;
  const cancelled = breakdown?.cancelled || 0;
  const totalBookings = pending + confirmed + completed + cancelled;

  const pendingPct = totalBookings > 0 ? Math.round((pending / totalBookings) * 100) : 0;
  const confirmedPct = totalBookings > 0 ? Math.round((confirmed / totalBookings) * 100) : 0;
  const completedPct = totalBookings > 0 ? Math.round((completed / totalBookings) * 100) : 0;
  const cancelledPct = totalBookings > 0 ? Math.round((cancelled / totalBookings) * 100) : 0;

  // Use dynamic monthlyStats from backend, or fallback to zeroed months
  const chartData = (monthlyStats && monthlyStats.length > 0)
    ? monthlyStats
    : [
        { month: 'T5', revenue: 0, bookings: 0 },
        { month: 'T6', revenue: 0, bookings: 0 },
        { month: 'T7', revenue: 0, bookings: 0 },
        { month: 'T8', revenue: 0, bookings: 0 },
        { month: 'T9', revenue: 0, bookings: 0 },
        { month: 'T10', revenue: 0, bookings: 0 },
      ];

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue || 0), 0);
  const maxBookings = Math.max(...chartData.map((d) => d.bookings || 0), 0);

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
              Thống kê {chartData.length} tháng gần nhất
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
          {chartData.map((item) => {
            const revHeight =
              maxRevenue > 0 && item.revenue > 0
                ? `${Math.max(12, Math.round((item.revenue / maxRevenue) * 92))}%`
                : '4px';

            const bookHeight =
              maxBookings > 0 && item.bookings > 0
                ? `${Math.max(12, Math.round((item.bookings / maxBookings) * 85))}%`
                : '4px';

            return (
              <div
                key={item.month}
                className="flex-1 flex flex-col items-center gap-2 group h-full justify-end"
              >
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-slate-900 text-white font-bold py-1 px-2 rounded pointer-events-none whitespace-nowrap mb-1 z-10 shadow-md">
                  {formatCurrency(item.revenue || 0)} • {item.bookings || 0} đơn
                </div>

                {/* Dual Bars */}
                <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-44">
                  {/* Revenue Bar */}
                  <div
                    style={{ height: revHeight }}
                    className={`w-4 sm:w-6 rounded-t-md transition-all shadow-xs ${
                      item.revenue > 0
                        ? 'bg-gradient-to-t from-primary to-sky-400 group-hover:brightness-110'
                        : 'bg-slate-200'
                    }`}
                    title={`Doanh thu: ${formatCurrency(item.revenue || 0)}`}
                  />
                  {/* Bookings Bar */}
                  <div
                    style={{ height: bookHeight }}
                    className={`w-3 sm:w-4 rounded-t-md transition-all shadow-xs ${
                      item.bookings > 0
                        ? 'bg-cyan-400/80 group-hover:bg-cyan-400'
                        : 'bg-slate-200/70'
                    }`}
                    title={`Lượt đặt: ${item.bookings || 0} đơn`}
                  />
                </div>

                <span className="text-xs font-bold text-slate-500 mt-2">
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>

        <div className="pt-4 flex items-center justify-between text-xs text-slate-500">
          <span>
            Tổng doanh thu ghi nhận:{' '}
            <strong className="text-slate-900 font-bold">
              {formatCurrency(totalRevenue || 0)}
            </strong>
          </span>
          <span className="text-primary font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">insights</span>
            Dữ liệu cập nhật theo thời gian thực
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
            {totalBookings > 0 ? (
              <>
                {pendingPct > 0 && (
                  <div
                    style={{ width: `${pendingPct}%` }}
                    className="bg-amber-400 h-full transition-all"
                    title={`Pending: ${pending}`}
                  />
                )}
                {confirmedPct > 0 && (
                  <div
                    style={{ width: `${confirmedPct}%` }}
                    className="bg-sky-500 h-full transition-all"
                    title={`Confirmed: ${confirmed}`}
                  />
                )}
                {completedPct > 0 && (
                  <div
                    style={{ width: `${completedPct}%` }}
                    className="bg-emerald-500 h-full transition-all"
                    title={`Completed: ${completed}`}
                  />
                )}
                {cancelledPct > 0 && (
                  <div
                    style={{ width: `${cancelledPct}%` }}
                    className="bg-rose-500 h-full transition-all"
                    title={`Cancelled: ${cancelled}`}
                  />
                )}
              </>
            ) : (
              <div className="w-full h-full bg-slate-200" title="Chưa có dữ liệu" />
            )}
          </div>

          {/* Status Breakdown List */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="text-xs font-semibold text-slate-700">
                  Chờ duyệt (Pending)
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-900 mr-2">
                  {pending} đơn
                </span>
                <span className="text-[11px] text-slate-400">({pendingPct}%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-sky-500" />
                <span className="text-xs font-semibold text-slate-700">
                  Đã xác nhận (Confirmed)
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-900 mr-2">
                  {confirmed} đơn
                </span>
                <span className="text-[11px] text-slate-400">({confirmedPct}%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-slate-700">
                  Hoàn thành (Completed)
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-900 mr-2">
                  {completed} đơn
                </span>
                <span className="text-[11px] text-slate-400">({completedPct}%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="text-xs font-semibold text-slate-700">
                  Đã hủy (Cancelled)
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-900 mr-2">
                  {cancelled} đơn
                </span>
                <span className="text-[11px] text-slate-400">({cancelledPct}%)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
          <span>
            Tổng cộng: <strong className="text-slate-700">{totalBookings} đơn</strong>
          </span>
          <span className="text-sky-600 font-semibold">Tự động đồng bộ</span>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;
