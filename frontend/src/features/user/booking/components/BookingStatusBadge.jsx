import React from 'react';

export const BookingStatusBadge = ({ status }) => {
  const normalized = (status || 'pending').toLowerCase();

  const configs = {
    pending: {
      label: 'Chờ xác nhận',
      className: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: 'schedule',
    },
    confirmed: {
      label: 'Đã xác nhận',
      className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: 'verified',
    },
    completed: {
      label: 'Hoàn thành',
      className: 'bg-sky-50 text-sky-700 border-sky-200',
      icon: 'task_alt',
    },
    cancelled: {
      label: 'Đã hủy',
      className: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: 'cancel',
    },
  };

  const config = configs[normalized] || configs.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-xs ${config.className}`}
    >
      <span className="material-symbols-outlined text-[15px]">{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
};

export default BookingStatusBadge;
